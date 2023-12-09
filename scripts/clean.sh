#! /bin/sh

RIMRAF="./node_modules/rimraf/dist/esm/bin.mjs"

$RIMRAF dist/
$RIMRAF esm/
$RIMRAF web/
$RIMRAF index.d.ts
$RIMRAF node.d.ts
$RIMRAF index.node.js
$RIMRAF index.js