import * as React from 'react';
import Autocomplete from 'react-md/lib/Autocompletes';
import FontIcon from 'react-md/lib/FontIcons';

import icons from '../../constants/icons';

const styles = {
  list: {
    height: '136px',
  } as React.CSSProperties
};

interface IIconPickerProps {
  defaultIcon?: string;
  defaultLabel?: string;
}

interface IIconPickerState {
  label: string;
  icon: string;
  filterType: any;
}

export default class IconPicker extends React.Component<IIconPickerProps, IIconPickerState> {

  static defaultProps = {
    defaultLabel: 'Search icons',
    defaultIcon: 'dashboard',
  };

  static listItems: any = [];

  constructor(props: any) {
    super(props);

    const { defaultLabel, defaultIcon } = props;

    this.state = {
      label: defaultLabel,
      icon: defaultIcon,
      filterType: Autocomplete.caseInsensitiveFilter,
    };

    this.onChange = this.onChange.bind(this);
  }

  getIcon() {
    const { icon } = this.state;
    // check icon value is valid
    if ( icons.findIndex(i => i === icon) > 0 ) {
      return icon;
    }
    return 'dashboard';
  }

  componentWillMount() {
    if (IconPicker.listItems.length === 0) {
      IconPicker.listItems = icons.map((icon, i) => ({ icon, leftIcon: <FontIcon key="icon">{icon}</FontIcon> }));
    }
  }

  render() {
    const { label, filterType, icon } = this.state;
    return (
      <Autocomplete
        id="icon"
        label={label}
        className="md-cell--stretch"
        data={IconPicker.listItems}
        dataLabel={'icon'}
        listStyle={styles.list}
        value={icon}
        onChange={this.onChange}
        onAutocomplete={this.onChange}
      />
    );
  }

  private onChange(icon: string) {
    this.setState({ icon });
  }
}
