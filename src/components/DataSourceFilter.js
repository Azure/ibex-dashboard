import RadioButton from 'material-ui/RadioButton';
import RadioButtonGroup from 'material-ui/RadioButton/RadioButtonGroup';
import React from 'react';
import {Actions} from '../actions/Actions';
import Fluxxor from 'fluxxor';

const FluxMixin = Fluxxor.FluxMixin(React),
      StoreWatchMixin = Fluxxor.StoreWatchMixin("DataStore");

const styles={
    label: {
        color: 'rgb(46, 189, 89)',
        verticalAlign: 'top',
        paddingLeft: '5px'
    },
    labelContainer: {
        display: 'float'
    },
    buttonGroup:{
        display: 'inline-flex',
        marginTop: '7px',
        marginLeft: '7px'
    },
    radioButton: {
        width: "auto",
        float: "left",
        marginRight: "20px",
        marginLeft: "5px"
    },
    radioLabel: {
        width: 'auto'
    }
};

export const DataSourceFilter = React.createClass({
  mixins: [FluxMixin, StoreWatchMixin],
  
  getStateFromFlux() {
    return this.getFlux().store("DataStore").getState();
  },

  radioButtonChanged(e, value){
      this.getFlux().actions.DASHBOARD.filterDataSource(value);
  },

  renderDataSourceRadioOpts(iconStyle){
    let buttons = [];
    for (let [source, value] of Actions.constants.DATA_SOURCES.entries()) {
        buttons.push(<RadioButton labelStyle={styles.radioLabel} style={styles.radioButton} key={source} value={source} label={<div style={styles.labelContainer}><i style={iconStyle} className={value.icon}></i><span style={styles.label}>{value.display}</span></div>} />)
    }

    return <RadioButtonGroup onChange={this.radioButtonChanged} 
                             style={styles.buttonGroup} 
                             name="filters" 
                             valueSelected={this.state.dataSource}>
            {buttons}
           </RadioButtonGroup>;
  },

  render(){
      const iconStyle = {
        color: "#337ab7"
      };

      return this.renderDataSourceRadioOpts(iconStyle);
  }
});

