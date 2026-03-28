import {
	getSupportedOutputFormats,
	toFormat,
} from "format-converter";

const fileInput = document.querySelector("#file");
const formatSelect = document.querySelector("#format");
const qualityInput = document.querySelector("#quality");
const maxW = document.querySelector("#maxW");
const maxH = document.querySelector("#maxH");
const wInput = document.querySelector("#w");
const hInput = document.querySelector("#h");
const fitSelect = document.querySelector("#fit");
const statusEl = document.querySelector("#status");
const convertBtn = document.querySelector("#convert");
const downloadBtn = document.querySelector("#download");
const preview = document.querySelector("#preview");

let lastBlob = null;
let lastObjectUrl = null;

function setStatus(message, isError = false) {
	statusEl.textContent = message ?? "";
	statusEl.classList.toggle("error", Boolean(isError));
}

function revokePreview() {
	if (lastObjectUrl) {
		URL.revokeObjectURL(lastObjectUrl);
		lastObjectUrl = null;
	}
}

for (const f of getSupportedOutputFormats()) {
	const opt = document.createElement("option");
	opt.value = f;
	opt.textContent = f;
	formatSelect.appendChild(opt);
}

fileInput.addEventListener("change", () => {
	revokePreview();
	lastBlob = null;
	preview.hidden = true;
	downloadBtn.disabled = true;
	convertBtn.disabled = !fileInput.files?.length;
	setStatus("");
});

convertBtn.addEventListener("click", async () => {
	const file = fileInput.files?.[0];
	if (!file) return;

	convertBtn.disabled = true;
	downloadBtn.disabled = true;
	setStatus("Converting…");

	const quality = Number(qualityInput.value);
	const options = {
		format: formatSelect.value,
		quality: Number.isFinite(quality) ? quality : 0.92,
		fit: fitSelect.value,
	};

	const mw = maxW.value.trim();
	const mh = maxH.value.trim();
	if (mw) options.maxWidth = Number(mw);
	if (mh) options.maxHeight = Number(mh);

	const ew = wInput.value.trim();
	const eh = hInput.value.trim();
	if (ew) options.width = Number(ew);
	if (eh) options.height = Number(eh);

	try {
		const blob = await toFormat(file, options);
		lastBlob = blob;
		revokePreview();
		lastObjectUrl = URL.createObjectURL(blob);
		preview.src = lastObjectUrl;
		preview.hidden = blob.type === "application/pdf";
		setStatus(`Done — ${blob.type}, ${(blob.size / 1024).toFixed(1)} KB`);
		downloadBtn.disabled = false;
	} catch (err) {
		setStatus(err?.message ?? String(err), true);
		preview.hidden = true;
	} finally {
		convertBtn.disabled = !fileInput.files?.length;
	}
});

downloadBtn.addEventListener("click", () => {
	if (!lastBlob) return;
	const ext =
		lastBlob.type === "image/webp"
			? "webp"
			: lastBlob.type === "image/png"
				? "png"
				: lastBlob.type === "image/jpeg"
					? "jpg"
					: lastBlob.type === "image/avif"
						? "avif"
						: lastBlob.type === "application/pdf"
							? "pdf"
							: "bin";
	const base = (fileInput.files?.[0]?.name ?? "image").replace(/\.[^.]+$/, "");
	const a = document.createElement("a");
	a.href = URL.createObjectURL(lastBlob);
	a.download = `${base}.${ext}`;
	a.click();
	URL.revokeObjectURL(a.href);
});
