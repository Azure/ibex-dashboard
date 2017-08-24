interface IQueryResult {
  value: string
}

/**
 * ====================================
 * Template definitions
 * ====================================
 */

/**
 * Application Insights data source definition
 */
interface CosmosDBDataSource extends IDataSource {
  type: 'CosmosDB/Query',
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
  params: CosmosDBQueryParams;
}

 /**
  * A simple query on application insights data source
  */
interface CosmosDBQueryParams {
}

type CosmosDBQuery = string | (() => string) | ((dependencies: any) => string);
