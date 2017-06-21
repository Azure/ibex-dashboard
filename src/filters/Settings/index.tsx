import * as React from 'react';
import * as _ from 'lodash';
import ListItem from 'react-md/lib/Lists/ListItem';
import List from 'react-md/lib/Lists/List';
import plugins from '../../components/generic/plugins';

interface IFiltersSettingsProps {
  settings: any;
}

interface IFiltersSettingsState { 
  selectedIndex: number;
}

export default class FiltersSettings extends React.Component<IFiltersSettingsProps, IFiltersSettingsState> {

  state = {
    selectedIndex: 0
  };
    
  constructor(props: IFiltersSettingsProps) {
    super(props);

    this.onMenuClick = this.onMenuClick.bind(this);
  }
  
  onMenuClick(index: number) {
    this.setState({ selectedIndex: index });
  }

  render() {

    let menuItems = () => {
      let { selectedIndex } = this.state;
      let items = this.props.settings.filters.map((item, idx) => (
        <ListItem
          key={idx} 
          primaryText={item.title? item.title : item.type + ' ' +item.dependencies.selectedValue} 
          onClick={this.onMenuClick.bind(this, idx)} 
          className={selectedIndex === idx ? 'active-item' : ''} 
          active={selectedIndex === idx} 
        />
      ));

      return (
        <List className="md-cell md-paper md-paper--1 md-cell--top md-cell--left md-cell--2 vertical-menu">
          {items}
        </List>
      );
    };

    let getSettingsEditor = () => {
    
      // Create settings element
      let selectedSettings = 
        this.props.settings.filters.length > this.state.selectedIndex ?
        this.props.settings.filters[this.state.selectedIndex] : 
        null;
      if (!selectedSettings) {
        return <h1>No filters were found</h1>;
      }

      let editor = FiltersSettings.getSettingsEditor(selectedSettings);
      if (editor) { return editor; }

      return <h1>No settings yet for {selectedSettings.type}</h1>;
    };

    return (
      <div className="md-grid md-cell md-cell--12">
        {menuItems()}
        <div className="md-cell md-cell--top md-cell--stretch md-cell--10">
          {getSettingsEditor()}
        </div>
      </div>
    );
  }


  static uniqueId = 0;

  static getSettingsEditor(element: IElement): JSX.Element {

    if (!element) { return null; }

    let ReactElementClass = plugins[element.type];
    if (ReactElementClass.editor) {
      let SettingsEditor = ReactElementClass.editor;
      return <SettingsEditor key={FiltersSettings.uniqueId++} settings={element} />;
    }
    return null;
  }
}