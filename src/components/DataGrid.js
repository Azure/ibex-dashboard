import 'react-table/react-table.css'
import ReactDataGrid from 'react-data-grid-r15';
import React from 'react';
import Fluxxor from 'fluxxor';
import moment from 'moment';
// eslint-disable-next-line
import ReactDataGridPlugins from 'react-data-grid-r15/addons';
import 'react-data-grid-r15/dist/react-data-grid.css'
import {guid} from '../utils/Utils.js';

const STATE_ACTIONS = {
    SAVED: "saved",
    SAVING: "saving",
    MODIFIED: "changed"
};

const Toolbar             = window.ReactDataGridPlugins.Toolbar;
const Selectors           = window.ReactDataGridPlugins.Data.Selectors;
//const AutoCompleteEditor  = window.ReactDataGridPlugins.Editors.AutoComplete;
const FluxMixin = Fluxxor.FluxMixin(React), StoreWatchMixin = Fluxxor.StoreWatchMixin("AdminStore");
const RowRenderer = React.createClass({
    getRowStyle: function() {
        return {
            color: this.getRowBackground()
        }
    },
    getRowBackground: function() {
        const modifiedRows = this.props.modifiedRows;

        return modifiedRows.has(this.props.row[this.props.rowKey]) ? 'green' : '#000'
    },
    render: function() {
        return (<div style={this.getRowStyle()}><ReactDataGrid.Row ref="row" {...this.props}/></div>)
    }
});

