const toWebP = async (imageFile) => {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.onload = () => {
			const canvas = document.createElement("canvas");
			canvas.width = img.width;
			canvas.height = img.height;
			const ctx = canvas.getContext("2d");
			ctx.drawImage(img, 0, 0);
			canvas.toBlob(
				(blob) => {
					resolve(blob);
				},
				"image/webp",
				1
			);
		};
		img.onerror = (error) => {
			reject(error);
		};
		img.src = URL.createObjectURL(imageFile);
	});
};

const toPNG = async (imageFile) => {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.onload = () => {
			const canvas = document.createElement("canvas");
			canvas.width = img.width;
			canvas.height = img.height;
			const ctx = canvas.getContext("2d");
			ctx.drawImage(img, 0, 0);
			canvas.toBlob(
				(blob) => {
					resolve(blob);
				},
				"image/png",
				1
			);
		};
		img.onerror = (error) => {
			reject(error);
		};
		img.src = URL.createObjectURL(imageFile);
	});
};

const toJPG = async (imageFile) => {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.onload = () => {
			const canvas = document.createElement("canvas");
			canvas.width = img.width;
			canvas.height = img.height;
			const ctx = canvas.getContext("2d");
			ctx.drawImage(img, 0, 0);
			canvas.toBlob(
				(blob) => {
					resolve(blob);
				},
				"image/jpeg",
				1
			);
		};
		img.onerror = (error) => {
			reject(error);
		};
		img.src = URL.createObjectURL(imageFile);
	});
};

const toPDF = async (imageFile) => {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.onload = () => {
			const canvas = document.createElement("canvas");
			canvas.width = img.width;
			canvas.height = img.height;
			const ctx = canvas.getContext("2d");
			ctx.drawImage(img, 0, 0);

			canvas.toBlob(
				(blob) => {
					const pdfBlob = new Blob([blob], { type: "application/pdf" });
					resolve(pdfBlob);
				},
				"image/jpeg",
				1
			);
		};
		img.onerror = (error) => {
			reject(error);
		};
		img.src = URL.createObjectURL(imageFile);
	});
};

export { toWebP, toPNG, toJPG, toPDF };
