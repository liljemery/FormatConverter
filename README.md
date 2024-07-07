# Format Converter

![NPM Downloads](https://img.shields.io/npm/dw/format-converter)

![FormatConverter](https://github.com/liljemery/FormatConverter/assets/112432349/6efb87fd-cb18-4864-aa5d-4d78da8ecb1f)

## Description

Format is a JavaScript module that allows you to easily convert image files to WebP format (for the moment ). This module is lightweight and can be used with any JavaScript framework.

## Installation

You can install the module via npm:

```bash
npm install format-converter
```

## Usage

Here's how you can use the `toWebP` function to convert an image file to WebP format:

### Importing the module

If you are using a module bundler like Webpack or Rollup, you can import the function:

```javascript
import { toWebP } from "format-converter";
```

### Converting an image to WebP

To convert an image file to WebP format, use the `toWebP` function:

```javascript
const webpData = await toWebP(imageFile);
```

### Example

Here is a complete example of how to use the `toWebP` function:

```javascript
import { toWebP } from "format-converter";

const imageFile = document.querySelector('input[type="file"]').files[0];

toWebP(imageFile)
	.then((webpBlob) => {
		// Do something with the WebP blob, e.g., create a URL for it
		const webpURL = URL.createObjectURL(webpBlob);
		const imgElement = document.createElement("img");
		imgElement.src = webpURL;
		document.body.appendChild(imgElement);
	})
	.catch((error) => {
		console.error("Error converting image to WebP:", error);
	});
```

Here is a complete example using the `toWebP` function and downloading the converted image:

```javascript
import { toWebP } from "format-converter";

const handleConvert = async (file) => {
	if (!file) return;
	const res = await toWebP(file);

	const downloadUrl = window.URL.createObjectURL(res);
	const downloadUrl = document.createElement("a");
	a.href = url;
	a.download = "test.webp";
	a.click();
};
```

## API

### `toWebP(imageFile)`

#### Parameters

- `imageFile` (File): The image file you want to convert to WebP format.

#### Returns

- `Promise<Blob>`: A promise that resolves to a Blob object representing the WebP image.

## Contributing

If you'd like to contribute to this project, please open an issue or submit a pull request on GitHub.

## License

This project is licensed under the MIT License.

| **Like this package?** Help others know why they should use it! **Share it on Linked In** |
| ----------------------------------------------------------------------------------------- |
