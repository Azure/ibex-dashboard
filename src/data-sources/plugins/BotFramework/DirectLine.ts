import * as request from 'xhr-request';
import { DataSourcePlugin, IOptions } from '../DataSourcePlugin';
import { DataSourceConnector } from '../../DataSourceConnector';
import BotFrameworkConnection from '../../connections/bot-framework';

let connectionType = new BotFrameworkConnection();

interface IQueryParams {
  calculated?: (results: any) => object;
}

export default class BotFrameworkDirectLine extends DataSourcePlugin<IQueryParams> {
  type = 'BotFramework-DirectLine';
  defaultProperty = 'values';
  connectionType = connectionType.type;

  constructor(options: IOptions<IQueryParams>, connections: IDict<IStringDictionary>) {
    super(options, connections);
    this.validateTimespan(this._props);
    this.validateParams(this._props.params);
  }

  /**
   * update - called when dependencies are created
   * @param {object} dependencies
   * @param {function} callback
   */
  updateDependencies(dependencies: any) {
    let emptyDependency = false;
    Object.keys(this._props.dependencies).forEach((key) => {
      if (typeof dependencies[key] === 'undefined') { emptyDependency = true; }
    });

    // If one of the dependencies is not supplied, do not run the query
    if (emptyDependency) {
      return (dispatch) => {
        return dispatch();
      };
    }

    // Validate connection
    let connection = this.getConnection();
    let { directLine } = connection;
    if (!connection || !directLine) {
      return (dispatch) => {
        return dispatch();
      };
    }

    const url = 'https://directline.botframework.com/v3/directline/conversations';
    const auth = `Bearer ${directLine}`;

    return (dispatch) => {
      request(url, {
        method: 'POST',
        json: true,
        headers: { 'Authorization' : auth }
      },      (error, json) => {
        if (error) {
          throw new Error(error);
        }
        // export connection values required by generics
        json['conversationsEndpoint'] = connection.conversationsEndpoint;
        json['webchatEndpoint'] = connection.webchatEndpoint;
        json['directLine'] = connection.directLine;
        // returns conversationId, token, expires_in, streamUrl, referenceGrammarId
        return dispatch(json); 
      });
    };
  }

  updateSelectedValues(dependencies: IDictionary, selectedValues: any) {
    if (Array.isArray(selectedValues)) {
      return Object.assign(dependencies, { 'selectedValues': selectedValues });
    } else {
      return Object.assign(dependencies, { ... selectedValues });
    }
  }

  private validateTimespan(props: any) {
  }

  private validateParams(params: IQueryParams): void {
  }

}