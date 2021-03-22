# How to run project
run commands in project directory:<br>
`npm install`<br>
`npm start label.json` // first argument is path to json file<br>

# JS code style
* private class functions, variables starts with underscore '_'

# Json Schema
`{<br>
    width: number, // required<br>
    height: number, // required<br>
    elements: Element[] // required<br>
}`<br>
<br><br>
`Element {<br>
    type: ELEMENT_TYPE, // required<br>
    src: string, // required with type ELEMENT_TYPE.IMAGE<br>
    scale: number, // optional, default = 1<br>
    x: number, // optional, default = 0<br>
    y: number, // optional, default = 0<br>
    color: string, // optional, default = "#000000" only HEX color values<br>
    text: string, // required with type ELEMENT_TYPE.TEXT<br>
    fontSize: number, // optional, default = 16<br>
    height: number, // required with type ELEMENT_TYPE.RECTANGLE && optional with type ELEMENT_TYPE.TEXT<br>
    width: number, // required with type ELEMENT_TYPE.RECTANGLE && optional with type ELEMENT_TYPE.TEXT<br>
    strokeSize: number, // optional, default = 1<br>
}`<br>
<br><br>
`ELEMENT_TYPE {<br>
    TEXT,<br>
    IMAGE,<br>
    RECTANGLE,<br>
}`<br>

# Multiorders Developer Test

Here at Multiorders we process shipments for sellers in various marketplaces, one of the features we have is to allow the configuration is shipment labels for the sellers orders. We are looking to expand our capabilities in this domain and allow for a more powerful way for our users to create custom templates for their labels. To do that we need to create a tool that generates a canvas representation of a label out of a JSON data structure.

## User Interface

Split the screen in half. On the left we have JSON input. On the right process output in canvas.

## Requirements

* Set the width and height of the canvas element.
* Allow placing an arbitrary number of elements on the canvas.
* Allow for arbitrary placement of elements on the canvas.

### Elements

* Text
* Rectangle
* Image

### Element properties

* Allow setting width and height of Text and Rectangle elements.
* Allow setting font size and color of Text elements.
* Allow setting stroke size and color for Rectangle elements.
* Allow setting scale for Image elements.
