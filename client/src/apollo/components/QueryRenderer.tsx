import * as React from 'react';
import './QueryRenderer.css';

export interface IQueryRendererProps {
  results: any;
}

export default class QueryRenderer extends React.PureComponent<IQueryRendererProps, void> {
  render() {
    return (
      <div className="QueryRenderer">
        <pre className="QueryRenderer-results">{this.props.results}</pre>
      </div>
    );
  }
}