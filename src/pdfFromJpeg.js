/**
 * Builds a minimal single-page PDF embedding a JPEG stream (DCTDecode).
 * @param {Uint8Array} jpegBytes
 * @param {number} widthPt Page / image width in PDF units (points).
 * @param {number} heightPt Page / image height in PDF units (points).
 * @returns {Blob}
 */
export function jpegBytesToPdfBlob(jpegBytes, widthPt, heightPt) {
	const enc = new TextEncoder();
	const parts = [];
	const offsets = [];
	let cursor = 0;

	const pushText = (s) => {
		const b = enc.encode(s);
		parts.push(b);
		cursor += b.length;
	};

	const pushBytes = (b) => {
		parts.push(b);
		cursor += b.length;
	};

	const markObject = (id) => {
		offsets[id] = cursor;
	};

	pushText("%PDF-1.4\n");

	markObject(1);
	pushText("1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n");

	markObject(2);
	pushText("2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n");

	markObject(3);
	pushText(
		`3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${widthPt} ${heightPt}] /Contents 4 0 R /Resources << /XObject << /Im1 5 0 R >> >> >>\nendobj\n`
	);

	const content = `q\n${widthPt} 0 0 ${heightPt} 0 0 cm\n/Im1 Do\nQ\n`;
	markObject(4);
	pushText(`4 0 obj\n<< /Length ${content.length} >>\nstream\n${content}endstream\nendobj\n`);

	markObject(5);
	const header = `5 0 obj\n<< /Type /XObject /Subtype /Image /Width ${Math.round(widthPt)} /Height ${Math.round(heightPt)} /ColorSpace /DeviceRGB /Filter /DCTDecode /BitsPerComponent 8 /Length ${jpegBytes.length} >>\nstream\n`;
	pushText(header);
	pushBytes(jpegBytes);
	pushText("\nendstream\nendobj\n");

	const xrefStart = cursor;
	const maxId = 5;
	let xref = `xref\n0 ${maxId + 1}\n`;
	xref += "0000000000 65535 f \n";
	for (let i = 1; i <= maxId; i += 1) {
		const off = String(offsets[i]).padStart(10, "0");
		xref += `${off} 00000 n \n`;
	}
	const trailer = `trailer\n<< /Size ${maxId + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF\n`;
	pushText(xref + trailer);

	const total = parts.reduce((n, p) => n + p.length, 0);
	const out = new Uint8Array(total);
	let o = 0;
	for (const p of parts) {
		out.set(p, o);
		o += p.length;
	}
	return new Blob([out], { type: "application/pdf" });
}
