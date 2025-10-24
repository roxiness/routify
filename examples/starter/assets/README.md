# Assets Folder

This directory is designated for static assets in the Routify starter template. Assets placed in this folder can be accessed and utilized in your Routify projects in two primary ways.

## Method 1: Direct Reference from the Assets Folder

Files placed in the `/assets` folder can be referenced directly in your project using the path `/my-file.ext`. This is a straightforward method to include assets such as images, fonts, or static files in your project.

For example, if you have an image named `logo.png` in the `/assets` folder, you can include it in your Routify component like this:

```html
<img src="/logo.png" alt="Logo">
```

This method is simple and efficient for most use cases. However, if you require advanced handling, such as bundling or pre-processing, consider Method 2.

## Method 2: Import and Reference in Script

For more advanced scenarios, you may want to import the asset in the script section of a Svelte component and then reference it. This approach is useful when you want to leverage Rollup or Vite's asset handling features like hashing for cache busting, image optimization, or including assets in the JavaScript bundle.

1. **Import the Asset:**

First, import the asset in the script section of your Svelte component. Ensure that your bundler is configured to handle the asset types you are importing.

```javascript
import myImage from 'path/to/your/asset.png';
```

2. **Reference the Imported Asset:**

After importing, you can reference the asset using the variable it was assigned to. This is particularly useful when working with dynamic assets or when you want to include assets in the JavaScript bundle.

```html
<img src={myImage} alt="Dynamic asset">
```

Both methods have their use cases and can be used interchangeably depending on your project's requirements. Consider the advantages of each method and choose the one that best fits your workflow.

For additional information on asset handling and best practices, refer to the respective bundler's documentation (Rollup/Vite).