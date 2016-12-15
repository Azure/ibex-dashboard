import {DataGrid} from './DataGrid';
import React from 'react';
import Fluxxor from 'fluxxor';

const FluxMixin = Fluxxor.FluxMixin(React),
    StoreWatchMixin = Fluxxor.StoreWatchMixin("AdminStore");

export const AdminWatchlist = React.createClass({
    mixins: [FluxMixin, StoreWatchMixin],

    componentDidMount(){
        this.getFlux().actions.ADMIN.load_keywords(this.props.siteKey,this.state.settings.properties.supportedLanguages || []);
    },
    getStateFromFlux() {
        return this.getFlux().store("AdminStore").getState();
    },
    handleSave(mutatedRows, columns){
        this.getFlux().actions.ADMIN.save_keywords(this.props.siteKey, mutatedRows);
    },
    handleRemove(deletedRows){
        this.getFlux().actions.ADMIN.remove_keywords(this.props.siteKey, deletedRows);
    },
    render(){
        return (
         this.state.termGridColumns.length > 0 ? 
            <DataGrid rowHeight={40}
                      minHeight={500}
                      rowKey="RowKey"
                      guidAutofillColumn="RowKey"
                      handleSave={this.handleSave}
                      handleRemove={this.handleRemove}
                      columns={this.state.termGridColumns}
                      rows={this.state.watchlist} />
            : <div />
        );
    }
});