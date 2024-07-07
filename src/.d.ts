declare module "format-converter" {
	export function toWebP(imageFile: File): Promise<Blob>;
	export function toPNG(imageFile: File): Promise<Blob>;
	export function toJPG(imageFile: File): Promise<Blob>;
	export function toPDF(imageFile: File): Promise<Blob>;
}

export { toWebP, toPNG, toJPG, toPDF };
