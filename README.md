<p align="center">
    <a href="https://elchininet.github.io/isometric/">
        <img src="./src/@demo/images/logo.png?raw=true" width="400" title="isometric" />
    </a>
    <br>
    A lightweight JavaScript library written in TypeScript to create isometric projections using SVGs
</p>

[![Build Status](https://travis-ci.com/elchininet/isometric.svg?branch=master)](https://travis-ci.com/elchininet/isometric) &nbsp; [![Coverage Status](https://coveralls.io/repos/github/elchininet/isometric/badge.svg?branch=master)](https://coveralls.io/github/elchininet/isometric?branch=master)

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

It is possible to include a compiled version of the package directly in an HTML file. It will create global variables that can be accessed from anywhere in your JavaScript code.

1. Copy the JavaScript file `isometric.web.js`, located in the `dist` folder
2. Put it in the folder that you prefer in your web server
3. Include it in your HTML file

```javascript
<script src="wherever/you/installed/isometric.web.js" />
```

#### Importing using CommonJS

```javascript
const { IsometricCanvas, IsometricPath } = require('@elchininet/isometric');
```

#### Importing using ES6 modules

```javascript
import { IsometricCanvas, IsometricPath } from '@elchininet/isometric';
```

#### Using in the browser

```javascript
/* Use it directly in your JavaScript code */
IsometricCanvas;
IsometricPath;

/* Or access to the global variable if there is a variable with this name in the same scope */
window.IsometricCanvas;
window.IsometricPath;
```

## Scripts

#### build

`npm run build`

Transpiles the TypeScript code and creates two bundles in the `dist` folder (`index.js` for Node environments and `isometric.web.js` to use directly in the browser).

#### lint

`npm run lint`

Runs eslint in source files.

#### test

`npm run test`

Runs tests.

#### demo

`npm run demo`

Opens a development server that provides live reloading using [webpack-dev-server](https://github.com/webpack/webpack-dev-server). Some demo examples located in the `@demo` folder will be shown. You can modify the code of the demos and the changes will be live reloaded in the browser.

## API

### Class IsometricCanvas

This is the base class, it creates an isometric canvas (an SVG object)

```javascript
const isometric = new IsometricCanvas(element[, properties]);
```

<details><summary>Parameters</summary>
<p>

`element`
>The DOM element in which the isometric will be inserted

`properties` _(optional)_
>Object to set the properties of the isometric canvas

| Property        | Type          | Default value  | Description                                       |
| --------------- | ------------- | -------------- | ------------------------------------------------- |
| backgroundColor | string        | "white"        | Sets the background color of the isometric canvas |
| scale           | number        | 1              | Sets the scale multiplier of each isometric unit  |
| height          | number        | 480            | Sets the height of the isometric canvas           |
| width           | number        | 640            | Sets the width of the isometric canvas            |

</p>
</details>

<details><summary>Instance Methods</summary>
<p>

>All the instance methods (excepting `getElement`) return the same instance, so they are chainable.

```javascript
getElement()
```
>Returns the native `SVG` element

```javascript
addChild(child)
```
>Adds an isometric paths to the isometric canvas

| Parameter       | Type          |
| --------------- | ------------- |
| child           | IsometricPath |

```javascript
addChildren(child, child, child...)
```
>Adds multiple isometric paths to the isometric canvas

| Parameter       | Type          |
| --------------- | ------------- |
| child           | IsometricPath |

```javascript
removeChild(child)
```
>Removes an isometric path from the isometric canvas

| Parameter       | Type          |
| --------------- | ------------- |
| child           | IsometricPath |

```javascript
removeChildren(child, child, child...)
```
>Removes multiple isometric paths from the isometric canvas

| Parameter       | Type          |
| --------------- | ------------- |
| child           | IsometricPath |

```javascript
removeChildByIndex(index)
```
>Removes an isometric path taking into account its index in the paths tree

| Parameter       | Type          |
| --------------- | ------------- |
| index           | number        |

```javascript
clear()
```
>Cleans the isometric canvas (removes all the isometric paths from it)

```javascript
addEventListener(type, callback, [useCapture])
```
>Sets up a function that will be called whenever the specified event is delivered to the `IsometricCanvas` (the SVG element)

| Parameter       | Type          |
| --------------- | ------------- |
| type            | string        |
| callback        | VoidFunction  |
| callback        | boolean       |

```javascript
removeEventListener(type, callback, [useCapture])
```
>Removes from the `IsometricCanvas` (the SVG element) an event listener previously registered with `addEventListener`

| Parameter       | Type          |
| --------------- | ------------- |
| type            | string        |
| callback        | VoidFunction  |
| callback        | boolean       |

</p>
</details>

<details><summary>Instance Properties</summary>
<p>

| Property        | Type     | Description                                                       |
| --------------- | -------- | ----------------------------------------------------------------- |
| backgroundColor | string   | Gets and sets the background color of the isometric canvas        |
| scale           | number   | Gets and sets the multiplier scale of the isometric canvas        |
| height          | number   | Gets and sets the height of the isometric canvas                  |
| width           | number   | Gets and sets the width of the isometric canvas                   |

</p>
</details>

---

### Class IsometricPath

This is the class to create isometric paths that can be added to the isometric canvas

```javascript
const path = new IsometricPath([properties]);
```

<details><summary>Parameters</summary>
<p>

`properties` _(optional)_
>Object to set the properties of the isometric path

| Property        | Type          | Default value  | Description                                              |
| --------------- | ------------- | -------------- | -------------------------------------------------------- |
| fillColor       | string        | "white"        | Sets the fill color of the isometric path                |
| fillOpacity     | number        | 1              | Sets the fill opacity of the isometric path              |
| strokeColor     | string        | "black"        | Sets the stroke color of the isometric path              |
| strokeOpacity   | number        | 1              | Sets stroke opacity of the isometric path                |
| strokeDashArray | number[]      | []             | Sets the [SVG stroke dasharray][1] of the isometric path |
| strokeLinecap   | string        | "butt"         | Sets the [SVG stroke linecap][2] of the isometric path   |
| strokeLinejoin  | string        | "round"        | Sets the [SVG stroke linejoin][3] of the isometric path  |
| strokeWidth     | number        | 1              | Sets the stroke width of the isometric path              |

</p>
</details>

<details><summary>Instance Methods</summary>
<p>

>All the instance methods (excepting `getElement`) return the same instance, so they are chainable.

```javascript
getElement()
```
>Returns the native `SVG` path element

```javascript
update()
```
>Forces a re-render of the SVG path

```javascript
moveTo(right, left, top)
```
>Move the cursor to an isometric point, if the cursor was already in another point, no line is drawn between them.

| Parameter       | Type       | Description                              |
| --------------- | ---------- | ---------------------------------------- |
| right           | number     | Right value in the isometric coordinates |
| left            | number     | Left value in the isometric coordinates  |
| top             | number     | Top value in the isometric coordinates   |
    
```javascript
lineTo(right, left, top)
```
>Draws a line from the previous isometric point to the designated point.

| Parameter       | Type       | Description                              |
| --------------- | ---------- | ---------------------------------------- |
| right           | number     | Right value in the isometric coordinates |
| left            | number     | Left value in the isometric coordinates  |
| top             | number     | Top value in the isometric coordinates   |
    
```javascript
mt(right, left, top)
```
>Alias of `moveTo`.

```javascript
lt(right, left, top)
```
>Alias of `lineTo`.

```javascript
draw(commands)
```
>Draws a line taking into account a series of drawing commands.

| Parameter       | Type       | Description                              |
| --------------- | ---------- | ---------------------------------------- |
| commands        | string     | A series of drawing commands. For example, `M0 0 0 L1 1 1`has the same effect as `moveTo(0, 0, 0).lineTo(1, 1, 1)` |

```javascript
addEventListener(type, callback, [useCapture])
```
>Sets up a function that will be called whenever the specified event is delivered to the `IsometricPath` (the SVG path element)

| Parameter       | Type          |
| --------------- | ------------- |
| type            | string        |
| callback        | VoidFunction  |
| callback        | boolean       |

```javascript
removeEventListener(type, listener, [useCapture])
```
>Removes from the `IsometricPath` (the SVG path element) an event listener previously registered with `addEventListener`

| Parameter       | Type          |
| --------------- | ------------- |
| type            | string        |
| callback        | VoidFunction  |
| callback        | boolean       |

</p>
</details>

<details><summary>Instance Properties</summary>
<p>

| Property        | Type     | Description                                                       |
| --------------- | -------- | ----------------------------------------------------------------- |
| fillColor       | string   | Gets and sets the fill color of the isometric path                |
| fillOpacity     | number   | Gets and sets the fill opacity of the isometric path              |
| strokeColor     | string   | Gets and sets the stroke color of the isometric path              |
| strokeOpacity   | number   | Gets and sets the stroke opacity of the isometric path            |
| strokeDashArray | number[] | Gets and sets the [SVG stroke dasharray][1] of the isometric path |
| strokeLinecap   | string   | Gets and sets the [SVG stroke linecap][2] of the isometric path   |
| strokeLinejoin  | string   | Gets and sets the [SVG stroke linejoin][3] of the isometric path  |
| strokeWidth     | number   | Gets and sets the stroke width of the isometric path              |

</p>
</details>

---


[1]: https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/stroke-dasharray
[2]: https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/stroke-linecap
[3]: https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/stroke-linejoin
[4]: https://elchininet.github.io/isometric/#demo3