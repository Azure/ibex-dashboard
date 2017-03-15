import * as React from 'react';
import { GenericComponent, IGenericProps, IGenericState } from './GenericComponent';
import * as _ from 'lodash';

import { DataTable, TableHeader, TableBody, TableRow, TableColumn } from 'react-md/lib/DataTables';
import { Card, CardText, TableCardHeader } from 'react-md/lib/Cards';
import FontIcon from 'react-md/lib/FontIcons';

export interface ITableProps extends IGenericProps {
  props: {
    checkboxes: boolean,
    cols: {
      header?: string,
      field?: string,
      value?: string,
      type?: 'text' | 'icon',
      click?: string
    }[]
  }
}

export interface ITableState extends IGenericState {
  values: Object[]
}

export default class Table extends GenericComponent<ITableProps, ITableState> {

  state = {
    values: []
  }

  render () {

    var { props } = this.props;
    var { checkboxes, cols } = props;
    var { values } = this.state;

    const rows = values.map((value, i) => (
      <TableRow key={i}>
        {
          cols.map((col, i) => <TableColumn key={i}>{
            col.type === 'icon' ?
              <FontIcon>{col.value || value[col.field]}</FontIcon> :
              value[col.field]
          }</TableColumn>)
        }
      </TableRow>
    ));

    return (
      <Card tablecard>
        <DataTable plain={!checkboxes} data={checkboxes}>
          <TableHeader>
            <TableRow>
              {
                cols.map((col, i) => <TableColumn key={i}>{col.header}</TableColumn>)
              }
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows}
          </TableBody>
        </DataTable>
      </Card>
    );
  }
}