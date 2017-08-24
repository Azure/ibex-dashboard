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
interface BotFrameworkDataSource extends IDataSource {
  type: 'BotFramework/DirectLine',
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
  params: BotFrameworkQueryParams;
}

 /**
  * A simple query on application insights data source
  */
interface BotFrameworkQueryParams {
}

type BotFrameworkQuery = string | (() => string) | ((dependencies: any) => string);
