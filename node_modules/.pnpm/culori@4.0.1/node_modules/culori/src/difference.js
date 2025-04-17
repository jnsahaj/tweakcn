import { getMode } from './modes.js';
import converter from './converter.js';
import normalizeHue from './util/normalizeHue.js';

const differenceHueSaturation = (std, smp) => {
	if (std.h === undefined || smp.h === undefined || !std.s || !smp.s) {
		return 0;
	}
	let std_h = normalizeHue(std.h);
	let smp_h = normalizeHue(smp.h);
	let dH = Math.sin((((smp_h - std_h + 360) / 2) * Math.PI) / 180);
	return 2 * Math.sqrt(std.s * smp.s) * dH;
};

const differenceHueNaive = (std, smp) => {
	if (std.h === undefined || smp.h === undefined) {
		return 0;
	}
	let std_h = normalizeHue(std.h);
	let smp_h = normalizeHue(smp.h);
	if (Math.abs(smp_h - std_h) > 180) {
		// todo should this be normalized once again?
		return std_h - (smp_h - 360 * Math.sign(smp_h - std_h));
	}
	return smp_h - std_h;
};

const differenceHueChroma = (std, smp) => {
	if (std.h === undefined || smp.h === undefined || !std.c || !smp.c) {
		return 0;
	}
	let std_h = normalizeHue(std.h);
	let smp_h = normalizeHue(smp.h);
	let dH = Math.sin((((smp_h - std_h + 360) / 2) * Math.PI) / 180);
	return 2 * Math.sqrt(std.c * smp.c) * dH;
};

const differenceEuclidean = (mode = 'rgb', weights = [1, 1, 1, 0]) => {
	let def = getMode(mode);
	let channels = def.channels;
	let diffs = def.difference;
	let conv = converter(mode);
	return (std, smp) => {
		let ConvStd = conv(std);
		let ConvSmp = conv(smp);
		return Math.sqrt(
			channels.reduce((sum, k, idx) => {
				let delta = diffs[k]
					? diffs[k](ConvStd, ConvSmp)
					: ConvStd[k] - ConvSmp[k];
				return (
					sum +
					(weights[idx] || 0) * Math.pow(isNaN(delta) ? 0 : delta, 2)
				);
			}, 0)
		);
	};
};

const differenceCie76 = () => differenceEuclidean('lab65');

const differenceCie94 = (kL = 1, K1 = 0.045, K2 = 0.015) => {
	let lab = converter('lab65');

	return (std, smp) => {
		let LabStd = lab(std);
		let LabSmp = lab(smp);

		// Extract Lab values, and compute Chroma
		let lStd = LabStd.l;
		let aStd = LabStd.a;
		let bStd = LabStd.b;
		let cStd = Math.sqrt(aStd * aStd + bStd * bStd);

		let lSmp = LabSmp.l;
		let aSmp = LabSmp.a;
		let bSmp = LabSmp.b;
		let cSmp = Math.sqrt(aSmp * aSmp + bSmp * bSmp);

		let dL2 = Math.pow(lStd - lSmp, 2);
		let dC2 = Math.pow(cStd - cSmp, 2);
		let dH2 = Math.pow(aStd - aSmp, 2) + Math.pow(bStd - bSmp, 2) - dC2;

		return Math.sqrt(
			dL2 / Math.pow(kL, 2) +
				dC2 / Math.pow(1 + K1 * cStd, 2) +
				dH2 / Math.pow(1 + K2 * cStd, 2)
		);
	};
};

/*
	CIEDE2000 color difference, original Matlab implementation by Gaurav Sharma
	Based on "The CIEDE2000 Color-Difference Formula: Implementation Notes, Supplementary Test Data, and Mathematical Observations" 
	by Gaurav Sharma, Wencheng Wu, Edul N. Dalal in Color Research and Application, vol. 30. No. 1, pp. 21-30, February 2005.
	http://www2.ece.rochester.edu/~gsharma/ciede2000/
 */

