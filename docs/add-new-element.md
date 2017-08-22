# Adding a Visual Element

The current project holds a collection of visual plugin is.
For the full list [click here](README.md#elements-plugins).

To create a new visual component we will need to things:
1. Create a new `GenericComponent` class that will display the component.
2. Create a new `data-format` to transform the data to fit this visual component.

To read more about data-formats [click here](data-formats).

This article explains how to create a generic component that:
* Displays an array of data in a `ul` list.
* Enables defining the color of the text in the `ul`.

## Creating a new Visual Component

Under `/client/src/components/generic` create a new class (for the sake of this article we will use NewComponent):

`NewComponent.tsx`:

```tsx
import * as React from 'react';
import * as _ from 'lodash';

import Card from '../../Card';
import { GenericComponent, IGenericProps, IGenericState } from '../GenericComponent';

interface INewProps extends IGenericProps {
  props: {
    textColor: string;
  };
};

interface INewState extends IGenericState {
  values: any[];
}

export default class BarData extends GenericComponent<INewProps, INewState> {

  /**
   * This method is used to translate data received from a data-format
   * It means, it will look for 'values' property in a source of data.
   */
  static fromSource(source: string) {
    return {
      values: GenericComponent.sourceFormat(source, 'values'),
    };
  }

  constructor(props: any) {
    super(props);

    this.state = {
      values: []
    };
  }

  render() {
    let { values } = this.state;
    let { id, title, subtitle, props } = this.props;
    let { textColor } = props;

    let liElements = [];
    if (!values || !values.length) {
      liElements = [
        (
          <li><div style={{ padding: 20 }}>No data is available</div></li>
        )
      ];
    }

    else {
      liElements = values.map((value, idx) => {
        return (
          <li key={idx} style={{ color: textColor }} >
            {JSON.stringify(value)}
          </li>
        );
      });
    }

    // Todo: Receive the width of the SVG component from the container
    return (
      <Card id={id} title={title} subtitle={subtitle}>
        <ul>
          {liElements}
        </ul>
      </Card>
    );
  }
}
```

## Creating the data-format

To create the correlative data format, we need to create a data transformer the outputs a 'values' property (To correlate to the property in the `fromSource` static method).

We'll create a data format that receives an array and stores it in a format attirbute named `values` in correlation to the requested `values` in the `fromSource` static method.

Under `/client/src/utils/data-formats/formats` create the following file (we'll use 'new-format' for the sake of this article):

`new-format.ts`:

```ts
import { DataFormatTypes, IDataFormat, formatWarn, getPrefix } from '../common';
import { IDataSourcePlugin } from '../../../data-sources/plugins/DataSourcePlugin';

/**
 * Please look at other data formats, to follow documentation formats
 */
export function filter (
  format: string | IDataFormat, 
  state: any, 
  dependencies: IDictionary, 
  plugin: IDataSourcePlugin, 
  prevState: any) {

  const args = typeof format !== 'string' ? format.args : {};
  const prefix = getPrefix(format);
  const data = args.data || 'values'; // This property is used to look for the data location
  const field = args.field || 'value';
  const unknown = args.unknown || 'unknown';

  const values = state[data];
  if (!values) { return null; }

  let result = {};
  result[prefix + 'values'] = values;
  return result;
}
```