const styles = {
    rowSelectionLabel: {
        marginLeft: '8px',
        marginRight: '8px'
    },
    actionButton: {
        marginLeft: '5px'
    }
}
export const DataGrid = React.createClass({
  mixins: [FluxMixin, StoreWatchMixin],
  getInitialState(){
        return{
            rows :[],
            filters : {},
            localAction: false,
            modifiedRows: new Set(),
            selectedRowKeys: []
        }
  },
  getStateFromFlux() {
        return this.getFlux().store("AdminStore").getState();
  },
  componentDidMount(){
      const rows = this.props.rows;
      document.body.addEventListener('paste', this.handlePaste);
      this.setState({rows: rows, selectedRowKeys: []});
  },
  componentWillReceiveProps(nextProps){
      let selectedRowKeys = this.state.selectedRowKeys;
      let modifiedRows = this.state.modifiedRows;
      let localAction = this.state.localAction;
      const rowsToRemove = nextProps.rowsToRemove;
      const rowsToMerge = nextProps.rowsToMerge;
      let state = this.getFlux().store("AdminStore").getState();
      let rows = this.state.rows.length === 0 ? nextProps.rows : this.state.rows;
      
      if(state.action === STATE_ACTIONS.SAVED && this.state.localAction === STATE_ACTIONS.SAVING){
          localAction = STATE_ACTIONS.SAVED;
          rows = nextProps.rows;
          selectedRowKeys = [];
          modifiedRows = new Set();
      }else{
          if(nextProps.selectedRowKeys){
             //merge the requested row keys as selected
            selectedRowKeys = selectedRowKeys.concat(nextProps.selectedRowKeys);
          }

           if(nextProps.localAction === STATE_ACTIONS.MODIFIED){
               localAction = STATE_ACTIONS.MODIFIED;
           }

           if(rowsToRemove && rowsToRemove.length > 0){
                rowsToRemove.forEach(rowKey=>{
                    let rowIndex = this.lookupRowIdByKey(rowKey);
                    rows.splice(rowIndex, 1);
                    modifiedRows.delete(rowKey);
                });

                localAction = STATE_ACTIONS.MODIFIED;
           }

           if(rowsToMerge && rowsToMerge.length > 0){
                //grab a list of new row keys to add to the grid
                const existingRowKeys = rows.map(row=>row[this.props.rowKey]);
                const newRowKeys = rowsToMerge.map(row=>row[this.props.rowKey]);
                //make sure the row is not added as a dupe.
                const rowsToAdd = rowsToMerge.filter(row=>existingRowKeys.indexOf(row[this.props.rowKey]) === -1);
                //merge the new rows with the existing rows
                rows = rowsToAdd.concat(rows);
                //mark the newly added rows as modified
                modifiedRows = new Set(Array.from(modifiedRows).concat(newRowKeys));
           }
      }
      
      this.setState({rows, localAction, selectedRowKeys, modifiedRows});
  },
  lookupRowIdByKey(rowKey){
      let targetRowId = -1;
      this.state.rows.forEach((row, index)=>{
          if(row[this.props.rowKey] === rowKey){
              targetRowId = index;
          }
      });

      return targetRowId;
  },
  onCellSelected(coordinates) {
        this.setState({selectedRow: coordinates.rowIdx, selectedColumn: coordinates.idx - 1});
  },
  removeSelectedRows(){
      const selectedRows = this.state.rows.filter(row=>this.state.selectedRowKeys.indexOf(row[this.props.rowKey]) > -1)
                                         .map(row=>{
                                                    delete row.isSelected;

                                                    return row;
                                            });
      this.setState({filters: {}, localAction: STATE_ACTIONS.SAVING});
      this.props.handleRemove(selectedRows);
  },
  getSize() {
      return Selectors.getRows(this.state).length
  },
  handleAddRow(e){
      let newRow = {}, rows = this.state.rows;

      this.props.columns.forEach(column=>{
          newRow[column.key] = "";
      });

      if(this.props.guidAutofillColumn){
           newRow[this.props.guidAutofillColumn] = guid();
      }

      rows.push(newRow);
      this.setState({rows});
  },
  handleGridRowsUpdated(updatedRowData) {
      let rows = this.state.rows;
      const localAction = STATE_ACTIONS.MODIFIED;
      let modifiedRows = this.state.modifiedRows;

      updatedRowData.rowIds.forEach(rowKey=> {
          let rowId = this.lookupRowIdByKey(rowKey);
          const rowContents = rows[rowId];
          Object.keys(updatedRowData.updated).forEach(field=>{
              if(rowContents[field] !== updatedRowData.updated[field]){
                  modifiedRows.add(rowKey);
              }
          });

          const updatedRow = Object.assign({}, rowContents, updatedRowData.updated);
          rows[rowId] = updatedRow;
      });

      this.setState({modifiedRows, localAction, rows});
  },
  rowGetter(rowIdx){
     return Selectors.getRows(this.state)[rowIdx];
  },
  onClearFilters(){
    this.setState({filters: {} });
  },
  handleGridSort(sortColumn, sortDirection) {
    const rows = this.state.rows.sort((a, b) => {
        let aLower = a[sortColumn].toLowerCase();
        let bLower = b[sortColumn].toLowerCase();
        if (aLower < bLower){
            return -1;
        }else if (aLower > bLower){
            return  1;
        }else{
            return 0;
        }
    });

    this.setState(rows);
  },
  handlePaste(e){
      const pastedText = e.clipboardData.getData('text/plain');
      let currentRow = this.state.selectedRow;
      let currentColumn = this.state.selectedColumn;
      let rows = this.state.rows, localAction = STATE_ACTIONS.MODIFIED;
      let modifiedRows = this.state.modifiedRows;
      const activeColumn = currentColumn > -1 ? this.props.columns[currentColumn] : undefined;

      if(pastedText && currentColumn  > -1 && activeColumn.key !== (this.props.guidAutofillColumn || "")){
          const pastedRows = pastedText.split("\n");
          pastedRows.forEach(pastedRow => {
              const columnData = pastedRow.split("\t");
              currentColumn = this.state.selectedColumn;
              let rowData = currentRow < rows.length ? rows[currentRow] : {};
              if(this.props.guidAutofillColumn && !rowData[this.props.guidAutofillColumn]){
                  rowData[this.props.guidAutofillColumn] = guid();
              }

              if(pastedRow !== ""){
                columnData.forEach(pastedColumn => {
                    if(currentColumn < this.props.columns.length){
                        let colData = {};
                        colData[this.props.columns[currentColumn].key] = pastedColumn.replace(/[\n\r]/g, '');
                        rowData = Object.assign({}, rowData, colData);
                    }
                    currentColumn++
                });

                if(currentRow < rows.length){
                    rows[currentRow] = rowData;
                }else{
                    rows.push(rowData);
                }
              }
              
              modifiedRows.add(rowData[this.props.rowKey]);
              currentRow++;
          });

          this.setState({rows, localAction, modifiedRows});
      }else if(this.props.guidAutofillColumn && activeColumn && activeColumn.key === this.props.guidAutofillColumn){
          alert("Not allowed to paste into the RowId column.");
      }
    },
    validDataRow(row, uniqueDataMap){
        let validRow = true;

        this.props.columns.forEach(column => {
            if(validRow && column.required && row[column.key] === ""){
                alert(`required column [${column.key}] is missing values.`);

                validRow = false;
            }else if(validRow && column.expectedDateFormat && !moment(row[column.key], column.expectedDateFormat, true).isValid()){
                alert(`${row[column.key]} is not a valid date. Expecting format ${column.expectedDateFormat}. \nDegug[${JSON.stringify(row)}]`);

                validRow = false;
            }else if(validRow && column.validateWith){
                let validationResult = column.validateWith(row[column.key]);
                if(validationResult){
                    alert(validationResult);
                    validRow = false;
                }
            }
            
            if(validRow && column.compositeKey){
                let valueSet = uniqueDataMap.get(column.key);

                if(!valueSet){
                    valueSet = new Set();
                }

                if(valueSet.has(row[column.key])){
                    alert(`Duplicate unique key error for column [${column.name}] item [${row[column.key]}] rowId: [${row[this.props.rowKey]}].\nDegug[${JSON.stringify(row)}]`);

                    validRow = false;
                }else{
                    valueSet.add(row[column.key]);
                    uniqueDataMap.set(column.key, valueSet);
                }
            }
        });

        return validRow;
    },
    handleSave(){
        let uniqueDataMap = new Map();
        let invalidData = false;
        const modifiedRows = this.state.modifiedRows;

        this.state.rows.forEach(row => {
            if(!this.validDataRow(row, uniqueDataMap)){
                invalidData = true;
            }
        });

        if(!invalidData){
            //only save the grid rows that were modified to minimize unneccesary service mutations.
            this.props.handleSave(this.state.rows.filter(row=>modifiedRows.has(row[this.props.rowKey])), this.state.columns);
        }else{
            return false;
        }

        this.setState({localAction: STATE_ACTIONS.SAVING, filters: {}});
    },
    onRowsSelected(rows) {
        this.setState({selectedRowKeys: this.state.selectedRowKeys.concat(rows.map(r => r.row[this.props.rowKey]))});
    },
    onRowsDeselected(rows) {
        var rowIndexes = rows.map(r => r.row[this.props.rowKey]);
        this.setState({selectedRowKeys: this.state.selectedRowKeys.filter(i => rowIndexes.indexOf(i) === -1 )});
    },
    handleFilterChange(filter){
        let newFilters = Object.assign({}, this.state.filters);
        
        if (filter.filterTerm) {
            newFilters[filter.column.key] = filter;
        } else {
            delete newFilters[filter.column.key];
        }

        this.setState({filters: newFilters});
    },
    getValidFilterValues(columnId) {
        let values = this.state.rows.map(r => r[columnId]);
        return values.filter((item, i, a) => { return i === a.indexOf(item); });
    },
    render() {
        let rowText = this.state.selectedRowKeys.length === 1 ? 'row' : 'rows';
        let toolBarProps = {};
        
        if(!this.props.rowAddDisabled){
            toolBarProps.onAddRow = this.handleAddRow;
        }

        return (
          <div>
            {
                this.state.localAction && this.state.rows.length > 0 ? 
                       <button style={styles.actionButton} 
                                onClick={this.handleSave} 
                                type="button" 
                                className={this.state.localAction === STATE_ACTIONS.MODIFIED || this.state.localAction === STATE_ACTIONS.SAVING ? `btn btn-primary btn-sm` : `btn btn-success btn-sm`}
                                disabled={this.state.localAction === STATE_ACTIONS.SAVING}>
                             <i className="fa fa-cloud-upload" aria-hidden="true"></i> {this.state.localAction === STATE_ACTIONS.MODIFIED ? "Upload Changes" : this.state.localAction === STATE_ACTIONS.SAVING ? "Saving..." : "Saved Changes"}
                       </button>
                   : undefined
            }
            {
                this.state.selectedRowKeys.length > 0 ? 
                       <button style={styles.actionButton} onClick={this.removeSelectedRows} type="button" className="btn btn-danger btn-sm">
                             <i className="fa fa-remove" aria-hidden="true"></i> Remove Selection(s)
                       </button>
                   : undefined
            }
            <span style={styles.rowSelectionLabel}>{this.state.selectedRowKeys.length} {rowText} selected</span>
            <ReactDataGrid
                  onGridSort={this.handleGridSort}
                  enableCellSelect={true}
                  onCellCopyPaste={null}
                  onCellSelected={this.onCellSelected}
                  rowGetter={this.rowGetter}
                  rowRenderer={<RowRenderer rowKey={this.props.rowKey} 
                                            modifiedRows={this.state.modifiedRows}/>}
                  onAddFilter={this.handleFilterChange}
                  onGridRowsUpdated={this.handleGridRowsUpdated}
                  toolbar={<Toolbar enableFilter={true}
                                    {...toolBarProps}/>}
                  getValidFilterValues={this.getValidFilterValues}
                  rowsCount={this.getSize()}
                  onClearFilters={this.onClearFilters}
                  rowSelection={{
                        showCheckbox: true,
                        enableShiftSelect: true,
                        onRowsSelected: this.onRowsSelected,
                        onRowsDeselected: this.onRowsDeselected,
                        selectBy: {
                            keys: {rowKey: this.props.rowKey, values:this.state.selectedRowKeys}
                        }
                 }}
                 {...this.props} />
         </div>
        );
    }
});