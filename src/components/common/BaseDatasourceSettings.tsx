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
  settings: DataSource;
}

export interface IBaseSettingsState { 
}

export abstract class BaseDatasourceSettings<T extends IBaseSettingsState> 
                      extends React.Component<IBaseSettingsProps, T> {

  // require derived classes to implement
  abstract icon: string;
  abstract renderChildren();
  
  constructor(props: IBaseSettingsProps) {
    super(props);

    this.onParamChange = this.onParamChange.bind(this);
    this.onParamSelectChange = this.onParamSelectChange.bind(this);
    this.getProperty = this.getProperty.bind(this);
    this.updateProperty = this.updateProperty.bind(this);
    this.renderChildren = this.renderChildren.bind(this);
  }

  protected getProperty(property: string, defaultValue: any = null): any {
    let { settings } = this.props;
    let arr = property.split('.');
    let obj = settings;
    let parent = obj;

    while (arr.length && (obj = obj && obj[arr.shift()])) { }
    
    if (typeof obj !== 'undefined') { return obj; }
    
    return defaultValue;
  }

  protected updateProperty(property: string, value: any): void {
    let { settings } = this.props;
    let arr = property.split('.');
    let object: any = settings;
    let parent: any;
    let key: string;

    while (arr.length && (parent = object) && (key = arr.shift()) && (object = object[key])) { }
    if (parent) { parent[key] = value; }
  }

  save() {
    // tell the parents save ended
    SettingsActions.saveSettingsCompleted();
  }

  onParamChange(value: string, event: any) {
    this.updateProperty(event.target.id, value);
  }

  onParamSelectChange(newValue: string, newActiveIndex: number, event: any) {

    // a little hacking to get the id of the parent, 
    // because event does not contain the outer element, but only the inner li
    let cur = event.target;

    while (cur && !cur.classList.contains('ddl')) {
      cur = cur.parentNode;
    }

    if (cur) {
      cur = cur.querySelector('input');
      var id = cur.id;
      this.updateProperty(id, newValue);
    }
  }

  render() {
    let { settings } = this.props;
    let { id, type } = settings;
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
            defaultValue={id}
            onChange={this.onParamChange}
          />
          {this.renderChildren()}
        </div>
      </Card>
    );
  }
};