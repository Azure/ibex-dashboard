/**
 * A data source to hold unchanging data
 */
interface ConstantDataSource extends IDataSource {
  type: 'Constant',
  params: {
    /**
     * List of values to choose from
     */
    values: string[],
    /**
     * Current selected value (usually used in constant filters)
     */
    selectedValue: string
  }
}