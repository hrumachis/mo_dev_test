# Multiorders Developer Test

Here at Multiorders we process shipments for sellers in various marketplaces, one of the features we have is to allow the configuration is shipment labels for the sellers orders. We are looking to expand our capabilities in this domain and allow for a more powerful way for our users to create custom templates for their labels. To do that we need to create a tool that generates a canvas representation of a label out of a JSON data structure.

### How to run project
run commands in project directory:<br>
`npm install`<br>
`npm start label.json` // first argument is path to json file<br>

### JS code style
* private class functions, variables starts with underscore '_'

## Json Schema
```javascript
{
    width: number, // required
    height: number, // required
    elements: Element[] // required
}

Element {
    type: ELEMENT_TYPE, // required
    src: string, // required with type ELEMENT_TYPE.IMAGE
    scale: number, // optional, default = 1
    x: number, // optional, default = 0
    y: number, // optional, default = 0
    color: string, // optional, default = "#000000" only HEX color values
    text: string, // required with type ELEMENT_TYPE.TEXT
    fontSize: number, // optional, default = 16
    height: number, // required with type ELEMENT_TYPE.RECTANGLE && optional with type ELEMENT_TYPE.TEXT
    width: number, // required with type ELEMENT_TYPE.RECTANGLE && optional with type ELEMENT_TYPE.TEXT
    strokeSize: number, // optional, default = 1
}

enum ELEMENT_TYPE {
    TEXT,
    IMAGE,
    RECTANGLE,
}
```

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
