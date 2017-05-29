import * as React from 'react';
import * as _ from 'lodash';

import Card from 'react-md/lib/Cards/Card';
import TextField from 'react-md/lib/TextFields';
import FontIcon from 'react-md/lib/FontIcons';
import CardTitle from 'react-md/lib/Cards/CardTitle';
import Switch from 'react-md/lib/SelectionControls/Switch';
import Avatar from 'react-md/lib/Avatars';
import SelectField from 'react-md/lib/SelectFields';

import SettingsActions from '../../actions/SettingsActions';

export interface IBaseSettingsProps {
  shouldSave: boolean;
  settings: IElement;
}

export interface IBaseSettingsState { 
  shouldSave: boolean;
  stateSettings: IElement; // we need to persist the changes in state until a save is requested
}

export abstract class BaseSettings extends React.Component<IBaseSettingsProps, IBaseSettingsState> {

  // require derived classes to implement
  abstract icon: string;
  abstract renderChildren();
  
  constructor(props: IBaseSettingsProps) {
    super(props);

    this.onParamChange = this.onParamChange.bind(this);
    this.onShowLegendChange = this.onShowLegendChange.bind(this);
    this.componentDidUpdate =  this.componentDidUpdate.bind(this);
    this.onParamSelectChange = this.onParamSelectChange.bind(this);
    this.updateProperty = this.updateProperty.bind(this);
    this.renderChildren = this.renderChildren.bind(this);

    this.state = {
      stateSettings: props.settings,
      shouldSave: false
    };
  }

  componentDidUpdate(prevProps: IBaseSettingsProps, prevState: IBaseSettingsState) {
    if (this.props.shouldSave) {
      this.save();
    }
  }

  save() {
    // tell the parents save ended
    SettingsActions.saveSettingsCompleted();
  }

  onParamChange(value: string, event: any) {
    let { stateSettings } = this.state;
    stateSettings[event.target.id] = value;
    this.setState({ stateSettings });
  }

  onParamSelectChange(newValue: string, newActiveIndex: number, event: any) {

    // a little hacking to get the id of the parent, 
    // because event does not contain the outer element, but only the inner li
    let { stateSettings } = this.state;
    let cur = event.target;

    while (cur && !cur.classList.contains('ddl')) {
      cur = cur.parentNode;
    }

    if (cur) {
      cur = cur.querySelector('input');
      var id = cur.id;
      this.updateProperty(stateSettings, id, newValue);
      this.setState({ stateSettings });
    }
  }
  
  onShowLegendChange(checked: boolean) {
    let { stateSettings } = this.state;
    stateSettings.props.showLegend = checked;
    this.setState({ stateSettings });
  }

  updateProperty(object: any, property: string, value: any) {
    let arr = property.split('.');
    let parent: any;
    let key: string;

    while (arr.length && (parent = object) && (key = arr.shift()) && (object = object[key])) { }
    if (parent) { parent[key] = value; }
  }

  render() {
    let { stateSettings } = this.state;
    let { id, props, title, subtitle, size, type } = stateSettings;
    return (
      <Card>
        <CardTitle title={type} avatar={<Avatar random icon={<FontIcon>{this.icon}</FontIcon>} />} />
        <div className="md-grid">
          <TextField
            id="id"
            label="Id"
            placeholder="id"
            leftIcon={<FontIcon>settings</FontIcon>}
            className="md-cell md-cell--bottom md-cell--6"
            value={id}
            onChange={this.onParamChange}
          />
          <TextField
            id="title"
            label="Title"
            placeholder="title"
            leftIcon={<FontIcon>title</FontIcon>}
            className="md-cell md-cell--bottom  md-cell--6"
            value={title}
            onChange={this.onParamChange}
          />
          <TextField
            id="subtitle"
            label="Subtitle"
            placeholder="subtitle"
            leftIcon={<FontIcon>text_fields</FontIcon>}
            className="md-cell md-cell--bottom  md-cell--6"
            value={subtitle}
            onChange={this.onParamChange}
          />
          <div className="md-cell md-cell--bottom  md-cell--6">
            <div className="md-grid">
              <SelectField
                id="size.w"
                name="size.w"
                label="Width"
                defaultValue="1"
                menuItems={[1, 2, 3, 4, 5, 6, 7, 8, 9]}
                onChange={this.onParamSelectChange}
                className="md-cell md-cell--bottom ddl"
                value={size.w}
              />
              <SelectField
                id="size.h"
                name="size.h"
                label="Width"
                defaultValue="1"
                menuItems={[1, 2, 3, 4, 5, 6, 7, 8, 9]}
                onChange={this.onParamSelectChange}
                className="md-cell md-cell--bottom ddl"
                value={size.h}
              />
            </div>
          </div>
          {this.renderChildren()}
        </div>
      </Card>
    );
  }
};