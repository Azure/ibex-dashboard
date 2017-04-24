import * as React from 'react';
import { GenericComponent } from './GenericComponent';
import Button from 'react-md/lib/Buttons/Button';
import SelectField from 'react-md/lib/SelectFields';

const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export default class TextFilter extends GenericComponent<any, any> {
  // static propTypes = {}
  // static defaultProps = {}

  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);
  }

  onChange(newValue, index, event) {
    this.trigger('onChange', newValue);
  }

  render() {
    var { selectedValue, values } = this.state;
    values = values || [];

    // var buttons = values.map((value, idx) => {
    //   return <Button flat key={idx} label={value} primary={value === selectedValue} onClick={this.onChange.bind(null, value)} />
    // })

    return (
        <SelectField
          id="timespan"
          label="Timespan"
          value={selectedValue}
          menuItems={values}
          position={SelectField.Positions.BELOW}
          onChange={this.onChange}
          toolbar={false}
          className='md-select-field--toolbar'
        />
    );
  }
}