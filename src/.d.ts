declare module "format-converter" {
	export type OutputFitMode = "contain" | "cover" | "fill";

	export interface ConvertOptions {
		format?: string;
		quality?: number;
		width?: number;
		height?: number;
		maxWidth?: number;
		maxHeight?: number;
		fit?: OutputFitMode;
	}

	export interface DrawLayout {
		canvasWidth: number;
		canvasHeight: number;
		sx: number;
		sy: number;
		sw: number;
		sh: number;
		dx: number;
		dy: number;
		dw: number;
		dh: number;
	}

	export function computeDrawLayout(
		naturalWidth: number,
		naturalHeight: number,
		options?: Pick<
			ConvertOptions,
			"width" | "height" | "maxWidth" | "maxHeight" | "fit"
		>
	): DrawLayout;

	export function toFormat(
		imageFile: File | Blob,
		options?: ConvertOptions
	): Promise<Blob>;

	export function getSupportedOutputFormats(): readonly string[];

	export function toWebP(
		imageFile: File | Blob,
		options?: Omit<ConvertOptions, "format">
	): Promise<Blob>;

	export function toPNG(
		imageFile: File | Blob,
		options?: Omit<ConvertOptions, "format">
	): Promise<Blob>;

	export function toJPG(
		imageFile: File | Blob,
		options?: Omit<ConvertOptions, "format">
	): Promise<Blob>;

	export function toJPEG(
		imageFile: File | Blob,
		options?: Omit<ConvertOptions, "format">
	): Promise<Blob>;

	export function toAVIF(
		imageFile: File | Blob,
		options?: Omit<ConvertOptions, "format">
	): Promise<Blob>;

	export function toPDF(
		imageFile: File | Blob,
		options?: Omit<ConvertOptions, "format">
	): Promise<Blob>;
}
