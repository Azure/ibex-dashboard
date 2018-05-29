import { getToken } from '../../utils/authorization';

export default class KustoClient {
  public async executeQuery(cluster: string, database: string, query: string): Promise<KustoQueryResults> {
      let aadToken: string = await getToken();

      let kustoResponse = await fetch(`https://${cluster}.kusto.windows.net/v1/rest/query`, {
          method: 'POST',
          body: JSON.stringify({
            'db': database,
            'csl': query
          }),
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Authorization': `Bearer ${aadToken}`,
          }
        });

      // 1. In case request wasn't successful - throw
      if (kustoResponse.status > 300) {
        let responseContent = await kustoResponse.text();
        
        throw `Failed to query Kusto. Status code: ${kustoResponse.status},
               response: ${responseContent}`;
      }

      let kustoResponseData: KustoQueryResults = await kustoResponse.json();

      return kustoResponseData;
  }
}