import 'react-table/react-table.css'
import ReactDataGrid from 'react-data-grid-r15';
import React from 'react';
import Fluxxor from 'fluxxor';
// eslint-disable-next-line
import ReactDataGridPlugins from 'react-data-grid-r15/addons';
import 'react-data-grid-r15/dist/react-data-grid.css'
import {guid} from '../utils/Utils.js';

const Toolbar             = window.ReactDataGridPlugins.Toolbar;
//const AutoCompleteEditor  = window.ReactDataGridPlugins.Editors.AutoComplete;
const FluxMixin = Fluxxor.FluxMixin(React), StoreWatchMixin = Fluxxor.StoreWatchMixin("AdminStore");

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
      this.setState({rows: nextProps.rows, localAction: false});
  },
  onCellSelected(coordinates) {
        this.setState({selectedRow: coordinates.rowIdx, selectedColumn: coordinates.idx - 1});
  },
  getSize() {
      return this.state.rows.length;
  },
  getRowAt(index){
      if (index < 0 || index > this.getSize()){
        return undefined;
      }
      return this.state.rows[index];
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
      var rows = this.state.rows;

      for (var i = updatedRowData.fromRow; i <= updatedRowData.toRow; i++) {
        var rowToUpdate = rows[i];
        var updatedRow = Object.assign({}, rowToUpdate, updatedRowData.updated);
        rows[i] = updatedRow;
      }

      this.setState({rows: rows, localAction: 'changed'});
  },
  rowGetter(i){
     return this.state.rows[i];
  },
  onClearFilters(){
    this.setState({filters: {} });
  },
  removeSelectedRows(){
      const selectedRows = this.state.selectedRows.filter(row=>row.isSelected).map(row=>{
          delete row.isSelected;

          return row;
      });

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
    requiredDataCheck(row){
        let validRow = true;

        this.props.columns.forEach(column => {
            if(validRow && column.required && row[column.key] === ""){
                alert(`required column [${column.key}] is missing values.`);

                validRow = false;
            }
        });

        return validRow;
    },
    handleSave(){
        let keySet = new Set();
        let invalidData = false;

        this.state.rows.forEach(row => {
            let key = row[this.props.uniqueKey].toLowerCase();
            if(keySet.has(key)){
                invalidData = true;
                alert(`Duplicate unique key error for item [${key}]`);
            }else if(!this.requiredDataCheck(row)){
                invalidData = true;
            }else{
                keySet.add(key);
            }
        });

        if(!invalidData){
            this.props.handleSave(this.state.rows, this.state.columns);
        }
    },
    onRowSelect(rows) {
        this.setState({selectedRows: rows});
    },
    handleFilterChange(filter){
        let newFilters = Object.assign({}, this.state.filters);
        let rows = this.state.rows;

        if (filter.filterTerm) {
            rows = rows.filter(row=>row[filter.column.key].indexOf(filter.filterTerm) > -1);
            newFilters[filter.column.key] = filter;
        } else {
            delete newFilters[filter.column.key];
        }
        this.setState({filters: newFilters, rows: rows});
    },
    render() {
        let rowText = this.state.selectedRows.length === 1 ? 'row' : 'rows';

        return (
          <div>
            {
                this.state.action || this.state.localAction ? 
                       <button style={styles.actionButton} onClick={this.handleSave} type="button" className={this.state.action !== 'saved' ? `btn btn-primary btn-sm` : `btn btn-success btn-sm`}>
                             <i className="fa fa-cloud-upload" aria-hidden="true"></i> {this.state.localAction === 'changed' ? "Upload Changes" : "Saved Changes"}
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
                  ref="grid"
                  onGridSort={this.handleGridSort}
                  enableCellSelect={true}
                  onCellCopyPaste={null}
                  onCellSelected={this.onCellSelected}
                  rowGetter={this.rowGetter}
                  onAddFilter={this.handleFilterChange}
                  onGridRowsUpdated={this.handleGridRowsUpdated}
                  toolbar={<Toolbar enableFilter={true} 
                  onAddRow={this.handleAddRow}/>}
                  rowsCount={this.getSize()}
                  enableRowSelect='multi'
                  onRowSelect={this.onRowSelect}
                  {...this.props} />
         </div>
        );
    }
});