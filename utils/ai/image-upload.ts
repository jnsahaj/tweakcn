import { MAX_IMAGE_DIMENSION, TARGET_IMAGE_BYTES } from "@/lib/constants";

export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/svg+xml",
];

const COMPRESSION_QUALITIES = [0.85, 0.7, 0.55, 0.4];
const MAX_DOWNSCALE_ATTEMPTS = 3;

let supportsWebpEncodingCache: boolean | null = null;

function supportsWebpEncoding(): boolean {
  if (supportsWebpEncodingCache === null) {
    const canvas = document.createElement("canvas");
    canvas.width = 1;
    canvas.height = 1;
    supportsWebpEncodingCache = canvas.toDataURL("image/webp").startsWith("data:image/webp");
  }
  return supportsWebpEncodingCache;
}

async function decodeImageFile(file: File): Promise<ImageBitmap | HTMLImageElement> {
  if (typeof createImageBitmap === "function") {
    try {
      return await createImageBitmap(file);
    } catch {
      // Fall through to the <img> based decoder
    }
  }

  const objectUrl = URL.createObjectURL(file);
  try {
    return await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`Failed to decode "${file.name}"`));
      img.src = objectUrl;
    });
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Failed to encode image"))),
      type,
      quality
    );
  });
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === "string") resolve(result);
      else reject(new Error("Failed to read encoded image"));
    };
    reader.onerror = () => reject(new Error("Failed to read encoded image"));
    reader.onabort = () => reject(new Error("Failed to read encoded image"));
    reader.readAsDataURL(blob);
  });
}

/**
 * Downscales and re-encodes a raster image into a data URL small enough to survive the
 * serverless request body limit. The whole chat history (images included) is sent on every
 * request, so full resolution uploads quickly blow past it — and vision models downsample
 * to roughly this size anyway.
 */
export async function compressImageToDataUrl(file: File): Promise<string> {
  const source = await decodeImageFile(file);
  const { width, height } = source;

  if (!width || !height) {
    throw new Error(`Failed to decode "${file.name}"`);
  }

  const mimeType = supportsWebpEncoding() ? "image/webp" : "image/jpeg";
  let scale = Math.min(1, MAX_IMAGE_DIMENSION / Math.max(width, height));
  let smallest: Blob | null = null;

  try {
    for (let attempt = 0; attempt < MAX_DOWNSCALE_ATTEMPTS; attempt++) {
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(width * scale));
      canvas.height = Math.max(1, Math.round(height * scale));

      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas is not available");

      if (mimeType === "image/jpeg") {
        // JPEG has no alpha channel, so transparent pixels would render black
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      ctx.drawImage(source, 0, 0, canvas.width, canvas.height);

      for (const quality of COMPRESSION_QUALITIES) {
        const blob = await canvasToBlob(canvas, mimeType, quality);
        smallest = blob;
        if (blob.size <= TARGET_IMAGE_BYTES) return blobToDataUrl(blob);
      }

      scale *= 0.7;
    }
  } finally {
    if (typeof ImageBitmap !== "undefined" && source instanceof ImageBitmap) {
      source.close();
    }
  }

  if (!smallest) throw new Error(`Failed to compress "${file.name}"`);
  return blobToDataUrl(smallest);
}

export function validateSvgContent(svgText: string): boolean {
  try {
    const trimmed = svgText.trim();
    if (!trimmed.toLowerCase().includes("<svg")) {
      return false;
    }

    const dangerousPatterns = [
      /<script/i,
      /javascript:/i,
      /on\w+\s*=/i, // onclick, onload, etc.
      /<embed/i,
      /<object/i,
      /<iframe/i,
    ];

    return !dangerousPatterns.some((pattern) => pattern.test(svgText));
  } catch {
    return false;
  }
}

export function optimizeSvgContent(svgText: string): string {
  try {
    return svgText
      .replace(/<!--[\s\S]*?-->/g, "") // Remove comments
      .replace(/>\s+</g, "><") // Remove unnecessary whitespace
      .trim();
  } catch {
    return svgText.trim();
  }
}
