import * as React from 'react';
import DataTable from 'react-md/lib/DataTables/DataTable';
import TableHeader from 'react-md/lib/DataTables/TableHeader';
import TableBody from 'react-md/lib/DataTables/TableBody';
import TableRow from 'react-md/lib/DataTables/TableRow';
import TableColumn from 'react-md/lib/DataTables/TableColumn';

export interface TableVisualProps {
  queryResponse?: KustoQueryResults;
}

export default class TableVisual extends React.Component<TableVisualProps> {
  constructor(props: TableVisualProps) {
    super(props);
  }

  public render() {
    // Map between the Kusto response to table view
    let mapResult = (response: KustoQueryResults) => {
      const result = response && 
                    response.Tables && 
                    response.Tables.length > 0 && 
                    response.Tables[0].Rows || [];
      const rows = result.map((_, i) => (
        <TableRow key={i}>
          {_.map(val => (<TableColumn>{val}</TableColumn>))}
        </TableRow>
      ));

      return rows;
    };

    // Map between 
    let mapColumns = (response: KustoQueryResults) => {
      const result = response && 
                     response.Tables && 
                     response.Tables.length > 0 && 
                     response.Tables[0].Columns || [];

      const columns = (
        <TableRow>
          {result.map((column) => (
            <TableColumn>
              {column.ColumnName}
            </TableColumn>
          ))}
        </TableRow>
      );

      return columns;
    };

    return (
      <div style={{ 
        background: 'white',
        border: '1px',
        borderStyle: 'groove'
      }}>
        <DataTable plain>
          <TableHeader>
            {mapColumns(this.props.queryResponse)}
          </TableHeader>
          <TableBody>
            {mapResult(this.props.queryResponse)}
          </TableBody>
        </DataTable>
      </div>
    );
  }
}