const differenceCiede2000 = (Kl = 1, Kc = 1, Kh = 1) => {
	let lab = converter('lab65');
	return (std, smp) => {
		let LabStd = lab(std);
		let LabSmp = lab(smp);

		let lStd = LabStd.l;
		let aStd = LabStd.a;
		let bStd = LabStd.b;
		let cStd = Math.sqrt(aStd * aStd + bStd * bStd);

		let lSmp = LabSmp.l;
		let aSmp = LabSmp.a;
		let bSmp = LabSmp.b;
		let cSmp = Math.sqrt(aSmp * aSmp + bSmp * bSmp);

		let cAvg = (cStd + cSmp) / 2;

		let G =
			0.5 *
			(1 -
				Math.sqrt(
					Math.pow(cAvg, 7) / (Math.pow(cAvg, 7) + Math.pow(25, 7))
				));

		let apStd = aStd * (1 + G);
		let apSmp = aSmp * (1 + G);

		let cpStd = Math.sqrt(apStd * apStd + bStd * bStd);
		let cpSmp = Math.sqrt(apSmp * apSmp + bSmp * bSmp);

		let hpStd =
			Math.abs(apStd) + Math.abs(bStd) === 0
				? 0
				: Math.atan2(bStd, apStd);
		hpStd += (hpStd < 0) * 2 * Math.PI;

		let hpSmp =
			Math.abs(apSmp) + Math.abs(bSmp) === 0
				? 0
				: Math.atan2(bSmp, apSmp);
		hpSmp += (hpSmp < 0) * 2 * Math.PI;

		let dL = lSmp - lStd;
		let dC = cpSmp - cpStd;

		let dhp = cpStd * cpSmp === 0 ? 0 : hpSmp - hpStd;
		dhp -= (dhp > Math.PI) * 2 * Math.PI;
		dhp += (dhp < -Math.PI) * 2 * Math.PI;

		let dH = 2 * Math.sqrt(cpStd * cpSmp) * Math.sin(dhp / 2);

		let Lp = (lStd + lSmp) / 2;
		let Cp = (cpStd + cpSmp) / 2;

		let hp;
		if (cpStd * cpSmp === 0) {
			hp = hpStd + hpSmp;
		} else {
			hp = (hpStd + hpSmp) / 2;
			hp -= (Math.abs(hpStd - hpSmp) > Math.PI) * Math.PI;
			hp += (hp < 0) * 2 * Math.PI;
		}

		let Lpm50 = Math.pow(Lp - 50, 2);
		let T =
			1 -
			0.17 * Math.cos(hp - Math.PI / 6) +
			0.24 * Math.cos(2 * hp) +
			0.32 * Math.cos(3 * hp + Math.PI / 30) -
			0.2 * Math.cos(4 * hp - (63 * Math.PI) / 180);

		let Sl = 1 + (0.015 * Lpm50) / Math.sqrt(20 + Lpm50);
		let Sc = 1 + 0.045 * Cp;
		let Sh = 1 + 0.015 * Cp * T;

		let deltaTheta =
			((30 * Math.PI) / 180) *
			Math.exp(-1 * Math.pow(((180 / Math.PI) * hp - 275) / 25, 2));
		let Rc =
			2 *
			Math.sqrt(Math.pow(Cp, 7) / (Math.pow(Cp, 7) + Math.pow(25, 7)));

		let Rt = -1 * Math.sin(2 * deltaTheta) * Rc;

		return Math.sqrt(
			Math.pow(dL / (Kl * Sl), 2) +
				Math.pow(dC / (Kc * Sc), 2) +
				Math.pow(dH / (Kh * Sh), 2) +
				(((Rt * dC) / (Kc * Sc)) * dH) / (Kh * Sh)
		);
	};
};

/*
	CMC (l:c) difference formula

	References:
		https://en.wikipedia.org/wiki/Color_difference#CMC_l:c_(1984)
		http://www.brucelindbloom.com/index.html?Eqn_DeltaE_CMC.html
 */
