import * as React from 'react';
import * as _ from 'lodash';

import PieSettings from './PieSettings';
import TimelineSettings from './TimelineSettings';
import BarDataSettings from './BarDataSettings';
import AreaSettings from './AreaSettings';
import ScatterSettings from './ScatterSettings';


interface IElementsSettingsProps{
    ElementsSettings: IElementsContainer,
    shouldSave: boolean
}
interface IElementsSettingsState{ 

}

export default class ElementsSettings extends React.Component<IElementsSettingsProps,IElementsSettingsState>{
    
    render(){
        var pieSettings = _.find(this.props.ElementsSettings.elements,{'type':'PieData'});
        var timelineSettings = _.find(this.props.ElementsSettings.elements,{'type':'Timeline'});
        var barDataSettings = _.find(this.props.ElementsSettings.elements,{'type':'BarData'});
        var areaSettings = _.find(this.props.ElementsSettings.elements,{'type':'Area'});
        var scatterSettings = _.find(this.props.ElementsSettings.elements,{'type':'Scatter'});

        var shouldSave = this.props.shouldSave;
        return(
            <div className="md-grid">
                <div className="md-cell md-cell--6">
                    <PieSettings settings={pieSettings} shouldSave={shouldSave}/>
                </div>
                <div className="md-cell md-cell--6">
                    <TimelineSettings settings={timelineSettings} shouldSave={shouldSave}/>
                </div>
                <div className="md-cell md-cell--6">
                    <BarDataSettings settings={barDataSettings} shouldSave={shouldSave}/>
                </div>
                <div className="md-cell md-cell--6">
                    <AreaSettings settings={areaSettings} shouldSave={shouldSave}/>
                </div>
                <div className="md-cell md-cell--6">
                    <ScatterSettings settings={scatterSettings} shouldSave={shouldSave}/>
                </div>
            </div>
        );
    }
}