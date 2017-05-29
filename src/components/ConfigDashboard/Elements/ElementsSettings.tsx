import * as React from 'react';
import * as _ from 'lodash';
import ListItem from 'react-md/lib/Lists/ListItem';
import List from 'react-md/lib/Lists/List';

import PieSettings from './PieSettings';
import TimelineSettings from './TimelineSettings';
import BarDataSettings from './BarDataSettings';
import AreaSettings from './AreaSettings';
import ScatterSettings from './ScatterSettings';
import  {BaseSettings, IBaseSettingsProps, IBaseSettingsState } from '../../common/BaseSettingsComponent';
import ElementSettingsFactory from './ElementSettingsFactory';
import {IElementSettingsFactory,SettingsItem} from './IElementSettingsFactory';

interface IElementsSettingsProps{
    ElementsSettings: IElementsContainer
}
interface IElementsSettingsState{ 
  selectedSettings:SettingsItem
}

class ElementSettingsFactoryManager {
    static getFactory():IElementSettingsFactory{
      return new ElementSettingsFactory();
    }
}

export default class ElementsSettings extends React.Component<IElementsSettingsProps,IElementsSettingsState>{
    
    constructor(props: IElementsSettingsProps) {
        super(props);
        this.onMenuClick = this.onMenuClick.bind(this);
        this.renderSettings = this.renderSettings.bind(this);
        this.getItemsFromSettings = this.getItemsFromSettings.bind(this);
        this.renderMenu = this.renderMenu.bind(this);
        this.createBaseSettings = this.createBaseSettings.bind(this);

        //init state
        var firstItem = this.getItemsFromSettings()[0];
        this.state = {
          selectedSettings: firstItem
        }
    }

    
    
    onMenuClick(item: SettingsItem) {
        this.setState({ selectedSettings: item });
    }
    renderSettings() {
      
        
        //create settings element based on the 3 params
        let elem = ElementSettingsFactoryManager.getFactory().getSettingsByType(this.state.selectedSettings);
        if(elem){
          return elem;
        }
        
        //or no suitable element found
        return (<h1>No settings yet for {this.state.selectedSettings.type}</h1>);
    }

    getItemsFromSettings() {
        return ElementSettingsFactoryManager.getFactory().getSettingsItems(this.props.ElementsSettings.elements);
    }

    createBaseSettings(item:SettingsItem) {
        var baseSettings = ElementSettingsFactoryManager.getFactory().getSettingsByType(item);
        
    }

    renderMenu() {
      var selectedItem = this.state.selectedSettings;
        var items = this.getItemsFromSettings().map((item, idx) => (
          <ListItem 
            key={idx}
            primaryText={item.id } 
            onClick={this.onMenuClick.bind(this, item)} 
            className={_.isEqual(selectedItem,item)?"active-item":""} 
            active={_.isEqual(selectedItem,item)} 
          />
        ));
        return(
            <List className="md-cell md-paper md-paper--1 md-cell--top md-cell--left md-cell--2 vertical-menu">
              {items}
            </List>
        );
    }


    render(){
        return(
              <div className="md-grid md-cell md-cell--12">
                
                  {this.renderMenu()}
                    
                
                <div className="md-cell md-cell--top md-cell--stretch md-cell--10">
                    {this.renderSettings()}
                </div>
            </div>
        );
    }
}