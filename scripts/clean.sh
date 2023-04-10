#! /bin/sh

RIMRAF="./node_modules/rimraf/dist/cjs/src/bin.js"

$RIMRAF dist/
$RIMRAF esm/
$RIMRAF web/
$RIMRAF index.d.ts
$RIMRAF node.d.ts
$RIMRAF index.node.js
$RIMRAF index.js