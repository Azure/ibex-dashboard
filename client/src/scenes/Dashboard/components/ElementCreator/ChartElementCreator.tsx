import * as React from 'react';
import Dialog from 'react-md/lib/Dialogs';

import QueryExplorer  from '../../../QueryExplorer';
import ConfigurationStore from '../../../../stores/ConfigurationsStore';

interface ChartElementCreatorProps {
  visibility?: boolean;
  onHide?: () => void;
}

export default class ChartElementCreator extends React.Component<ChartElementCreatorProps> {
  constructor(props: ChartElementCreatorProps) {
    super(props);
  }

  public render() {
    let configurationState = ConfigurationStore.getState();
    let currentConnections = configurationState.connections;

    return (
      <div>
        <Dialog
          id="createNewChartElement"
          visible={this.props.visibility}
          onHide={this.props.onHide}
          dialogStyle={{ width: '70%', height: '90%', overflow: 'auto', top: '50% !important'}}
          contentStyle={{ top: '50% !important' }}
          title="Create new chart element"
          focusOnMount={false}
        >
          <QueryExplorer clusterName="kuskus" databaseName="kuskus" />
        </Dialog>
      </div>
    );
  }
}