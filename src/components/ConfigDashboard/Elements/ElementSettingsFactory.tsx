import * as React from 'react';
import  {BaseSettings, IBaseSettingsProps, IBaseSettingsState } from '../../common/BaseSettingsComponent';
import {IElementSettingsFactory,SettingsItem} from './IElementSettingsFactory';
import PieSettings from './PieSettings';
import TimelineSettings from './TimelineSettings';
import BarDataSettings from './BarDataSettings';
import AreaSettings from './AreaSettings';
import ScatterSettings from './ScatterSettings';

export default class ElementSettingsFactory implements IElementSettingsFactory {

  getSettingsByType(item: SettingsItem): JSX.Element{

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
        return elements.map(item=> 
        ({
          type:item.type,
          id:item.id,
          settings:item
        }));
    }
}