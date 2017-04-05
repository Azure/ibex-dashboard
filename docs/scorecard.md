

| Property | Type | Value | Description 
| :--------|:-----|:------|:------------
| `id`| `string` || ID of the element on the page
| `type`| `string` | "Scorecard" |
| `title`| `string` || Title that will appear at the top of the card
| `size`| `{ w: number, h: number}` || Width/Height of the card. The size of each inner card is 2x2 or 2x3 depending on subheading

```js
{
  id: "errors",
  type: "Scorecard",
  title: "Errors",
  size: { w: 2, h: 3 },
  dependencies: {
    value: "errors:handledAtTotal",
    color: "errors:handledAtTotal_color",
    icon: "errors:handledAtTotal_icon",
    subvalue: "errors:handledAtTotal",
    className: "errors:handledAtTotal_class"
  },
  props: {
    subheading: "Avg",
    onClick: "onErrorsClick"
  },
  actions: {
    onErrorsClick: {
      action: "dialog:errors",
      params: {
        title: "args:title",
        type: "args:type",
        innermostMessage: "args:innermostMessage",
        queryspan: "timespan:queryTimespan"
      }
    }
  }
}
```