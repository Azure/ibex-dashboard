interface KustoQueryResults {
  Tables: KustoTable[]
}

interface KustoTable {
  TableName: string,
  Columns: {
    ColumnName: string,
    DataType: string,
    ColumnType: string
  }[],
  Rows: {}[][]
}
