import * as React from 'react';
import './QueryRenderer.css';

export interface IQueryRendererProps {
  query: string;
  results: any;
}

export default class QueryRenderer extends React.PureComponent<IQueryRendererProps, void> {
  render() {
    return (
      <div className="QueryRenderer">
        <div className="QueryRenderer-query">{this.props.query}</div>
        <pre className="QueryRenderer-results">{this.props.results}</pre>
      </div>
    );
  }
}