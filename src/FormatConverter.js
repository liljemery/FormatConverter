import { computeDrawLayout } from "./resizeMath.js";
import { jpegBytesToPdfBlob } from "./pdfFromJpeg.js";

const FORMAT_TO_MIME = {
	webp: "image/webp",
	png: "image/png",
	jpeg: "image/jpeg",
	jpg: "image/jpeg",
	avif: "image/avif",
	pdf: "application/pdf",
};

const OUTPUT_FORMAT_KEYS = Object.freeze(Object.keys(FORMAT_TO_MIME));

function normalizeFormat(format) {
	if (format == null || typeof format !== "string") {
		throw new TypeError("format must be a non-empty string");
	}
	const key = format.trim().toLowerCase();
	if (!FORMAT_TO_MIME[key]) {
		throw new Error(
			`Unsupported format "${format}". Supported: ${OUTPUT_FORMAT_KEYS.join(", ")}`
		);
	}
	return key;
}

function canvasToBlob(canvas, mimeType, quality) {
	return new Promise((resolve, reject) => {
		const q =
			mimeType === "image/png" || mimeType === "application/pdf"
				? undefined
				: quality;
		canvas.toBlob(
			(blob) => {
				if (!blob) {
					reject(
						new Error(
							`Could not encode as ${mimeType}. The browser may not support this MIME type.`
						)
					);
					return;
				}
				resolve(blob);
			},
			mimeType,
			q
		);
	});
}

function loadImageFromFile(imageFile) {
	return new Promise((resolve, reject) => {
		const url = URL.createObjectURL(imageFile);
		const img = new Image();
		const cleanup = () => {
			URL.revokeObjectURL(url);
		};
		img.onload = () => {
			cleanup();
			resolve(img);
		};
		img.onerror = (err) => {
			cleanup();
			reject(err);
		};
		img.src = url;
	});
}

function drawFileToCanvas(imageFile, resizeOptions) {
	return loadImageFromFile(imageFile).then((img) => {
		const layout = computeDrawLayout(img.naturalWidth, img.naturalHeight, resizeOptions);
		const canvas = document.createElement("canvas");
		canvas.width = Math.max(1, Math.round(layout.canvasWidth));
		canvas.height = Math.max(1, Math.round(layout.canvasHeight));
		const ctx = canvas.getContext("2d");
		if (!ctx) {
			throw new Error("Could not get 2D canvas context");
		}
		if (
			resizeOptions?.width != null &&
			resizeOptions?.height != null &&
			(resizeOptions.fit ?? "contain") === "contain"
		) {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
		}
		ctx.drawImage(
			img,
			layout.sx,
			layout.sy,
			layout.sw,
			layout.sh,
			layout.dx,
			layout.dy,
			layout.dw,
			layout.dh
		);
		return { canvas, layout };
	});
}

/**
 * Convert an image file to another format, with optional resize.
 * @param {File} imageFile
 * @param {{ format?: string, quality?: number, width?: number, height?: number, maxWidth?: number, maxHeight?: number, fit?: 'contain' | 'cover' | 'fill' }} [options]
 * @returns {Promise<Blob>}
 */
export async function toFormat(imageFile, options = {}) {
	if (!(imageFile instanceof Blob)) {
		throw new TypeError("imageFile must be a File or Blob");
	}
	const format = normalizeFormat(options.format ?? "webp");
	const quality =
		typeof options.quality === "number"
			? Math.min(1, Math.max(0, options.quality))
			: 0.92;

	const resize = {
		width: options.width,
		height: options.height,
		maxWidth: options.maxWidth,
		maxHeight: options.maxHeight,
		fit: options.fit,
	};

	if (format === "pdf") {
		const { canvas } = await drawFileToCanvas(imageFile, resize);
		const jpegBlob = await canvasToBlob(canvas, "image/jpeg", quality);
		const buf = await jpegBlob.arrayBuffer();
		const jpegBytes = new Uint8Array(buf);
		return jpegBytesToPdfBlob(jpegBytes, canvas.width, canvas.height);
	}

	const mime = FORMAT_TO_MIME[format];
	const { canvas } = await drawFileToCanvas(imageFile, resize);
	return canvasToBlob(canvas, mime, quality);
}

export function getSupportedOutputFormats() {
	return [...OUTPUT_FORMAT_KEYS];
}

export const toWebP = (imageFile, resizeOptions) =>
	toFormat(imageFile, { ...resizeOptions, format: "webp" });

export const toPNG = (imageFile, resizeOptions) =>
	toFormat(imageFile, { ...resizeOptions, format: "png" });

export const toJPG = (imageFile, resizeOptions) =>
	toFormat(imageFile, { ...resizeOptions, format: "jpeg" });

export const toJPEG = toJPG;

export const toAVIF = (imageFile, resizeOptions) =>
	toFormat(imageFile, { ...resizeOptions, format: "avif" });

export const toPDF = (imageFile, resizeOptions) =>
	toFormat(imageFile, { ...resizeOptions, format: "pdf" });

export { computeDrawLayout } from "./resizeMath.js";
