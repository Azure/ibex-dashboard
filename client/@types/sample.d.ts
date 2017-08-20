/**
 * A data source to hold unchanging data
 */
interface SampleDataSource extends IDataSource {
  type: 'Sample',
  params?: {
    /**
     * All values in this dictionary will be available as dependencies from this data source
     */
    samples: {
      [key: string]: any,
      /**
       * List of sample values
       */
      values?: any[],
    }
  }
}