import * as React from 'react';

import PieSettings from './PieSettings';
import TimelineSettings from './TimelineSettings';
import BarDataSettings from './BarDataSettings';
import AreaSettings from './AreaSettings';
import ScatterSettings from './ScatterSettings';

export class SettingsItem {
  public type:string;
  public id:string;
  public settings:any;
}

export interface IElementSettingsFactory {
  getSettingsByType(item: SettingsItem): JSX.Element;
  getSettingsItems(elements: any): SettingsItem[];
}

export default class ElementSettingsFactory implements IElementSettingsFactory {

  getSettingsByType(item: SettingsItem): JSX.Element {

    let settingsPlugins = {
      PieData:PieSettings,
      Timeline:TimelineSettings,
      BarData:BarDataSettings,
      Area:AreaSettings,
      Scatter:ScatterSettings
    };

    let SettingsReactElement = settingsPlugins[item.type];
    if(SettingsReactElement) {
      return <SettingsReactElement settings={item.settings} />;
    }

    return null;
  }

  getSettingsItems(elements: IElement[]): SettingsItem[] {
    return elements.map(item => (
      {
        type:item.type,
        id:item.id,
        settings:item
      }
    ));
  }
}