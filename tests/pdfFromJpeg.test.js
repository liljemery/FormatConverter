import { describe, expect, it } from "vitest";
import { jpegBytesToPdfBlob } from "../src/pdfFromJpeg.js";

describe("jpegBytesToPdfBlob", () => {
	it("returns a PDF blob with expected markers", async () => {
		const jpeg = new Uint8Array([0xff, 0xd8, 0xff, 0xd9]);
		const blob = jpegBytesToPdfBlob(jpeg, 64, 48);
		expect(blob.type).toBe("application/pdf");
		const buf = new Uint8Array(await blob.arrayBuffer());
		const head = new TextDecoder("latin1").decode(buf.subarray(0, 8));
		expect(head.startsWith("%PDF-")).toBe(true);
		const tail = new TextDecoder("latin1").decode(buf.subarray(buf.length - 32));
		expect(tail).toContain("%%EOF");
		expect(tail).toContain("startxref");
	});

	it("embeds JPEG length in image dictionary", async () => {
		const jpeg = new Uint8Array([1, 2, 3, 4, 5]);
		const blob = jpegBytesToPdfBlob(jpeg, 10, 20);
		const text = new TextDecoder("latin1").decode(await blob.arrayBuffer());
		expect(text).toContain("/DCTDecode");
		expect(text).toContain("/Length 5");
	});
});
