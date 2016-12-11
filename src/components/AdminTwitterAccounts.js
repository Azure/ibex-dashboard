import {DataGrid} from './DataGrid';
import React from 'react';
import Fluxxor from 'fluxxor';

const FluxMixin = Fluxxor.FluxMixin(React),
    StoreWatchMixin = Fluxxor.StoreWatchMixin("AdminStore");

const columns = [
    {editable: true, 
     required: true,
     key: "accountName", 
     name: "Twitter App Name"},
    {
        editable:true,
        sortable : true,
        filterable: false,
        resizable: true,
        required: true,
        name: "Consumer Key",
        key: "consumerKey"
    },
    {
        editable:true,
        sortable : true,
        required: true,
        filterable: false,
        resizable: true,
        name: "Consumer Secret",
        key: "consumerSecret"
    },
    {
        editable:true,
        sortable : true,
        required: true,
        filterable: false,
        resizable: true,
        name: "Token",
        key: "token"
    },
    {
        editable:true,
        sortable : true,
        required: true,
        filterable: false,
        resizable: true,
        name: "Token Secret",
        key: "tokenSecret"
    }
];

export const AdminTwitterAccounts = React.createClass({
    mixins: [FluxMixin, StoreWatchMixin],

    componentDidMount(){
        this.getFlux().actions.ADMIN.load_twitter_accts(this.props.siteKey);
    },
    getStateFromFlux() {
        return this.getFlux().store("AdminStore").getState();
    },
    handleSave(mutatedRows, columns){
        this.getFlux().actions.ADMIN.save_twitter_accts(this.props.siteKey, mutatedRows);
    },
    handleRemove(deletedRows){
        this.getFlux().actions.ADMIN.remove_twitter_accts(this.props.siteKey, deletedRows);
    },
    render(){
        return (
          this.state.twitterAccounts ? 
            <DataGrid rowHeight={40}
                      minHeight={500}
                      rowKey="accountName"
                      uniqueKey="accountName"
                      handleSave={this.handleSave}
                      handleRemove={this.handleRemove}
                      columns={columns}
                      rows={this.state.twitterAccounts} />
            : <div />
        );
    }
});