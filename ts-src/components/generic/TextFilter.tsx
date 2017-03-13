import * as React from 'react';
import { GenericComponent } from './GenericComponent';
import connectToStores from 'alt-utils/lib/connectToStores';
import Button from 'react-md/lib/Buttons/Button';

export default class TextFilter extends GenericComponent<any> {
  // static propTypes = {}
  // static defaultProps = {}

  constructor(props) {
    super(props);

    this.changeSelected = this.changeSelected.bind(this);
  }

  changeSelected(newValue) {
    this.trigger('changeSelected', [newValue]);
  }

  render() {
    var { selectedValue, values } = this.state;
    values = values || [];

    var buttons = values.map((value, idx) => {
      return <Button flat key={idx} label={value} primary={value === selectedValue} onClick={this.changeSelected.bind(null, value)} />
    })

    return (
      <div>
        {buttons}
      </div>    
    );
  }
}