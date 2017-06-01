import * as React from 'react';
import  {BaseSettings, IBaseSettingsProps, IBaseSettingsState } from '../../common/BaseSettingsComponent';

export class SettingsItem {
  public type:string;
  public id:string;
  public settings:any;
}

export interface IElementSettingsFactory {
    getSettingsByType (item:SettingsItem):JSX.Element;
    getSettingsItems (elements:any):SettingsItem[];
}

