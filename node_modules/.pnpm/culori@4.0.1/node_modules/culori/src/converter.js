import { converters } from './modes.js';
import prepare from './_prepare.js';

const converter =
	(target_mode = 'rgb') =>
	color =>
		(color = prepare(color, target_mode)) !== undefined
			? // if the color's mode corresponds to our target mode
			  color.mode === target_mode
				? // then just return the color
				  color
				: // otherwise check to see if we have a dedicated
				// converter for the target mode
				converters[color.mode][target_mode]
				? // and return its result...
				  converters[color.mode][target_mode](color)
				: // ...otherwise pass through RGB as an intermediary step.
				// if the target mode is RGB...
				target_mode === 'rgb'
				? // just return the RGB
				  converters[color.mode].rgb(color)
				: // otherwise convert color.mode -> RGB -> target_mode
				  converters.rgb[target_mode](converters[color.mode].rgb(color))
			: undefined;

export default converter;
