# Area

This article explains how define a Area element which is composed of [AreaChart](http://recharts.org/#/en-US/api/AreaChart).

## Basic properties

| Property | Type | Value | Description 
| :--------|:-----|:------|:------------
| `id`| `string` || ID of the element on the page
| `type`| `string` | "Area" |
| `title`| `string` || Title that will appear at the top of the view
| `subtitle`| `string` || Description of the chart (displayed as tooltip)
| `size`| `{ w: number, h: number}` || Width/Height of the view
| `dependencies`| `object` || Dependencies that are required for this element
| `props`| `object` || Additional properties to define for this element

## Dependencies 

Define `dependencies` as follows:

| Property | Type | Description 
| :--------|:-----|:-----------
| `values`| `string` | Reference to data source values
| `lines`| `string` | Reference to data source lines
| `timeFormat`| `string` | Reference to data source lines

## AreaChart properties
`areaProps` can be set to specify additional properties of the [AreaChart](http://recharts.org/#/en-US/api/AreaChart) chart component.