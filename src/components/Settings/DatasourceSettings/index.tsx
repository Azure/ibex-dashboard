import * as React from 'react';
import * as _ from 'lodash';
import ListItem from 'react-md/lib/Lists/ListItem';
import List from 'react-md/lib/Lists/List';
import plugins from '../../../data-sources/plugins';

interface IDatasourceSettingsProps {
  settings: IDataSourceContainer;
}

interface IDatasourceSettingsState { 
  selectedIndex: number;
}

export default class DatasourceSettings extends React.Component<IDatasourceSettingsProps, IDatasourceSettingsState> {

  static uniqueId = 0;

  state = {
    selectedIndex: 0
  };
    
  constructor(props: IDatasourceSettingsProps) {
    super(props);

    this.onMenuClick = this.onMenuClick.bind(this);
    this.getSettings = this.getSettings.bind(this);
    this.renderSettingsEditor = this.renderSettingsEditor.bind(this);
    this.renderMenuItems = this.renderMenuItems.bind(this);
    this.getSettingsEditor = this.getSettingsEditor.bind(this);
  }
  
  getSettingsEditor(element: DataSource): JSX.Element {

    if (!element) { return null; }

    let ReactElementClass = plugins[element.type];
    if (ReactElementClass && ReactElementClass.editor) {
      let SettingsEditor = ReactElementClass.editor;
      return <SettingsEditor key={DatasourceSettings.uniqueId++} settings={element} />;
    }
    return null;
  }

  onMenuClick(index: number) {
    this.setState({ selectedIndex: index });
  }

  getSettings() {
    return this.props.settings.dataSources.length > this.state.selectedIndex ?
        this.props.settings.dataSources[this.state.selectedIndex] :
        null;
  }
  
  renderSettingsEditor() {
    let selectedSettings = this.getSettings();
    if (!selectedSettings) {
      return <h1>No data-sources were found</h1>;
    }

    let editor = this.getSettingsEditor(selectedSettings);
    if (editor) { return editor; }

    return <h1>No settings yet for {selectedSettings.type}</h1>;
  }

  renderMenuItems() {
    let { selectedIndex } = this.state;
    let items = this.props.settings.dataSources.map((item, idx) => (
      <ListItem
        key={idx}
        primaryText={item.id}
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
  }

  render() {
    return (
      <div className="md-grid md-cell md-cell--12">
        {this.renderMenuItems()}
        <div className="md-cell md-cell--top md-cell--stretch md-cell--10">
          {this.renderSettingsEditor()}
        </div>
      </div>
    );
  }
}