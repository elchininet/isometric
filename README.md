<p align="center">
    <a href="https://elchininet.github.io/isometric/">
        <img src="./src/@demo/images/logo.png?raw=true" width="400" title="isometric" />
    </a>
    <br>
    A lightweight JavaScript library written in TypeScript to create isometric projections using SVGs
</p>

[![Build Status](https://travis-ci.com/elchininet/isometric.svg?branch=master)](https://travis-ci.com/elchininet/isometric)

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

1. Copy the JavaScript file `isometric.web.js`, located in the `dist` folder
2. Put it in the folder that you prefer in your web server
3. Include it in your HTML file

```javascript
<script src="wherever/you/installed/isometric.web.js" />
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

### Class IsometricCanvas

This is the base class, it creates an isometric canvas (an SVG object)

```javascript
const isometric = new IsometricCanvas(element[, properties]);
```

**Parameters:**

* `element`\
The DOM element in which the isometric will be inserted

* `properties` _(optional)_\
Object to set the properties of the isometric canvas

  * `backgroundColor` _(string)_\
  Sets the background color of the isometric canvas\
  Default value: "white"
  * `scale` _(number)_\
  Sets the scale multiplier of each isometric unit\
  Default value: 1
  * `height` _(number)_\
  Sets the height of the isometric canvas\
  Default value: 480
  * `width` _(number)_\
  Sets the width of the isometric canvas
  Default value: 640

**Instance methods:**

>All the instance methods return the same instance, so they are chainable.

```javascript
addPath(path)
```
* `path` _(IsometricPath)_\
Adds an isometric path to the isometric canvas

```javascript
addPaths(path, path, path...)
```
* `path` _(IsometricPath)_\
Adds multiple isometric paths to the isometric canvas

```javascript
removePath(path)
```
* `path` _(IsometricPath)_\
Removes an isometric path from the isometric canvas

```javascript
removePathByIndex(index)
```
* `index` _(number)_\
Removes an isometric path taking into account its index in the paths tree

```javascript
clear()
```
* Cleans the isometric canvas (removes all the isometric paths from it)

```javascript
addEventListener(type, listener, [useCapture])
```
* Sets up a function that will be called whenever the specified event is delivered to the `IsometricCanvas` (the SVG element)

```javascript
removeEventListener(type, listener, [useCapture])
```
* Removes from the `IsometricCanvas` (the SVG element) an event listener previously registered with `addEventListener`

**Instance properties:**

```javascript
backgroundColor
```
* _(string)_\
Gets and sets the background color of the isometric canvas

```javascript
scale
```
* _(number)_\
Gets and sets the multiplier scale of the isometric canvas

```javascript
height
```
* _(number)_\
Gets and sets the height of the isometric canvas

```javascript
width
```
* _(number)_\
Gets and sets the width of the isometric canvas


### Class IsometricPath

This is the class to create isometric paths that can be added to the isometric canvas

```javascript
const path = new IsometricPath([properties]);
```

**Parameters:**

* `properties` _(optional)_\
Object to set the properties of the isometric path

  * `fillColor` _(string)_\
  Sets the fill color of the isometric path\
  Default value: "white"
  * `fillOpacity` _(number)_\
  Sets the fill opacity of the isometric path\
  Default value: 1
  * `strokeColor` _(string)_\
  Sets the stroke color of the isometric path\
  Default value: "black"
  * `strokeOpacity` _(number)_\
  Sets stroke opacity of the isometric path\
  Default value: 1
  * `strokeDasharray` _(Array\<number>)_\
  Sets the [SVG stroke dasharray][1] of the isometric path\
  Default value: []
  * `strokeLinecap` _(string)_\
  Sets the [SVG stroke linecap][2] of the isometric path\
  Default value: "butt"
  * `strokeLinejoin` _(string)_\
  Sets the [SVG stroke linejoin][3] of the isometric path\
  Default value: "round"
  * `strokeWidth` _(number)_\
  Sets the stroke width of the isometric path\
  Default value: 1
  
**Instance methods:**

>All the instance methods return the same instance, so they are chainable.

```javascript
getPath()
```
* Returns the SVG path object

```javascript
update()
```
* Forces a re-render of the SVG path

```javascript
moveTo(right, left, top)
```
* Move the cursor to an isometric point, if the cursor was already in another point, no line is drawn between them.
	* `right` _(number)_\
	Right value in the isometric coordinates
	* `left` _(number)_\
	Left value in the isometric coordinates
	* `top` _(number)_\
	Top value in the isometric coordinates
    
```javascript
lineTo(right, left, top)
```
* Draws a line from the previous isometric point to the designated point.
	* `right` _(number)_\
	Right value in the isometric coordinates
	* `left` _(number)_\
	Left value in the isometric coordinates
	* `top` _(number)_\
	Top value in the isometric coordinates
    
```javascript
mt(right, left, top)
```
* Alias of `moveTo`.

```javascript
lt(right, left, top)
```
* Alias of `lineTo`.

```javascript
draw(commands)
```
* Draws a line taking into account a series of drawing commands.
	* `commands` _(string)_\
    A series of drawing commands. For example, `M0,0,0 L1,1,1`has the same effect as `moveTo(0, 0, 0).lineTo(1, 1, 1)`

```javascript
addEventListener(type, listener, [useCapture])
```
* Sets up a function that will be called whenever the specified event is delivered to the `IsometricPath` (the SVG path element)

```javascript
removeEventListener(type, listener, [useCapture])
```
* Removes from the `IsometricPath` (the SVG path element) an event listener previously registered with `addEventListener`
    
**Instance properties:**

```javascript
fillColor
```
* _(string)_\
Gets and sets the fill color of the isometric path

```javascript
fillOpacity
```
* _(number)_\
Gets and sets the fill opacity of the isometric path

```javascript
strokeColor
```
* _(string)_\
Gets and sets the stroke color of the isometric path

```javascript
strokeOpacity
```
* _(string)_\
Gets and sets the stroke opacity of the isometric path

```javascript
strokeDasharray
```
* _(Array\<number>)_\
Gets and sets the [SVG stroke dasharray][1] of the isometric path

```javascript
strokeLinecap
```
* _(string)_\
Gets and sets the [SVG stroke linecap][2] of the isometric path

```javascript
strokeLinejoin
```
* _(string)_\
Gets and sets the [SVG stroke linejoin][3] of the isometric path

```javascript
strokeWidth
```
* _(number)_\
Gets and sets the stroke width of the isometric path


[1]: https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/stroke-dasharray
[2]: https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/stroke-linecap
[3]: https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/stroke-linejoin
[4]: https://elchininet.github.io/isometric/#demo3