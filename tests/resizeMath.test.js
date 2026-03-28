import { describe, expect, it } from "vitest";
import { computeDrawLayout } from "../src/resizeMath.js";

describe("computeDrawLayout", () => {
	it("returns full-size layout when no options", () => {
		const L = computeDrawLayout(800, 600);
		expect(L.canvasWidth).toBe(800);
		expect(L.canvasHeight).toBe(600);
		expect(L.dw).toBe(800);
		expect(L.dh).toBe(600);
		expect(L.dx).toBe(0);
		expect(L.dy).toBe(0);
	});

	it("scales down with maxWidth and maxHeight", () => {
		const L = computeDrawLayout(1000, 500, { maxWidth: 500, maxHeight: 500 });
		expect(L.canvasWidth).toBe(500);
		expect(L.canvasHeight).toBe(250);
	});

	it("does not upscale with max constraints", () => {
		const L = computeDrawLayout(100, 100, { maxWidth: 2000, maxHeight: 2000 });
		expect(L.canvasWidth).toBe(100);
		expect(L.canvasHeight).toBe(100);
	});

	it("contain letterboxes inside fixed box", () => {
		const L = computeDrawLayout(800, 400, {
			width: 400,
			height: 400,
			fit: "contain",
		});
		expect(L.canvasWidth).toBe(400);
		expect(L.canvasHeight).toBe(400);
		expect(L.dw).toBe(400);
		expect(L.dh).toBe(200);
		expect(L.dx).toBe(0);
		expect(L.dy).toBe(100);
	});

	it("cover centers overflow", () => {
		const L = computeDrawLayout(800, 400, {
			width: 400,
			height: 400,
			fit: "cover",
		});
		expect(L.canvasWidth).toBe(400);
		expect(L.canvasHeight).toBe(400);
		expect(L.dw).toBe(800);
		expect(L.dh).toBe(400);
		expect(L.dx).toBe(-200);
		expect(L.dy).toBe(0);
	});

	it("fill stretches to box", () => {
		const L = computeDrawLayout(100, 100, {
			width: 200,
			height: 50,
			fit: "fill",
		});
		expect(L.canvasWidth).toBe(200);
		expect(L.canvasHeight).toBe(50);
		expect(L.dw).toBe(200);
		expect(L.dh).toBe(50);
	});

	it("width-only preserves aspect ratio", () => {
		const L = computeDrawLayout(800, 400, { width: 200 });
		expect(L.canvasWidth).toBe(200);
		expect(L.canvasHeight).toBe(100);
	});

	it("height-only preserves aspect ratio", () => {
		const L = computeDrawLayout(800, 400, { height: 100 });
		expect(L.canvasWidth).toBe(200);
		expect(L.canvasHeight).toBe(100);
	});

	it("throws on non-positive dimensions", () => {
		expect(() => computeDrawLayout(0, 100)).toThrow(/positive/);
	});
});
