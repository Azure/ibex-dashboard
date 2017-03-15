import * as React from 'react';
import { GenericComponent } from './GenericComponent';
import Button from 'react-md/lib/Buttons/Button';

export default class TextFilter extends GenericComponent<any, any> {
  // static propTypes = {}
  // static defaultProps = {}

  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);
  }

  onChange(newValue) {
    this.trigger('onChange', [newValue]);
  }

  render() {
    var { selectedValue, values } = this.state;
    values = values || [];

    var buttons = values.map((value, idx) => {
      return <Button flat key={idx} label={value} primary={value === selectedValue} onClick={this.onChange.bind(null, value)} />
    })

    return (
      <div>
        {buttons}
      </div>    
    );
  }
}