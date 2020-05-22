# Changelog

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
