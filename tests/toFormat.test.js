/**
 * @vitest-environment happy-dom
 */
import { describe, expect, it, vi } from "vitest";
import {
	getSupportedOutputFormats,
	toFormat,
	toWebP,
} from "../src/FormatConverter.js";

vi.stubGlobal(
	"Image",
	class {
		constructor() {
			this.onload = null;
			this.onerror = null;
			this.naturalWidth = 120;
			this.naturalHeight = 80;
		}
		set src(_value) {
			queueMicrotask(() => this.onload?.());
		}
	}
);

const originalCreateElement = document.createElement.bind(document);

vi.spyOn(document, "createElement").mockImplementation((tag) => {
	if (tag !== "canvas") {
		return originalCreateElement(tag);
	}
	const el = originalCreateElement("canvas");
	el.getContext = () => ({
		drawImage: vi.fn(),
		clearRect: vi.fn(),
	});
	el.toBlob = (callback, type, _quality) => {
		callback(new Blob([new Uint8Array([1, 2, 3])], { type: type ?? "image/png" }));
	};
	return el;
});

describe("toFormat", () => {
	it("lists supported formats", () => {
		const list = getSupportedOutputFormats();
		expect(list).toContain("webp");
		expect(list).toContain("pdf");
		expect(list).toContain("avif");
	});

	it("rejects invalid format", async () => {
		const file = new File([], "x.png", { type: "image/png" });
		await expect(toFormat(file, { format: "exe" })).rejects.toThrow(
			/Unsupported format/
		);
	});

	it("defaults to webp", async () => {
		const file = new File([], "x.png", { type: "image/png" });
		const blob = await toFormat(file);
		expect(blob.type).toBe("image/webp");
	});

	it("toWebP matches explicit webp", async () => {
		const file = new File([], "x.png", { type: "image/png" });
		const a = await toWebP(file);
		const b = await toFormat(file, { format: "webp" });
		expect(a.type).toBe(b.type);
	});

	it("builds PDF from canvas jpeg", async () => {
		const file = new File([], "x.png", { type: "image/png" });
		const blob = await toFormat(file, { format: "pdf" });
		expect(blob.type).toBe("application/pdf");
		const buf = new Uint8Array(await blob.arrayBuffer());
		const head = new TextDecoder("latin1").decode(buf.subarray(0, 5));
		expect(head).toBe("%PDF-");
	});
});
