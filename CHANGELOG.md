# Changelog

## [3.11.0] - 2024-12-22

- Added a new option to set a CSS class to `IsometricCircle`, `IsometricPath`, `IsometricPentagram`, `IsometricRectangle`, `IsometricStarPolygon` and `IsometricText`

## [3.10.1] - 2024-12-20

- Fix a bug related to animations not taken into account of some of the values were `0`

## [3.10.0] - 2024-10-11

- Add an optional `id` property to all the elements. If the `id` is not specified as a property of an instance, a random `id` is generated.
- Implement new methods in container classes (as `IsometricCanvas` and `IsometricGroup`):
    * `getChildByIndex` method to return a child taking into account its index
    * `getChildById` method to return a child taking into account its id
    * `removeChildById` method to remove a child taking into account its id

## [3.9.0] - 2024-10-06

- Create a new class to create star polygons (`IsometricStarPolygon`)
- Refactor the `IsometricPentagram` class to extends from the `IsometricStarPolygon` with fixed points as `5` and density as `2`

## [3.8.0] - 2024-09-29

- Create a new class to work with pentagrams (star polygons)

## [3.7.3] - 2023-08-12

- Fix ESM types

## [3.7.2] - 2023-03-27

- Fix a getter with a different type from the setter

## [3.7.1] - 2022-12-22

- Solve an error in Node environments related to `ReferenceError: SVGSVGElement is not defined`

## [3.7.0] - 2022-12-13

- Create a new class to work with texts (`IsometricText`)

## [3.6.0] - 2022-07-03

- Capture drag events and possibility of preventing the the drag event modifies the coordinates of the element using `preventDefault` on `drag` event

## [3.5.1] - 2022-07-02

- Restore the `dist/web/isometric.js` file that was ignored in gitignore by a mistake
- Restore the `demo7` index file that was ignored in gitignore by a mistake

## [3.5.0] - 2022-06-17

- Implement automatic dragging functionality in `IsometricShape` (therefore in `IsometricRectangle` and `IsometricCircle`) and `IsometricGroup` classes
- Refactor the project to implement position functionality using mixins, removing code duplication

## [3.4.0] - 2022-06-11

- Add new methods to the `IsometricContainer` class to modify children indexes
- `removeChild` and `removeChildren` methods of the `IsometricContainer` class now throws an error if a child that is not a container‘s child is provided

## [3.3.0] - 2022-06-10

- Create a new class to group elements and move them together (`IsometricGroup`)
- The abstract class `IsometricGraphic` has been renamed to `IsometricElement`
- A new abstract class has been created (`IsometricContainer`). At the moment, `IsometricCanvas` and `IsometricGroup` extend from it

## [3.2.1] - 2022-04-15

- Bundle the types of the package in a single file
- Add a triple-slash reference directive at the beginning of the bundles to enable types in Deno

## [3.2.0] - 2021-12-28

- Added a property to close automatically or not the `IsometricPath`

## [3.1.1] - 2021-12-22

- Removed comments from the bundles

## [3.1.0] - 2021-11-29

- Added support for textures
- Solve a bug in the IsometricRectangle drawing commands

## [3.0.0] - 2021-11-10

- Added compatibility with Node environments using `jsdom`
- The container property of the `IsometricCanvas` class has been moved into the `props` and if it is a string it represents a selector instead of an id
- Added a new method `getSVGCode` to the `IsometricCanvas` class to return the HTML code of the SVG element
- Addded bundles for ESM modules

## [2.5.3] - 2021-01-04

- The IsometricCanvas element parameter could be a HTMLElement or an id representing the id of the element

## [2.5.2] - 2020-12-17

- Updated packages and solved vulnerabilities

## [2.5.1] - 2020-09-29

- Fix a bug that was impeding negative numbers in drawing commands

## [2.5.0] - 2020-09-29

- Added animation support

## [2.4.1] - 2020-09-26

- Removed the superfluous Graphic class

## [2.4.0] - 2020-05-25

- Created a new IsometricCircle class to build isometric circles

## [2.3.2] - 2020-05-24

- Fix data sharing among multiple class instances due to shared global data

## [2.3.1] - 2020-05-24

- Improved curves generation using ellipsis arcs instead of bézier curves

## [2.3.0] - 2020-05-23

- Created a new IsometricRectangle class to build isometric rectangles
- Exposed some types
- Some code refactoring

## [2.2.1] - 2020-05-23

- Refactored the IsometricPath class to extend from an abstract class
- Fixed a bug that was not returning the IsometricPath class instance for the clear and update methods

## [2.2.0] - 2020-05-22

- Implemented a clear method in the IsometricCanvas class

## [2.1.0] - 2020-05-22

- Implemented a new method and a path command to draw curves
- Added a new demo using curves
- Added more tests to test curves

## [2.0.0] - 2020-05-22

- Changed the drawing commands to be space-separated instead of comma-separated
- Improved the readability of the regular expression for the commands
- Fixed a bug in the `draw` that was not returning the `IsometricPath` instance

## [1.5.1] - 2020-02-26

- Create new tests
- Increase the test coverage
- During the creation of the new tests, some bugs were detected and fixed:
    * strokeDasharray property was fixed using the correct name: strokeDashArray
    * The dash-array property was changed from comma separated numbers to space separated numbers
    * Fixed a bug in the width get property of the IsometricCanvas class
    * Fix a bug in the removeEventListener methods that were not removing the events

## [1.5.0] - 2020-02-25

- IsometricCanvas and IsometricPath are now exposed directly in the module instead of exporting them inside an object
- Rename some methods of the IsometricCanvas class to make them more extensible:
    * addPath to addChild
    * addPaths to addChildren
    * removePath to removeChild
    * removePathByIndex to removeChildByIndex
- Added new methods to the IsometricCanvas class:
    * getElement: return the native SVG element
    * removeChildren: remove all the children of the IsometricCanvas
- Renamed a method of the IsometricPath class:
    * getPath to getElement
- Added more tests

## [1.4.2] - 2020-02-19

- Return the class instance in the methods addEventListener and removeEventListener of the IsometricCanvas and IsometricPath classes

## [1.4.0] - 2020-02-19

- Add two new methods to the IsometricCanvas class to add and remove event listeners
- Add two new methods to the IsometricPath class to add and remove event listeners
- Modified the first demo example to show the usage of the new methods

## [1.3.0] - 2019-12-20

- IsometricCanvas setter properties now change the SVG element
- IsometricPath setter properties now change the SVG path element
- New methods in the IsometricCanvas class (removePath, removePathByIndex, and clear)
- Fix a bug in the IsometricPath class about missing strokeOpacity property

## [1.1.0 - 1.1.1] - 2019-12-19

- Refactored how to share the canvas properties among shapes using a global class
- Removed some internal public methods from the IsometricPath class
- Created a new method in the Isometric path to draw using string commands
- Created a new demo using the new method
- New logo

## [1.0.0 - 1.0.1] - 2019-12-17

- Created the isometric library