const differenceCmc = (l = 1, c = 1) => {
	let lab = converter('lab65');

	/*
		Comparte two colors:
		std - standard (first) color
		smp - sample (second) color
	 */
	return (std, smp) => {
		// convert standard color to Lab
		let LabStd = lab(std);
		let lStd = LabStd.l;
		let aStd = LabStd.a;
		let bStd = LabStd.b;

		// Obtain hue/chroma
		let cStd = Math.sqrt(aStd * aStd + bStd * bStd);
		let hStd = Math.atan2(bStd, aStd);
		hStd = hStd + 2 * Math.PI * (hStd < 0);

		// convert sample color to Lab, obtain LCh
		let LabSmp = lab(smp);
		let lSmp = LabSmp.l;
		let aSmp = LabSmp.a;
		let bSmp = LabSmp.b;

		// Obtain chroma
		let cSmp = Math.sqrt(aSmp * aSmp + bSmp * bSmp);

		// lightness delta squared
		let dL2 = Math.pow(lStd - lSmp, 2);

		// chroma delta squared
		let dC2 = Math.pow(cStd - cSmp, 2);

		// hue delta squared
		let dH2 = Math.pow(aStd - aSmp, 2) + Math.pow(bStd - bSmp, 2) - dC2;

		let F = Math.sqrt(Math.pow(cStd, 4) / (Math.pow(cStd, 4) + 1900));
		let T =
			hStd >= (164 / 180) * Math.PI && hStd <= (345 / 180) * Math.PI
				? 0.56 + Math.abs(0.2 * Math.cos(hStd + (168 / 180) * Math.PI))
				: 0.36 + Math.abs(0.4 * Math.cos(hStd + (35 / 180) * Math.PI));

		let Sl = lStd < 16 ? 0.511 : (0.040975 * lStd) / (1 + 0.01765 * lStd);
		let Sc = (0.0638 * cStd) / (1 + 0.0131 * cStd) + 0.638;
		let Sh = Sc * (F * T + 1 - F);

		return Math.sqrt(
			dL2 / Math.pow(l * Sl, 2) +
				dC2 / Math.pow(c * Sc, 2) +
				dH2 / Math.pow(Sh, 2)
		);
	};
};

/*

	HyAB color difference formula, introduced in:

		Abasi S, Amani Tehran M, Fairchild MD. 
		"Distance metrics for very large color differences."
		Color Res Appl. 2019; 1–16. 
		https://doi.org/10.1002/col.22451

	PDF available at:
	
		http://markfairchild.org/PDFs/PAP40.pdf
 */
const differenceHyab = () => {
	let lab = converter('lab65');
	return (std, smp) => {
		let LabStd = lab(std);
		let LabSmp = lab(smp);
		let dL = LabStd.l - LabSmp.l;
		let dA = LabStd.a - LabSmp.a;
		let dB = LabStd.b - LabSmp.b;
		return Math.abs(dL) + Math.sqrt(dA * dA + dB * dB);
	};
};

/*
	"Measuring perceived color difference using YIQ NTSC
	transmission color space in mobile applications"
		
		by Yuriy Kotsarenko, Fernando Ramos in:
		Programación Matemática y Software (2010) 

	Available at:
		
		http://www.progmat.uaem.mx:8080/artVol2Num2/Articulo3Vol2Num2.pdf
 */
const differenceKotsarenkoRamos = () =>
	differenceEuclidean('yiq', [0.5053, 0.299, 0.1957]);

/*
	ΔE_ITP, as defined in Rec. ITU-R BT.2124:

	https://www.itu.int/rec/R-REC-BT.2124/en
*/
const differenceItp = () =>
	differenceEuclidean('itp', [518400, 129600, 518400]);

export {
	differenceHueChroma,
	differenceHueSaturation,
	differenceHueNaive,
	differenceEuclidean,
	differenceCie76,
	differenceCie94,
	differenceCiede2000,
	differenceCmc,
	differenceHyab,
	differenceKotsarenkoRamos,
	differenceItp
};
