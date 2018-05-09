import * as React from 'react';
import { IConnection, ConnectionEditor, IConnectionProps } from './Connection';

/** 
 * This class is used to define the parameters for the connection
 * as well as the editor for the connection
 */
export default class KustoConnection implements IConnection {
  type = 'kusto';
  params = [ 'clusterName', 'databaseName' ];
  editor = KustoConnectionEditor;
}

/**
 * Implementation of the Kusto editor
 */
class KustoConnectionEditor extends ConnectionEditor<IConnectionProps, any> {
  public render() {
    return (
      <div>Select cluster</div>
    );
  }
}