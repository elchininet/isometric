<p align="center">
    <a href="https://elchininet.github.io/isometric/">
        <img src="https://raw.githubusercontent.com/elchininet/isometric/master/demo/images/logo.png" width="400" title="isometric" />
    </a>
    <br>
    A lightweight JavaScript library written in TypeScript to create isometric projections using SVGs
</p>

[![Build Status](https://travis-ci.com/elchininet/isometric.svg?branch=master)](https://app.travis-ci.com/elchininet/isometric) &nbsp; [![Coverage Status](https://coveralls.io/repos/github/elchininet/isometric/badge.svg?branch=master)](https://coveralls.io/github/elchininet/isometric?branch=master) &nbsp; [![npm version](https://badge.fury.io/js/%40elchininet%2Fisometric.svg)](https://badge.fury.io/js/%40elchininet%2Fisometric)

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

##### Importing the package as an external script in the HTML code

It is possible to include a compiled version of the package directly in an HTML file. It will create a global `isometric` object that can be accessed from anywhere in your JavaScript code.

1. Copy the JavaScript file `isometric.js`, located in the `dist/web` folder
2. Put it in the folder that you prefer in your web server
3. Include it in your HTML file

```javascript
<script src="wherever/you/installed/isometric.js"></script>
```

```javascript
/* There will be a global variable named isometric containing all the classes */
isometric.IsometricCanvas;
isometric.IsometricRectangle;
isometric.IsometricCircle;
isometric.IsometricPath;
```

##### Importing the package in your code using CommonJS

```javascript
const {
    IsometricCanvas,
    IsometricRectangle,
    IsometricCircle,
    IsometricPath
} = require('@elchininet/isometric');
```

##### Importing the package in your code using ES6 modules

```javascript
import {
    IsometricCanvas,
    IsometricRectangle,
    IsometricCircle,
    IsometricPath
} from '@elchininet/isometric';
```

#### In node environments

> To use the package in a Node environment, you need to install [jsdom](https://github.com/jsdom/jsdom) because the package needs it to work properly. 

##### Importing the package in your code using CommonJS

```javascript
const {
    IsometricCanvas,
    IsometricRectangle,
    IsometricCircle,
    IsometricPath
} = require('@elchininet/isometric/node');
```

##### Importing the package in your code using ES6 modules

```javascript
import {
    IsometricCanvas,
    IsometricRectangle,
    IsometricCircle,
    IsometricPath
} from '@elchininet/isometric/node';
```

#### In Deno

To import the package in [Deno](https://deno.land/), use the main esm version using any content delivery as [UNPKG](https://unpkg.com/) or [JSDELIVR](https://www.jsdelivr.com/). The package contains a reference directive to the `d.ts` file so you can get type checking importing it without doing anything special.

```javascript
import {
    IsometricCanvas,
    IsometricRectangle,
    IsometricCircle,
    IsometricPath
} from 'https://cdn.jsdelivr.net/npm/@elchininet/isometric/esm/index.js';
```

## Scripts

#### build

`npm run build`

Transpiles the `TypeScript` code and creates the necesary package bundles:

| Bundle path                 | Environment | Module type |
| --------------------------- | ----------- | ----------- |
| `dist/browser/isometric.js` | Browser     | IIFE        |
| `dist/index.js`             | Browser     | CommonJS    |
| `dist/esm/index.js`         | Browser     | ESM         |
| `dist/index.node.js`        | Node        | CommonJS    |
| `dist/esm/index.node.js`    | Node        | ESM         |

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
const isometric = new IsometricCanvas([properties]);
```

<details><summary>Parameters</summary>
<p>

`properties` _(optional)_
>Object to set the properties of the isometric canvas

| Property        | Type                 | Default value  | Description                                       |
| --------------- | -------------------- | -------------- | ------------------------------------------------- |
| container       | HTMLElement or string | "body"        | The DOM element or the query selector of the element in which the isometric will be inserted. This parameter should not be provided in Node environments |
| backgroundColor | string               | "white"        | Sets the background color of the isometric canvas |
| scale           | number               | 1              | Sets the scale multiplier of each isometric unit  |
| height          | number               | 480            | Sets the height of the isometric canvas           |
| width           | number               | 640            | Sets the width of the isometric canvas            |

</p>
</details>

<details><summary>Instance Methods</summary>
<p>

>All the instance methods (excepting `getElement` and `getSVGCode`) return the same instance, so they are chainable.

```javascript
getElement()
```
>Returns the native `SVG` element

```javascript
getSVGCode()
```
>Returns the HTML code of the `SVG` element

```javascript
addChild(child)
```
>Adds a child to the isometric canvas

| Parameter       | Type          |
| --------------- | ------------- |
| child           | IsometricPath<br>IsometricRectangle<br>IsometricCircle |

```javascript
addChildren(child, child, child...)
```
>Adds multiple children to the isometric canvas

| Parameter       | Type          |
| --------------- | ------------- |
| child           | IsometricPath<br>IsometricRectangle<br>IsometricCircle |

```javascript
removeChild(child)
```
>Removes a child from the isometric canvas

| Parameter       | Type          |
| --------------- | ------------- |
| child           | IsometricPath<br>IsometricRectangle<br>IsometricCircle |

```javascript
removeChildren(child, child, child...)
```
>Removes multiple children from the isometric canvas

| Parameter       | Type          |
| --------------- | ------------- |
| child           | IsometricPath<br>IsometricRectangle<br>IsometricCircle |

```javascript
removeChildByIndex(index)
```
>Removes a child taking into account its index in the paths tree

| Parameter       | Type          |
| --------------- | ------------- |
| index           | number        |

```javascript
clear()
```
>Cleans the isometric canvas (removes all the children from it and all the native SVG paths elements from the SVG)

```javascript
pauseAnimations()
```
>Pause all the animations (not compatible with Internet Explorer)

```javascript
resumeAnimations()
```
>Resume all the animations (not compatible with Internet Explorer)

```javascript
addEventListener(type, callback, [useCapture])
```
>Sets up a function that will be called whenever the specified event is delivered to the isometric canvas (the SVG element)

| Parameter       | Type          |
| --------------- | ------------- |
| type            | string        |
| callback        | VoidFunction  |
| callback        | boolean       |

```javascript
removeEventListener(type, callback, [useCapture])
```
>Removes from the isometric canvas (the SVG element) an event listener previously registered with `addEventListener`

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
| animated        | boolean  | Gets if the SVG is animations are paused or are running           |

</p>
</details>

---

### Class IsometricRectangle

This class is to create isometric rectangles that can be added to the isometric canvas.

```javascript
const path = new IsometricRectangle(properties);
```

<details><summary>Parameters</summary>
<p>

`properties`
>Object to set the properties of the isometric rectangle

| Property        | Type                 | Default value | Description                                                          |
| --------------- | -------------------- | ------------- | -------------------------------------------------------------------- |
| height          | number               | -             | Sets the height of the isometric rectangle                           |
| width           | number               | -             | Sets the width of the isometric rectangle                            |
| planeView       | PlaneView (`string`) | -             | Sets the plane view in which the isometric rectangle will be created |
| fillColor       | string               | "white"       | Sets the fill color of the isometric rectangle                       |
| fillOpacity     | number               | 1             | Sets the fill opacity of the isometric rectangle                     |
| strokeColor     | string               | "black"       | Sets the stroke color of the isometric rectangle                     |
| strokeOpacity   | number               | 1             | Sets stroke opacity of the isometric rectangle                       |
| strokeDashArray | number[]             | []            | Sets the [SVG stroke dasharray][1] of the isometric rectangle        |
| strokeLinecap   | string               | "butt"        | Sets the [SVG stroke linecap][2] of the isometric rectangle          |
| strokeLinejoin  | string               | "round"       | Sets the [SVG stroke linejoin][3] of the isometric rectangle         |
| strokeWidth     | number               | 1             | Sets the stroke width of the isometric rectangle                     |
| texture         | Texture (`object`)   | -             | Sets the texture of the isometric rectangle                          |

`planeView values`
>"TOP" | "FRONT" | "SIDE"

`texture properties`
>Object to set the texture of the isometric rectangle

| Property        | Type                 | Default value    | Description                                                          |
| --------------- | -------------------- | ---------------- | -------------------------------------------------------------------- |
| url             | string               | -                | URL of the image texture                                             |
| planeView       | PlaneView (`string`) | parent planeView | Sets the texture plane view. By default it takes the isometric rectangle plane view |
| height          | number               | -                | Sets the texture height                                              |
| width           | number               | -                | Sets the texture width                                               |
| scale           | number               | -                | Sets the scale of the texture                                        |
| pixelated       | boolean              | -                | Sets the image rendering of the texture                              |
| shift           | Point (`object`)     | -                | Shifts the background position                                       |
| rotation        | Rotation (`object`)  | -                | Set the rotation of the texture                                      |

`shift properties`
>Object to shift the background position

| Property | Type   | Default value | Description             |
| -------- | ------ | --------------| ----------------------- |
| right    | number | -             | Right coordinates       |
| left     | number | -             | Left coordinates        |
| top      | number | -             | Top coordinates         |

`rotation properties`
>Object to set the background rotation

| Property | Type            | Default value | Description             |
| -------- | --------------- | --------------| ----------------------- |
| axis     | Axis (`string`) | -             | Rotation axis           |
| value    | number          | -             | Rotation value          |

`axis values`
>"RIGHT" | "LEFT" | "TOP"

</p>
</details>

<details><summary>Instance Methods</summary>
<p>

>All the instance methods (except `getElement` and `getPattern`) return the same instance, so they are chainable.

```javascript
getElement()
```
>Returns the native `SVG` path element

```javascript
getPattern()
```
>Returns the native `SVGPatternElement` responsible for the texture

```javascript
update()
```
>Forces a re-render of the SVG rectangle

```javascript
updateTexture(texture)
```
>Adds or override the texture properties

| Property  | Type                 | Optional  | Description                                     |
| --------- | -------------------- | --------- | ----------------------------------------------- |
| url       | string               | yes       | URL of the image texture                        |
| planeView | PlaneView (`string`) | yes       | Texture plane view                              |
| height    | number               | yes       | Texture height                                  |
| width     | number               | yes       | Texture width                                   |
| scale     | number               | yes       | Texture scale                                   |
| pixelated | boolean              | yes       | Image rendering of the texture                  |
| shift     | Point (`object`)     | yes       | Shifts the background position                  |
| rotation  | Rotation (`object`)  | yes       | Rotation of the texture                         |

`shift properties`
>Object to shift the background position

| Property | Type   | Default value | Description             |
| -------- | ------ | --------------| ----------------------- |
| right    | number | -             | Right coordinates       |
| left     | number | -             | Left coordinates        |
| top      | number | -             | Top coordinates         |

`rotation properties`
>Object to set the background rotation

| Property | Type            | Default value | Description             |
| -------- | --------------- | --------------| ----------------------- |
| axis     | Axis (`string`) | -             | Rotation axis           |
| value    | number          | -             | Rotation value          |

`axis values`
>"RIGHT" | "LEFT" | "TOP"

```javascript
clear()
```
>Cleans the isometric rectangle (removes all the path commands from the native SVG path element)

```javascript
addAnimation(animation)
```
>Adds an animated element to the isometric Rectangle (not compatible with Internet Explorer). These are the properties of the `SVGRectangleAnimation` object:

| Property        | Type     | Optional  | Default |  Description                                     |
| --------------- | -------- | --------- | ------- | ------------------------------------------------ |
| property        | string   | no        | -       | Indicates which property should be animated      |
| duration        | number   | yes       | 1       | Indicates the number of seconds of the animation |
| repeat          | number   | yes       | 0       | Number of times that the animation will run. `0` runs indefinitely |
| from            | string / number | yes | - | Initial value of the animation (if this property is used, `values` property can't be used) |
| to              | string / number | yes | - | Final value of the animation (if this property is used, `values` property can't be used) |
| values          | string / number / string[] / number[] | yes | - | All the values of the animation (if this property is used, `from` and `to` properties can't be used) |

These are the properties that can be animated (property `property`)

* fillColor
* fillOpacity
* strokeColor
* strokeOpacity
* strokeWidth
* right
* left
* top
* width
* height

```javascript
removeAnimationByIndex(index)
```
>Remove an especific animation element by its index.

```javascript
removeAnimations()
```
>Remove all the animation elements.

```javascript
addEventListener(type, callback, [useCapture])
```
>Sets up a function that will be called whenever the specified event is delivered to the isometric rectangle (the SVG path element)

| Parameter       | Type          |
| --------------- | ------------- |
| type            | string        |
| callback        | VoidFunction  |
| callback        | boolean       |

```javascript
removeEventListener(type, listener, [useCapture])
```
>Removes from the isometric rectangle (the SVG path element) an event listener previously registered with `addEventListener`

| Parameter       | Type          |
| --------------- | ------------- |
| type            | string        |
| callback        | VoidFunction  |
| callback        | boolean       |

</p>
</details>

<details><summary>Instance Properties</summary>
<p>

| Property        | Type               | Description                                                              |
| --------------- | ------------------ | ------------------------------------------------------------------------ |
| height          | number             | Gets and sets the height of the isometric rectangle                      |
| width           | number             | Gets and sets the width of the isometric rectangle                       |
| planeView       | string             | Gets and sets the plane view in which the isometric rectangle is created |
| fillColor       | string             | Gets and sets the fill color of the isometric rectangle                  |
| fillOpacity     | number             | Gets and sets the fill opacity of the isometric rectangle                |
| strokeColor     | string             | Gets and sets the stroke color of the isometric rectangle                |
| strokeOpacity   | number             | Gets and sets the stroke opacity of the isometric rectangle              |
| strokeDashArray | number[]           | Gets and sets the [SVG stroke dasharray][1] of the isometric rectangle   |
| strokeLinecap   | string             | Gets and sets the [SVG stroke linecap][2] of the isometric rectangle     |
| strokeLinejoin  | string             | Gets and sets the [SVG stroke linejoin][3] of the isometric rectangle    |
| strokeWidth     | number             | Gets and sets the stroke width of the isometric rectangle                |
| texture         | Texture (`object`) | Gets and sets the texture of the isometric rectangle                     |

</p>
</details>

---

### Class IsometricCircle

This class is to create isometric circles that can be added to the isometric canvas.

```javascript
const path = new IsometricCircle(properties);
```

<details><summary>Parameters</summary>
<p>

`properties`
>Object to set the properties of the isometric circle

| Property        | Type                 | Default value        | Description                                                       |
| --------------- | -------------------- | -------------------- | ----------------------------------------------------------------- |
| radius          | number               | -                    | Sets the radius of the isometric circle                           |
| planeView       | PlaneView (`string`) | -                    | Sets the plane view in which the isometric circle will be created |
| fillColor       | string               | "white"              | Sets the fill color of the isometric circle                       |
| fillOpacity     | number               | 1                    | Sets the fill opacity of the isometric circle                     |
| strokeColor     | string               | "black"              | Sets the stroke color of the isometric circle                     |
| strokeOpacity   | number               | 1                    | Sets stroke opacity of the isometric circle                       |
| strokeDashArray | number[]             | []                   | Sets the [SVG stroke dasharray][1] of the isometric circle        |
| strokeLinecap   | string               | "butt"               | Sets the [SVG stroke linecap][2] of the isometric circle          |
| strokeLinejoin  | string               | "round"              | Sets the [SVG stroke linejoin][3] of the isometric circle         |
| strokeWidth     | number               | 1                    | Sets the stroke width of the isometric circle                     |
| texture         | Texture (`object`)   | -                    | Sets the texture of the isometric circle                          |

`planeView values`
>"TOP" | "FRONT" | "SIDE"

`texture properties`
>Object to set the texture of the isometric circle

| Property        | Type                 | Default value    | Description                                                          |
| --------------- | -------------------- | ---------------- | -------------------------------------------------------------------- |
| url             | string               | -                | URL of the image texture                                             |
| planeView       | PlaneView (`string`) | parent planeView | Sets the texture plane view. By default it takes the isometric circle plane view |
| height          | number               | -                | Sets the texture height                                              |
| width           | number               | -                | Sets the texture width                                               |
| scale           | number               | -                | Sets the scale of the texture                                        |
| pixelated       | boolean              | -                | Sets the image rendering of the texture                              |
| shift           | Point (`object`)     | -                | Shifts the background position                                       |
| rotation        | Rotation (`object`)  | -                | Set the rotation of the texture                                      |

`shift properties`
>Object to shift the background position

| Property | Type   | Default value | Description             |
| -------- | ------ | --------------| ----------------------- |
| right    | number | -             | Right coordinates       |
| left     | number | -             | Left coordinates        |
| top      | number | -             | Top coordinates         |

`rotation properties`
>Object to set the background rotation

| Property | Type            | Default value | Description             |
| -------- | --------------- | --------------| ----------------------- |
| axis     | Axis (`string`) | -             | Rotation axis           |
| value    | number          | -             | Rotation value          |

`axis values`
>"RIGHT" | "LEFT" | "TOP"

</p>
</details>

<details><summary>Instance Methods</summary>
<p>

>All the instance methods (except `getElement` and `getPattern`) return the same instance, so they are chainable.

```javascript
getElement()
```
>Returns the native `SVG` path element

```javascript
getPattern()
```
>Returns the native `SVGPatternElement` responsible for the texture

```javascript
update()
```
>Forces a re-render of the SVG circle

```javascript
updateTexture(texture)
```
>Adds or override the texture properties

| Property  | Type                 | Optional  | Description                                     |
| --------- | -------------------- | --------- | ----------------------------------------------- |
| url       | string               | yes       | URL of the image texture                        |
| planeView | PlaneView (`string`) | yes       | Texture plane view                              |
| height    | number               | yes       | Texture height                                  |
| width     | number               | yes       | Texture width                                   |
| scale     | number               | yes       | Texture scale                                   |
| pixelated | boolean              | yes       | Image rendering of the texture                  |
| shift     | Point (`object`)     | yes       | Shifts the background position                  |
| rotation  | Rotation (`object`)  | yes       | Rotation of the texture                         |

`shift properties`
>Object to shift the background position

| Property | Type   | Default value | Description             |
| -------- | ------ | --------------| ----------------------- |
| right    | number | -             | Right coordinates       |
| left     | number | -             | Left coordinates        |
| top      | number | -             | Top coordinates         |

`rotation properties`
>Object to set the background rotation

| Property | Type            | Default value | Description             |
| -------- | --------------- | --------------| ----------------------- |
| axis     | Axis (`string`) | -             | Rotation axis           |
| value    | number          | -             | Rotation value          |

`axis values`
>"RIGHT" | "LEFT" | "TOP"

```javascript
clear()
```
>Cleans the isometric circle (removes all the path commands from the native SVG path element)

```javascript
addAnimation(animation)
```
>Adds an animated element to the isometric circle (not compatible with Internet Explorer). These are the properties of the `SVGCircleAnimation` object:

| Property        | Type     | Optional  | Default |  Description                                     |
| --------------- | -------- | --------- | ------- | ------------------------------------------------ |
| property        | string   | no        | -       | Indicates which property should be animated      |
| duration        | number   | yes       | 1       | Indicates the number of seconds of the animation |
| repeat          | number   | yes       | 0       | Number of times that the animation will run. `0` runs indefinitely |
| from            | string / number | yes | - | Initial value of the animation (if this property is used, `values` property can't be used) |
| to              | string / number | yes | - | Final value of the animation (if this property is used, `values` property can't be used) |
| values          | string / number / string[] / number[] | yes | - | All the values of the animation (if this property is used, `from` and `to` properties can't be used) |

These are the properties that can be animated (property `property`)

* fillColor
* fillOpacity
* strokeColor
* strokeOpacity
* strokeWidth
* right
* left
* top
* radius

```javascript
removeAnimationByIndex(index)
```
>Remove an especific animation element by its index.

```javascript
removeAnimations()
```
>Remove all the animation elements.

```javascript
addEventListener(type, callback, [useCapture])
```
>Sets up a function that will be called whenever the specified event is delivered to the isometric circle (the SVG path element)

| Parameter       | Type          |
| --------------- | ------------- |
| type            | string        |
| callback        | VoidFunction  |
| callback        | boolean       |

```javascript
removeEventListener(type, listener, [useCapture])
```
>Removes from the isometric circle (the SVG path element) an event listener previously registered with `addEventListener`

| Parameter       | Type          |
| --------------- | ------------- |
| type            | string        |
| callback        | VoidFunction  |
| callback        | boolean       |

</p>
</details>

<details><summary>Instance Properties</summary>
<p>

| Property        | Type               | Description                                                           |
| --------------- | ------------------ | --------------------------------------------------------------------- |
| radius          | number             | Gets and sets the radius of the isometric circle                      |
| planeView       | string             | Gets and sets the plane view in which the isometric circle is created |
| fillColor       | string             | Gets and sets the fill color of the isometric circle                  |
| fillOpacity     | number             | Gets and sets the fill opacity of the isometric circle                |
| strokeColor     | string             | Gets and sets the stroke color of the isometric circle                |
| strokeOpacity   | number             | Gets and sets the stroke opacity of the isometric circle              |
| strokeDashArray | number[]           | Gets and sets the [SVG stroke dasharray][1] of the isometric circle   |
| strokeLinecap   | string             | Gets and sets the [SVG stroke linecap][2] of the isometric circle     |
| strokeLinejoin  | string             | Gets and sets the [SVG stroke linejoin][3] of the isometric circle    |
| strokeWidth     | number             | Gets and sets the stroke width of the isometric circle                |
| texture         | Texture (`object`) | Gets and sets the texture of the isometric circle                     |

</p>
</details>

---

### Class IsometricPath

This class is to create isometric paths that can be added to the isometric canvas

```javascript
const path = new IsometricPath([properties]);
```

<details><summary>Parameters</summary>
<p>

`properties` _(optional)_
>Object to set the properties of the isometric path

| Property        | Type               | Default value  | Description                                              |
| --------------- | ------------------ | -------------- | -------------------------------------------------------- |
| fillColor       | string             | "white"        | Sets the fill color of the isometric path                |
| fillOpacity     | number             | 1              | Sets the fill opacity of the isometric path              |
| strokeColor     | string             | "black"        | Sets the stroke color of the isometric path              |
| strokeOpacity   | number             | 1              | Sets stroke opacity of the isometric path                |
| strokeDashArray | number[]           | []             | Sets the [SVG stroke dasharray][1] of the isometric path |
| strokeLinecap   | string             | "butt"         | Sets the [SVG stroke linecap][2] of the isometric path   |
| strokeLinejoin  | string             | "round"        | Sets the [SVG stroke linejoin][3] of the isometric path  |
| strokeWidth     | number             | 1              | Sets the stroke width of the isometric path              |
| texture         | Texture (`object`) | -              | Sets the texture of the isometric path                   |
| autoclose       | boolean            | true           | Sets if the path should close automatically or not       |

`texture properties`
>Object to set the texture of the isometric path

| Property        | Type                 | Default value  | Description                                                          |
| --------------- | -------------------- | -------------- | -------------------------------------------------------------------- |
| url             | string               | -              | URL of the image texture                                             |
| planeView       | PlaneView (`string`) | -              | Sets the texture plane view                                          |
| height          | number               | -              | Sets the texture height                                              |
| width           | number               | -              | Sets the texture width                                               |
| scale           | number               | -              | Sets the scale of the texture                                        |
| pixelated       | boolean              | -              | Sets the image rendering of the texture                              |
| shift           | Point (`object`)     | -              | Shifts the background position                                       |
| rotation        | Rotation (`object`)  | -              | Set the rotation of the texture                                      |

`shift properties`
>Object to shift the background position

| Property | Type   | Default value | Description             |
| -------- | ------ | --------------| ----------------------- |
| right    | number | -             | Right coordinates       |
| left     | number | -             | Left coordinates        |
| top      | number | -             | Top coordinates         |

`rotation properties`
>Object to set the background rotation

| Property | Type            | Default value | Description             |
| -------- | --------------- | --------------| ----------------------- |
| axis     | Axis (`string`) | -             | Rotation axis           |
| value    | number          | -             | Rotation value          |

`axis values`
>"RIGHT" | "LEFT" | "TOP"

</p>
</details>

<details><summary>Instance Methods</summary>
<p>

>All the instance methods (except `getElement` and `getPattern`) return the same instance, so they are chainable.

```javascript
getElement()
```
>Returns the native `SVG` path element

```javascript
getPattern()
```
>Returns the native `SVGPatternElement` responsible for the texture

```javascript
update()
```
>Forces a re-render of the SVG path

```javascript
updateTexture(texture)
```
>Adds or override the texture properties

| Property  | Type                 | Optional  | Description                                     |
| --------- | -------------------- | --------- | ----------------------------------------------- |
| url       | string               | yes       | URL of the image texture                        |
| planeView | PlaneView (`string`) | yes       | Texture plane view                              |
| height    | number               | yes       | Texture height                                  |
| width     | number               | yes       | Texture width                                   |
| scale     | number               | yes       | Texture scale                                   |
| pixelated | boolean              | yes       | Image rendering of the texture                  |
| shift     | Point (`object`)     | yes       | Shifts the background position                  |
| rotation  | Rotation (`object`)  | yes       | Rotation of the texture                         |

`shift properties`
>Object to shift the background position

| Property | Type   | Default value | Description             |
| -------- | ------ | --------------| ----------------------- |
| right    | number | -             | Right coordinates       |
| left     | number | -             | Left coordinates        |
| top      | number | -             | Top coordinates         |

`rotation properties`
>Object to set the background rotation

| Property | Type            | Default value | Description             |
| -------- | --------------- | --------------| ----------------------- |
| axis     | Axis (`string`) | -             | Rotation axis           |
| value    | number          | -             | Rotation value          |

`axis values`
>"RIGHT" | "LEFT" | "TOP"

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
>Draws a line from the previous isometric point to the destination point.

| Parameter       | Type       | Description                                                       |
| --------------- | ---------- | ----------------------------------------------------------------- |
| right           | number     | Right value in the isometric coordinates of the destination point |
| left            | number     | Left value in the isometric coordinates of the destination point  |
| top             | number     | Top value in the isometric coordinates of the destination point   |

```javascript
curveTo(controlRight, controlLeft, controlTop, right, left, top)
```
>Draws a curve from the previous isometric point to the designated isometric point crossing the control isometric point.

| Parameter       | Type       | Description                                                       |
| --------------- | ---------- | ----------------------------------------------------------------- |
| controlRight    | number     | Right value in the isometric coordinates of the control point     |
| controlLeft     | number     | Left value in the isometric coordinates of the control point      |
| controlTop      | number     | Top value in the isometric coordinates of the control point       |
| right           | number     | Right value in the isometric coordinates of the destination point |
| left            | number     | Left value in the isometric coordinates of the destination point  |
| top             | number     | Top value in the isometric coordinates of the destination point   |
    
```javascript
mt(right, left, top)
```
>Alias of `moveTo`.

```javascript
lt(right, left, top)
```
>Alias of `lineTo`.

```javascript
ct(controlRight, controlLeft, controlTop, right, left, top)
```
>Alias of `curveTo`.

```javascript
draw(commands)
```
>Draws a line taking into account a series of drawing commands.

| Parameter       | Type       | Description                              |
| --------------- | ---------- | ---------------------------------------- |
| commands        | string     | A series of drawing commands. For example, `M0 0 0 L1 1 1 C 2 2 2 3 3 3`has the same effect as `moveTo(0, 0, 0).lineTo(1, 1, 1).curveTo(2, 2, 2, 3, 3, 3)` |

```javascript
clear()
```
>Cleans the isometric path (removes all the path commands from the native SVG path element)

```javascript
addAnimation(animation)
```
>Adds an animated element to the isometric path (not compatible with Internet Explorer). These are the properties of the `SVGPathAnimation` object:

| Property        | Type     | Optional  | Default |  Description                                     |
| --------------- | -------- | --------- | ------- | ------------------------------------------------ |
| property        | string   | no        | -       | Indicates which property should be animated      |
| duration        | number   | yes       | 1       | Indicates the number of seconds of the animation |
| repeat          | number   | yes       | 0       | Number of times that the animation will run. `0` runs indefinitely |
| from            | string / number | yes | - | Initial value of the animation (if this property is used, `values` property can't be used) |
| to              | string / number | yes | - | Final value of the animation (if this property is used, `values` property can't be used) |
| values          | string / number / string[] / number[] | yes | - | All the values of the animation (if this property is used, `from` and `to` properties can't be used) |

These are the properties that can be animated (property `property`)

* fillColor
* fillOpacity
* strokeColor
* strokeOpacity
* strokeWidth
* path

```javascript
removeAnimationByIndex(index)
```
>Remove an especific animation element by its index.

```javascript
removeAnimations()
```
>Remove all the animation elements.

```javascript
addEventListener(type, callback, [useCapture])
```
>Sets up a function that will be called whenever the specified event is delivered to the isometric path (the SVG path element)

| Parameter       | Type          |
| --------------- | ------------- |
| type            | string        |
| callback        | VoidFunction  |
| callback        | boolean       |

```javascript
removeEventListener(type, listener, [useCapture])
```
>Removes from the isometric path (the SVG path element) an event listener previously registered with `addEventListener`

| Parameter       | Type          |
| --------------- | ------------- |
| type            | string        |
| callback        | VoidFunction  |
| callback        | boolean       |

</p>
</details>

<details><summary>Instance Properties</summary>
<p>

| Property        | Type               | Description                                                       |
| --------------- | ------------------ | ----------------------------------------------------------------- |
| fillColor       | string             | Gets and sets the fill color of the isometric path                |
| fillOpacity     | number             | Gets and sets the fill opacity of the isometric path              |
| strokeColor     | string             | Gets and sets the stroke color of the isometric path              |
| strokeOpacity   | number             | Gets and sets the stroke opacity of the isometric path            |
| strokeDashArray | number[]           | Gets and sets the [SVG stroke dasharray][1] of the isometric path |
| strokeLinecap   | string             | Gets and sets the [SVG stroke linecap][2] of the isometric path   |
| strokeLinejoin  | string             | Gets and sets the [SVG stroke linejoin][3] of the isometric path  |
| strokeWidth     | number             | Gets and sets the stroke width of the isometric path              |
| texture         | Texture (`object`) | Gets and sets the texture of the isometric path                   |
| autoclose       | boolean            | Gets and sets the autoclose property of the isometric path        |

</p>
</details>

---

[1]: https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/stroke-dasharray
[2]: https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/stroke-linecap
[3]: https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/stroke-linejoin
[4]: https://elchininet.github.io/isometric/#demo3