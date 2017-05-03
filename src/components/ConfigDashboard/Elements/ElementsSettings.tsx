import * as React from 'react';
import * as _ from 'lodash';

import PieSettings from './PieSettings';


interface IElementsSettingsProps{
    ElementsSettings: IElementsContainer,
    shouldSave: boolean
}
interface IElementsSettingsState{ 

}

export default class ElementsSettings extends React.Component<IElementsSettingsProps,IElementsSettingsState>{
    
    render(){
        var pieSettings = _.find(this.props.ElementsSettings.elements,{'type':'PieData'});
        var shouldSave = this.props.shouldSave;
        return(
            <div className="md-grid">
                <div className="md-cell md-cell--6">
                    <PieSettings settings={pieSettings} shouldSave={shouldSave}/>
                </div>
            </div>
        );
    }
}