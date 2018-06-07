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

/**
 * ====================================
 * Template definitions
 * ====================================
 */

/**
 * Kusto data source definition
 */
interface KustoDataSource extends IDataSource {
  type: 'Kusto/Query',
  dependencies: {
    /**
     * Required - to use in all queries to app insights as a basic timespan parameter
     */
    queryTimespan: string,
    /**
     * Optional - from which 'queryTimespan' is derived
     */
    timespan?: string,
    /**
     * Used for queries that require granularity (like timeline)
     */
    granularity?: string
  },
  params: KustoQueryParams;
}

 /**
  * A simple query on application insights data source
  */
interface KustoQueryParams {
  query: AIQuery,
}