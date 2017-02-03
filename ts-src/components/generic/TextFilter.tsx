import * as React from 'react';
import { GenericComponent } from './GenericComponent';
import connectToStores from 'alt-utils/lib/connectToStores';
import FlatButton from 'material-ui/FlatButton';
import Checkbox from 'material-ui/Checkbox';
import IconButton from 'material-ui/IconButton';
import SelectAllIcon from 'material-ui/svg-icons/toggle/check-box';
import SelectNoneIcon from 'material-ui/svg-icons/toggle/check-box-outline-blank';
import { Toolbar, ToolbarGroup } from 'material-ui/Toolbar';

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
      return <FlatButton key={idx} label={value} primary={value === selectedValue} onClick={this.changeSelected.bind(null, value)} />
    })

    return (
      <div>
        {buttons}
      </div>    
    );
  }
}