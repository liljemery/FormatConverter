/**
 * Computes canvas size and drawImage parameters for optional resize / fit modes.
 * @param {number} naturalWidth
 * @param {number} naturalHeight
 * @param {{ width?: number, height?: number, maxWidth?: number, maxHeight?: number, fit?: 'contain' | 'cover' | 'fill' }} [options]
 * @returns {{ canvasWidth: number, canvasHeight: number, sx: number, sy: number, sw: number, sh: number, dx: number, dy: number, dw: number, dh: number }}
 */
export function computeDrawLayout(naturalWidth, naturalHeight, options = {}) {
	if (naturalWidth <= 0 || naturalHeight <= 0) {
		throw new Error("Image dimensions must be positive");
	}

	const fit = options.fit ?? "contain";
	const { width: outW, height: outH, maxWidth, maxHeight } = options;

	let nw = naturalWidth;
	let nh = naturalHeight;

	const applyMax = () => {
		if (maxWidth == null && maxHeight == null) return;
		const mw = maxWidth ?? Number.POSITIVE_INFINITY;
		const mh = maxHeight ?? Number.POSITIVE_INFINITY;
		const scale = Math.min(1, mw / nw, mh / nh);
		if (scale < 1) {
			nw = Math.round(nw * scale);
			nh = Math.round(nh * scale);
		}
	};

	const baseDraw = () => ({
		sx: 0,
		sy: 0,
		sw: naturalWidth,
		sh: naturalHeight,
		dx: 0,
		dy: 0,
		dw: nw,
		dh: nh,
		canvasWidth: nw,
		canvasHeight: nh,
	});

	if (outW != null && outH != null) {
		if (fit === "fill") {
			return {
				canvasWidth: Math.round(outW),
				canvasHeight: Math.round(outH),
				sx: 0,
				sy: 0,
				sw: naturalWidth,
				sh: naturalHeight,
				dx: 0,
				dy: 0,
				dw: Math.round(outW),
				dh: Math.round(outH),
			};
		}
		const bw = Math.round(outW);
		const bh = Math.round(outH);
		const scale =
			fit === "contain"
				? Math.min(bw / naturalWidth, bh / naturalHeight)
				: Math.max(bw / naturalWidth, bh / naturalHeight);
		const dw = naturalWidth * scale;
		const dh = naturalHeight * scale;
		const dx = (bw - dw) / 2;
		const dy = (bh - dh) / 2;
		return {
			canvasWidth: bw,
			canvasHeight: bh,
			sx: 0,
			sy: 0,
			sw: naturalWidth,
			sh: naturalHeight,
			dx,
			dy,
			dw,
			dh,
		};
	}

	if (outW != null) {
		const scale = outW / naturalWidth;
		nw = Math.round(outW);
		nh = Math.max(1, Math.round(naturalHeight * scale));
		applyMax();
		return baseDraw();
	}

	if (outH != null) {
		const scale = outH / naturalHeight;
		nh = Math.round(outH);
		nw = Math.max(1, Math.round(naturalWidth * scale));
		applyMax();
		return baseDraw();
	}

	applyMax();
	return baseDraw();
}
