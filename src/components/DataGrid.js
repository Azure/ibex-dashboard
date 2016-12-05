import 'react-table/react-table.css'
import ReactDataGrid from 'react-data-grid-r15';
import React from 'react';
import ReactDataGridPlugins from 'react-data-grid-r15/addons';
import 'react-data-grid-r15/dist/react-data-grid.css'

const Editors             = window.ReactDataGridPlugins.Editors;
const Selectors           = window.ReactDataGridPlugins.Data.Selectors;
const Toolbar             = window.ReactDataGridPlugins.Toolbar;
const Filters             = window.ReactDataGridPlugins.Filters;
const AutoCompleteEditor  = window.ReactDataGridPlugins.Editors.AutoComplete;
const DropDownEditor      = window.ReactDataGridPlugins.Editors.DropDownEditor;

export const DataGrid = React.createClass({
  getInitialState(){
        return{
            rows :[],
            filters : {},
            action: false
        }
  },
  componentDidMount(){
      document.body.addEventListener('paste', this.handlePaste);
      this.setState({rows: this.props.rows});
  },
  componentWillReceiveProps(nextProps){
      this.setState({rows: nextProps.rows});
  },
  onCellSelected(coordinates) {
        this.clickedCell = {
            row: coordinates.rowIdx,
            column: coordinates.idx - 1
            // because there is a checkbox column makes this 1 indexed, convert it to 0 indexed here
        };
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

      this.setState({rows: rows, action: 'changed'});
  },
  rowGetter(i){
     return this.state.rows[i];
  },
  onClearFilters: function(){
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
      const activeCell = this.clickedCell;
      let currentRow = activeCell.row;
      let rows = this.state.rows;

      if(pastedText && activeCell){
          const pastedRows = pastedText.split("\n");
          pastedRows.forEach(pastedRow => {
              let currentColumn = activeCell.column;
              const columnData = pastedRow.split("\t");
              let rowData = currentRow < rows.length ? rows[currentRow] : {};

              if(pastedRow !== ""){
                columnData.forEach(pastedColumn => {
                    if(currentColumn < this.props.columns.length){
                        let colData = {};
                        colData[this.props.columns[currentColumn].key] = pastedColumn;
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

          this.setState({rows});
      }
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
        return (
          <div>
            {
                !this.state.action ? 
                       <button onClick={this.props.handleSave} type="button" className={!this.state.action !== 'saved' ? `btn btn-primary btn-sm` : `btn btn-success btn-sm`}>
                             <i className="fa fa-cloud-upload" aria-hidden="true"></i> {this.state.action === 'saved' ? "Saved Changes" : "Upload Changes"}
                       </button>
                   : undefined
            }
            <ReactDataGrid
                  ref="grid"
                  enableRowSelect={true}
                  onGridSort={this.handleGridSort}
                  enableCellSelect={true}
                  onCellCopyPaste={null}
                  onCellSelected={this.onCellSelected}
                  rowGetter={this.rowGetter}
                  onAddFilter={this.handleFilterChange}
                  onGridRowsUpdated={this.handleGridRowsUpdated}
                  toolbar={<Toolbar enableFilter={true} onAddRow={this.handleAddRow}/>}
                  rowsCount={this.getSize()}
                  {...this.props} />
         </div>
        );
    }
});