<p align="center">
    <a href="https://elchininet.github.io/isometric/">
        <img src="./src/@demo/images/logo.png?raw=true" width="335" title="isometric" />
    </a>
</p>

A JavaScript library written in TypeScript to create isometric projections using SVGs

## Demo

https://elchininet.github.io/isometric/

## Installation

#### Using NPM

```
npm install @elchininet/isometric
```

#### Using Yarn

```
yarn add @elchininet/isometric
```

#### In the browser

It is possible to include a compiled version of the package directly in an HTML file. It will create a global `Isometric` object that can be accessed from anywhere in your JavaScript code.

1. Copy the JavaScript file `isometricjs.web.js`, located in the `dist` folder
2. Put it in the folder that you prefer in your web server
3. Include it in your HTML file

```javascript
<script src="wherever/you/instelled/isometric.web.js" />
```

#### Importing using CommonJS

```javascript
const { Isometric } = require('@elchininet/isometric');
const { IsometricCanvas, IsometricPath } = Isometric;
```

#### Importing using ES6 modules

```javascript
import { Isometric } from '@elchininet/isometric';
const { IsometricCanvas, IsometricPath } = Isometric;
```

#### Using in the browser

```javascript
/* Use it directly in your JavaScript code */
const { IsometricCanvas, IsometricPath } = Isometric;

/* Or access to the global variable if there is a variable with this name in the same scope */
const { IsometricCanvas, IsometricPath } = window.Isometric;
```

## Scripts

#### build

`npm run build`

Transpiles the TypeScript code and creates two bundles in the `dist` folder (`index.js` for Node environments and `isometric.web.js` to use directly in the browser).

#### lint

`npm run lint`

Runs eslint in source files.

#### demo

`npm run demo`

Opens a development server that provides live reloading using [webpack-dev-server](https://github.com/webpack/webpack-dev-server). Some demo examples located in the `@demo` folder will be shown. You can modify the code of the demos and the changes will be live reloaded in the browser.

## API

#### Class IsometricCanvas

This is the base class, is the one that creates the isometric canvas (an SVG object)

```javascript
const isometric = new IsometricCanvas(element[, properties]);
```

##### Class instance parameters

| Instance parameters | Description                                              |
| ------------------- | -------------------------------------------------------- |
| element             | The HTML element in which the isometric will be inserted
| properties          | Optional object to set the properties of the isometric canvas

##### Object properties possible values

| Properties       | Default value | Description                                      |
| ---------------- | ------------- | ------------------------------------------------ |
| backgroundColor  | white         | Set the background color of the isometric canvas
| scale            | 1             | Set how many pixels will be taken by an isometric unit
| height           | 480           | Set the height of the isometric canvas
| width            | 640           | Set the width of the isometric canvas

##### Class methods

| Method                      | Description                                           |
| --------------------------- | ----------------------------------------------------- |
| addPath(path)               | Add an isometric path to the isometric canvas
| addPaths(path1, path2, ...) | Add multiple isometric paths to the isometric canvas


#### Class IsometricPath

This is the class to create the different path elements of the isometric canvas

```javascript
const path = new IsometricPath([properties]);
```

##### Class instance parameters

| Instance parameters | Description                                              |
| ------------------- | -------------------------------------------------------- |
| properties          | Optional object to set the properties<br>of the isometric path

##### Object properties possible values

| Properties       | Default value | Description                                      |
| ---------------- | ------------- | ------------------------------------------------ |
| fillColor        | white         | Set the fill color of the isometric path
| fillOpacity      | 1             | Set the fill opacity of the isometric path
| strokeColor      | black         | Set the stroke color of the isometric path
| strokeDasharray  | []            | Set the [SVG stroke dasharray][1] of the isometric path
| strokeLinecap    | 'butt'        | Set the [SVG stroke linecap][2] of the isometric path
| strokeLinejoin   | 'round'       | Set the [SVG stroke linejoin][3] of the isometric path
| strokeOpacity    | 1             | Set the stroke opacity of the isometric path
| strokeWidth      | 1             | Set the stroke width of the isometric path

##### Class methods

| Method                      | Description                                           |
| --------------------------- | ----------------------------------------------------- |
| moveTo(right, left, top)    | Move to an isometric point
| lineTo(right, left, top)    | Create a line from the current position to the designated isometric point
| mt(right, left, top)        | Alias of the moveTo method
| lt(right, left, top)        | Alias of the lineTo method

[1]: https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/stroke-dasharray
[2]: https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/stroke-linecap
[3]: https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/stroke-linejoin



