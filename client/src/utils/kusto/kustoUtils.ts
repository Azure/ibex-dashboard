/**
 * Convert the given Kusto query result to a list of JSON object per table
 * @param results The Kusto response
 */
export function convertKustoResultsToJsonObjects(results: KustoQueryResults): {}[][] {
  if (!results || !results.Tables || !results.Tables.length) {
    return [];
  }

  return results.Tables.map((table, idx) => mapTable(table));
}

/**
 * Map the Kusto results array into JSON objects
 * @param table Results table to be mapped into JSON object
 */
function mapTable(table: KustoTable): Array<{}> {
  return table.Rows.map((rowValues, rowIdx) => {
    let row = {};

    table.Columns.forEach((col, idx) => {
      row[col.ColumnName] = rowValues[idx];
    });

    return row;
  });
}