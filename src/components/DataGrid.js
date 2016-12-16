import 'react-table/react-table.css'
import ReactDataGrid from 'react-data-grid-r15';
import React from 'react';
import Fluxxor from 'fluxxor';
// eslint-disable-next-line
import ReactDataGridPlugins from 'react-data-grid-r15/addons';
import 'react-data-grid-r15/dist/react-data-grid.css'
import {guid} from '../utils/Utils.js';

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
        const rowKeyColumn = this.props.rowKey;
        const modifiedRows = this.props.modifiedRows;

        return modifiedRows.has(this.props.row[rowKeyColumn]) ? 'green' : '#000'
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
            selectedIndexes: [],
            selectedRows: []
        }
  },
  getStateFromFlux() {
        return this.getFlux().store("AdminStore").getState();
  },
  componentDidMount(){
      document.body.addEventListener('paste', this.handlePaste);
      this.setState({rows: this.props.rows});
  },
  componentWillReceiveProps(nextProps){
      this.setState({rows: nextProps.rows, localAction: nextProps.localAction || false});
  },
  onCellSelected(coordinates) {
        this.setState({selectedRow: coordinates.rowIdx, selectedColumn: coordinates.idx - 1});
  },
  getSize() {
      return Selectors.getRows(this.state).length
  },
  handleAddRow(e){
      let newRow = {}, rows = this.state.rows;

      this.props.columns.forEach(column=>{
          newRow[column.key] = "";
      });

      rows.push(newRow);
      this.setState({rows});
  },
  handleGridRowsUpdated(updatedRowData) {
      let rows = this.state.rows;
      let editedRowKeys = this.state.modifiedRows;
      for (var i = updatedRowData.fromRow; i <= updatedRowData.toRow; i++) {
        var rowToUpdate = rows[i];
        editedRowKeys.add(rowToUpdate[this.props.rowKey]);
        var updatedRow = Object.assign({}, rowToUpdate, updatedRowData.updated);
        rows[i] = updatedRow;
      }

      this.setState({rows: rows, localAction: 'changed'});
  },
  rowGetter(rowIdx){
     return Selectors.getRows(this.state)[rowIdx];
  },
  onClearFilters(){
    this.setState({filters: {} });
  },
  removeSelectedRows(){
      const selectedRows = this.state.selectedRows.filter(row=>row.isSelected).map(row=>{
          delete row.isSelected;

          return row;
      });

      this.setState({filters: {}});
      this.props.handleRemove(selectedRows);
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
      let rows = this.state.rows, localAction = 'changed';
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

              currentRow++;
          });

          this.setState({rows, localAction});
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
            }else if(validRow && column.compositeKey){
                let valueSet = uniqueDataMap.get(column.key);

                if(!valueSet){
                    valueSet = new Set();
                }

                if(valueSet.has(row[column.key])){
                    alert(`Duplicate unique key error for column [${column.name}] item [${row[column.key]}] rowId: [${row[this.props.rowKey]}].`);

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

        this.state.rows.forEach(row => {
            if(!this.validDataRow(row, uniqueDataMap)){
                invalidData = true;
            }
        });

        this.setState({localAction: "saving", filters: {}});

        if(!invalidData){
            this.props.handleSave(this.state.rows, this.state.columns);
        }
    },
    onRowSelect(rows) {
        this.setState({selectedRows: rows});
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
        let rowText = this.state.selectedRows.length === 1 ? 'row' : 'rows';

        return (
          <div>
            {
                this.state.action || this.state.localAction ? 
                       <button style={styles.actionButton} 
                                onClick={this.handleSave} 
                                type="button" 
                                className={this.state.action !== 'saved' || this.state.localAction === 'changed' ? `btn btn-primary btn-sm` : `btn btn-success btn-sm`}
                                disabled={this.state.localAction === "saving"}>
                             <i className="fa fa-cloud-upload" aria-hidden="true"></i> {this.state.localAction === 'changed' ? "Upload Changes" : this.state.localAction === 'saving' ? "Saving..." : "Saved Changes"}
                       </button>
                   : undefined
            }
            {
                this.state.selectedRows.length > 0 && this.state.localAction !== "changed" ? 
                       <button style={styles.actionButton} onClick={this.removeSelectedRows} type="button" className="btn btn-danger btn-sm">
                             <i className="fa fa-remove" aria-hidden="true"></i> Remove Selection(s)
                       </button>
                   : undefined
            }
            <span style={styles.rowSelectionLabel}>{this.state.selectedRows.length} {rowText} selected</span>
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
                  onAddRow={this.handleAddRow}/>}
                  getValidFilterValues={this.getValidFilterValues}
                  rowsCount={this.getSize()}
                  onClearFilters={this.onClearFilters}
                  enableRowSelect='multi'
                  onRowSelect={this.onRowSelect}
                  {...this.props} />
         </div>
        );
    }
});