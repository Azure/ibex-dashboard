import {DataGrid} from './DataGrid';
import React from 'react';
import Fluxxor from 'fluxxor';

const FluxMixin = Fluxxor.FluxMixin(React),
    StoreWatchMixin = Fluxxor.StoreWatchMixin("AdminStore");

const columns = [
    {editable: false, key: "RowKey", name: "Event ID"},
    {
        editable:true,
        sortable : true,
        filterable: true,
        resizable: true,
        name: "Event Date",
        key: "created_at"
    },
    {
        editable:true,
        sortable : true,
        filterable: true,
        resizable: true,
        name: "Location",
        key: "geo"
    },
    {
        editable:true,
        sortable : true,
        filterable: true,
        resizable: true,
        name: "Source",
        key: "source"
    },
    {
        editable:true,
        sortable : true,
        filterable: true,
        resizable: true,
        name: "Title",
        key: "title"
    },
    {
        editable:true,
        sortable : true,
        filterable: true,
        resizable: true,
        name: "Event Text",
        key: "message"
    }
];

export const CustomEventsEditor = React.createClass({
    mixins: [FluxMixin, StoreWatchMixin],

    componentDidMount(){
        //this.getFlux().actions.ADMIN.load_keywords(this.props.siteKey,this.state.settings.properties.supportedLanguages || []);
    },
    getStateFromFlux() {
        return this.getFlux().store("AdminStore").getState();
    },
    handleSave(mutatedRows, columns){
        //this.getFlux().actions.ADMIN.save_keywords(this.props.siteKey, mutatedRows);
    },
    handleRemove(deletedRows){
        //this.getFlux().actions.ADMIN.remove_keywords(this.props.siteKey, deletedRows);
    },
    render(){
        return (
         columns.length > 0 ? 
            <DataGrid rowHeight={40}
                      minHeight={500}
                      rowKey="RowKey"
                      guidAutofillColumn="RowKey"
                      handleSave={this.handleSave}
                      handleRemove={this.handleRemove}
                      columns={columns}
                      rows={[]} />
            : <div />
        );
    }
});