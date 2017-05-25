import * as React from 'react';
import * as _ from 'lodash';

import {BaseSettings, IBaseSettingsProps, IBaseSettingsState } from '../../common/BaseSettingsComponent';
export default class TimelineSettings extends BaseSettings {

    //abstract members implementation
    icon = "timeline";

    constructor(props: IBaseSettingsProps) {
        super(props);
    }

    renderChildren(){
        
    }
}