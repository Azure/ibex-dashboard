import Fluxxor from 'fluxxor';
import React from 'react';
import {Actions} from '../actions/Actions';
import DateTimePicker from 'react-widgets/lib/DateTimePicker';
import momentLocalizer from 'react-widgets/lib/localizers/moment';
import SelectField from 'material-ui/lib/select-field';
import MenuItem from 'material-ui/lib/menus/menu-item';
import moment from 'moment';
import {momentToggleFormats} from '../utils/Utils.js';
import '../styles/DataSelector.css';
import 'react-widgets/dist/css/react-widgets.css';
import '../styles/Header.css';

const TimeSelectionOptions = [
    {label: '', timeType: 'customDatePlaceholder'},
    {label: 'Today', timeType: 'days', subtractFromNow: 0},
    {label: 'Yesterday', timeType: 'days', subtractFromNow: 1},
    {label: 'This Week', timeType: 'weeks', subtractFromNow: 1},
    {label: 'Last Week', timeType: 'weeks', subtractFromNow: 2},
    {label: 'Past Hour', timeType: 'hours', subtractFromNow: 1},
    {label: 'This Month', timeType: 'months', subtractFromNow: 0},
    {label: 'Last Month', timeType: 'months', subtractFromNow: 1},
    {label: 'Select Date', timeType: 'customDate', subtractFromNow: 0},
    {label: 'Select Date+Hour', timeType: 'customDateTime', subtractFromNow: 0},
    {label: 'Select Month', timeType: 'customMonth', subtractFromNow: 0}
];

momentLocalizer(moment);

const FluxMixin = Fluxxor.FluxMixin(React),
      StoreWatchMixin = Fluxxor.StoreWatchMixin("DataStore");

export const DataSelector = React.createClass({
  mixins: [FluxMixin, StoreWatchMixin],
  
  getInitialState(){      
      return{
          timeType: '',
          selectedIndex: 0
      };
  },
  
  getStateFromFlux() {
    return this.getFlux().store("DataStore").getState();
  },
  
  calendarOnChange(value, format){
     this.setState({timeType: ''});
  },
  
  cancelDateTimePicker(){
      this.setState({timeType: ''});
  },
  
  handleChange(event, index, value){
      let timeSelectionIndex = this.customDateEntered()? index : index + 1;
      var selectionOption = TimeSelectionOptions[timeSelectionIndex];
      let siteKey = this.props.siteKey;
      
      if(selectionOption.timeType.startsWith("custom")){
          this.setState({timeType: value});
      }else{
          this.getFlux().actions.DASHBOARD.changeDate(siteKey, value, selectionOption.timeType);
      }
  },
  
  handleDatePickerChange(dateObject, dateStr){
      let formatter = Actions.constants.TIMESPAN_TYPES[this.state.timeType];
      let siteKey = this.props.siteKey;
      
      this.getFlux().actions.DASHBOARD.changeDate(siteKey, momentToggleFormats(dateStr, formatter.reactWidgetFormat, formatter.format), this.state.timeType);
      this.setState({timeType: ''});
  },
  
  customDateEntered(){
      return this.state.timespanType && (this.state.timespanType === 'customDate' || this.state.timespanType === 'customDateTime' || this.state.timespanType === 'customMonth');
  },
  
  predefinedDateOptions(){
      let menuItems = [];
      
      TimeSelectionOptions.forEach(timeOption => {
                              let timeValue;
                              let label = timeOption.label;
                              
                              //if there is no custom date entered then skip adding the customDatePlaceholder option
                              if(!this.customDateEntered() && timeOption.timeType === 'customDatePlaceholder'){
                                  return false;
                              //if there is a custom date entered then display it in the list
                              }else if(timeOption.timeType === 'customDatePlaceholder'){
                                  timeValue = this.state.datetimeSelection;
                                  label = timeValue;
                              //format the pre defined date option
                              }else if(!timeOption.timeType.startsWith("custom")){
                                  timeValue = moment().subtract(timeOption.subtractFromNow, 
                                                                timeOption.timeType)
                                                      .format(Actions.constants.TIMESPAN_TYPES[timeOption.timeType].format);
                              //Either the custom date or custom date+time options
                              }else{
                                  label = <div><i className="fa fa-calendar"></i>&nbsp;{label}</div>;
                                  timeValue = timeOption.timeType;
                              }
                              
                              menuItems.push(<MenuItem value={timeValue} primaryText={label}/>);
     });
     
     return menuItems;
  },
  
  render() {
    let self = this;
    let showDatePicker = this.state.timeType && this.state.timeType === 'customDate' ? true : false;
    let showTimePicker = this.state.timeType && this.state.timeType === 'customDateTime' ? true : false;
    let showMonthSelector = this.state.timeType && this.state.timeType === 'customMonth' ? true : false;
    let monthSelectorProps = showMonthSelector ? {initialView: "year", finalView: "year"}: {};
    
    return (
     <div className="row dateRow">
         <div className="col-sm-12 dateFilterColumn">
             <div className="input-group dateFilter">
                {!showDatePicker && !showTimePicker && !showMonthSelector ?
                    <SelectField underlineStyle={{borderColor: '#337ab7', borderBottom: 'solid 3px'}} 
                                 labelStyle={{fontWeight: 600, color:'#2ebd59'}} 
                                 value={this.state.datetimeSelection} 
                                 onChange={this.handleChange}>
                       {self.predefinedDateOptions()}
                    </SelectField>
                 :
                    <DateTimePicker value={new Date()}
                                    onChange={this.handleDatePickerChange}
                                    format={Actions.constants.TIMESPAN_TYPES[this.state.timeType].reactWidgetFormat} 
                                    time={showTimePicker} {...monthSelectorProps}/>
                }
            </div>
            <div>
            {showTimePicker || showDatePicker || showMonthSelector ? 
                <button id="cancel-button" type="button" className="btn btn-danger btn-sm" onClick={this.cancelDateTimePicker}>
                        <span className="fa fa-times-circle-o" aria-hidden="true"></span>&nbsp;Cancel
                </button> 
               :
                <button id="save-button" type="button" className="btn btn-primary btn-sm">
                        <span className="fa fa-refresh" aria-hidden="true">
                        </span>
                        <span>&nbsp;Refresh</span>
                 </button>
            }
            </div>
         </div>
     </div>
     );
  }
});