import Fluxxor from 'fluxxor';
import React, { PropTypes, Component } from 'react';
import {Actions} from '../actions/Actions';

const FluxMixin = Fluxxor.FluxMixin(React),
      StoreWatchMixin = Fluxxor.StoreWatchMixin("DataStore");
      
export const DataSelector = React.createClass({
  mixins: [FluxMixin, StoreWatchMixin],
  
  getStateFromFlux: function() {
    return this.getFlux().store("DataStore").getState();
  },
  
  render() {
      
    return (
     <div className="row dateRow">
         <div className="col-sm-12 dateFilterColumn">
             <div className="input-group dateFilter">
                <span className="input-group-addon">From Date</span>
                <input type="text" className="form-control" value={this.state.fromDate}/>
                <span className="input-group-addon"><i className="fa fa-calendar"></i></span>
            </div>
             <div className="input-group dateFilter">
                <span className="input-group-addon">To Date</span>
                <input type="text" className="form-control"  value={this.state.toDate}/>
                <span className="input-group-addon"><i className="fa fa-calendar"></i></span>
            </div>
            <div>
             <button id="save-button" type="button" className="btn btn-primary btn-sm">
                 <span className="fa fa-refresh" aria-hidden="true">
                 </span>
                 <span>&nbsp;Refresh</span>
             </button>
            </div>
            <div className="breadcrumbContainer">
                <ol className="breadcrumb"><li><a href="#">Filters</a></li>                
                    {
                        this.state && this.state.categoryType ? 
                         <li><a href="#">{this.state.categoryType}</a></li> : undefined
                    }
                    {
                        this.state && this.state.categoryValue ? 
                         <li><a href="#">{this.state.categoryValue}</a></li> : undefined
                    }
                    {
                        this.state && this.state.fromDate ? 
                         <li><a href="#">{this.state.fromDate} - {this.state.toDate}</a></li> : undefined
                    }
                </ol>
            </div>
         </div>
     </div>
     );
  }
});