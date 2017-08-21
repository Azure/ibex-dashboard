# Actions
This article describes how to use actions on Elements or Filters.

# Format

Element or Filter:

```ts
{
  type: 'Element/Filter Type',
  dependencies: {
    /*...*/
  },
  actions: {
    actionType: "dataSourceName:action"
  }
}
```

Or

```ts
{
  type: 'Element/Filter Type',
  dependencies: {
    /*...*/
  },
  actions: {
    actionType: {
      action: "dataSourceName:action",
      params: {
        /* required parameters for data source */
      }
    }
  }
}
```

# Examples

## Updading selected values in filter

```ts
{
  actions: {
    onChange: "filter:updateSelectedValues"
  }
}
```

Or

```ts
{
  actions: {
    onChange: "filter:updateSelectedValues:property-name-to-update"
  }
}
```

## Opening a dialog

```ts
{
  actions: {
    action: "dialog:dialog-name",
    params: {
      title: "args:property1-in-selected-item",
      param1: "args:property2-in-selected-item"
    }
  }
}
```

# Actions in Data Source

All data sources have the following triggerable actions:

## updateDependencies

Called automatically when dependencies are updated.
Any new dependencies/args received will override existing data.

```ts
updateDependencies (dependencies: IDictionary, args: IDictionary, callback: (result: any) => void)
```

| Parameter | Type | Description 
| :--------|:-----|:-----------
| `dependencies`| `IDictionary` | Any new dependency received will override existing data
| `args`| `IDictionary` | Any new argument received will override existing data
| `callback`| `(result: any) => void` | Callback to call when action is completed

## failure

Called when there's a failure with one of the actions.
Failure will automatically raise a "Toast" displaying the error.

```ts
failure(error: any): void
```

| Parameter | Type | Description 
| :--------|:-----|:-----------
| `error`| `any` | JSON error object

## updateSelectedValues

An action that can be called by filters (or other triggers) passing a list of selected values.
This is usually used in scenarios of filters with a data source holding the selected values.

```ts
updateSelectedValues (dependencies: IDictionary, selectedValues: any, callback: (result: any) => void): void;
```

| Parameter | Type | Description 
| :--------|:-----|:-----------
| `dependencies`| `IDictionary` | Will automatically be added to the action with the dependencies relevant for the current element/filter
| `selectedValues`| `any` | An object containing the selected values. Usually an array of strings.
| `callback`| `(result: any) => void` | Callback to call once the action is done.

## refresh

An action that automatically calls `updateDependencies` with the last received arguments, causing a refresh of the data source.
When working with dashboard refresh, this method will be called for all object that contain no dependencies (root level data sources).

```ts
refresh (): void;
```