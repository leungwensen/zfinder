'use strict';
/**
 * plantuml module
 * @module plantuml
 * @see module:index
 */
const path = require('path');
const shelljs = require('shelljs');

const uml = `@startuml
Class01 "1" *-- "many" Class02 : contains
Class03 o-- Class04 : aggregation
Class05 --> "1" Class06
@enduml`;

const plantumljar = path.resolve(__dirname, './plantuml.jar');

const svg = shelljs.echo(uml).exec(`java -jar ${plantumljar} -tsvg -pipe`, {
  silent: true,
}).stdout;

console.log(svg);
