# Format Converter

![FormatConverter](https://github.com/liljemery/FormatConverter/assets/112432349/6efb87fd-cb18-4864-aa5d-4d78da8ecb1f)

## Description

Format is a JavaScript module that allows you to easily convert image files to WebP format (for the moment ). This module is lightweight and can be used with any JavaScript framework.

## Installation

You can install the module via npm:

```bash
npm install format-converter
```

## Usage

Here's how you can use the `ToWebP` function to convert an image file to WebP format:

### Importing the module

If you are using a module bundler like Webpack or Rollup, you can import the function:

```javascript
import { ToWebP } from 'format-converter';
```

### Converting an image to WebP

To convert an image file to WebP format, use the `ToWebP` function:

```javascript

const webpData = await ToWebP(imageFile);

```

### Example

Here is a complete example of how to use the `ToWebP` function:

```javascript
import { ToWebP } from 'format-converter';

const imageFile = document.querySelector('input[type="file"]').files[0];

ToWebP(imageFile)
    .then(webpBlob => {
        console.log('Image converted to WebP format:', webpBlob);
        // Do something with the WebP blob, e.g., create a URL for it
        const webpURL = URL.createObjectURL(webpBlob);
        const imgElement = document.createElement('img');
        imgElement.src = webpURL;
        document.body.appendChild(imgElement);
    })
    .catch(error => {
        console.error('Error converting image to WebP:', error);
    });
```

## API

### `ToWebP(imageFile)`

#### Parameters

- `imageFile` (File): The image file you want to convert to WebP format.

#### Returns

- `Promise<Blob>`: A promise that resolves to a Blob object representing the WebP image.

## Contributing

If you'd like to contribute to this project, please open an issue or submit a pull request on GitHub.

## License

This project is licensed under the MIT License.
