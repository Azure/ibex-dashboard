import * as React from 'react';
import * as _ from 'lodash';

import Toolbar from 'react-md/lib/Toolbars';
import Button from 'react-md/lib/Buttons';
import Dialog from 'react-md/lib/Dialogs';
import { Spinner } from '../Spinner';

import * as ReactGridLayout from 'react-grid-layout';
var ResponsiveReactGridLayout = ReactGridLayout.Responsive;
var WidthProvider = ReactGridLayout.WidthProvider;
ResponsiveReactGridLayout = WidthProvider(ResponsiveReactGridLayout);

import ElementConnector from '../ElementConnector';
import { loadDialogsFromDashboard } from '../generic/Dialogs';

import ConfigurationsActions from '../../actions/ConfigurationsActions';
import ConfigurationsStore from '../../stores/ConfigurationsStore';
import VisibilityStore from '../../stores/VisibilityStore';

import { DataSourceConnector } from '../../data-sources/DataSourceConnector';
import List from 'react-md/lib/Lists/List';
import ListItem from 'react-md/lib/Lists/ListItem';
import ListItemControl from 'react-md/lib/Lists/ListItemControl';
import Switch from 'react-md/lib/SelectionControls/Switch';

interface IDashboardState {
  editMode?: boolean;
  askDelete?: boolean;
  askDownload?: boolean;
  download?: any;
  mounted?: boolean;
  currentBreakpoint?: string;
  layouts?: ILayouts;
  grid?: any;
  visibilityFlags?: IDict<boolean>;
}

interface IDashboardProps {
  dashboard?: IDashboardConfig;
}

interface IDownloadValue {
  title: string;
  data: any;
  checked: boolean;
}

export default class Dashboard extends React.Component<IDashboardProps, IDashboardState> {

  layouts = {};

  state = {
    editMode: false,
    askDelete: false,
    askDownload: false,
    download: {},
    currentBreakpoint: 'lg',
    mounted: false,
    layouts: {},
    grid: null,
    visibilityFlags: {}
  };

  constructor(props: IDashboardProps) {
    super(props);

    this.onBreakpointChange = this.onBreakpointChange.bind(this);
    this.onLayoutChange = this.onLayoutChange.bind(this);
    this.onEditDashboard = this.onEditDashboard.bind(this);
    this.toggleEditMode = this.toggleEditMode.bind(this);
    this.onDeleteDashboard = this.onDeleteDashboard.bind(this);
    this.onDeleteDashboardApprove = this.onDeleteDashboardApprove.bind(this);
    this.onDeleteDashboardCancel = this.onDeleteDashboardCancel.bind(this);
    this.onDownload = this.onDownload.bind(this);
    this.onDownloadData = this.onDownloadData.bind(this);
    this.onDownloadCancel = this.onDownloadCancel.bind(this);
    this.onChangeDownloadOption = this.onChangeDownloadOption.bind(this);

    VisibilityStore.listen(state => {
      this.setState({ visibilityFlags: state.flags });
    })
  }

  componentDidMount() {
    let { dashboard } = this.props;
    let { mounted } = this.state;

    if (dashboard && !mounted) {

      const layout = dashboard.config.layout;

      // For each column, create a layout according to number of columns
      let layouts = ElementConnector.loadLayoutFromDashboard(dashboard, dashboard);
      layouts = _.extend(layouts, dashboard.config.layout.layouts || {});

      this.layouts = layouts;
      this.setState({
        mounted: true,
        layouts: { lg: layouts['lg'] },
        grid: {
          className: 'layout',
          rowHeight: layout.rowHeight || 30,
          cols: layout.cols,
          breakpoints: layout.breakpoints,
          verticalCompact: false
        }
      });
    }
  }

  componentDidUpdate() {
    this.componentDidMount();
  }

  onBreakpointChange(breakpoint) {
    var layouts = this.state.layouts;
    layouts[breakpoint] = layouts[breakpoint] || this.layouts[breakpoint];
    this.setState({
      currentBreakpoint: breakpoint,
      layouts: layouts
    });
  }

  onLayoutChange(layout, layouts) {

    // Waiting for breakpoint to change
    let currentBreakpoint = this.state.currentBreakpoint;
    setTimeout(() => {

      if (currentBreakpoint !== this.state.currentBreakpoint) { return; }

      var breakpoint = this.state.currentBreakpoint;
      var newLayouts = this.state.layouts;
      newLayouts[breakpoint] = layout;
      this.setState({
        layouts: newLayouts
      });

      // Saving layout to API
      let { dashboard } = this.props;
      dashboard.config.layout.layouts = dashboard.config.layout.layouts || {};
      dashboard.config.layout.layouts[breakpoint] = layout;

      if (this.state.editMode) {
        ConfigurationsActions.saveConfiguration(dashboard);
      }
    }, 500);

  }

  onEditDashboard() {
    window.location.replace('/dashboard/config');
  }

  toggleEditMode() {
    this.setState({ editMode: !this.state.editMode });
  }

  onDeleteDashboard() {
    this.setState({ askDelete: true });
  }

  onDeleteDashboardApprove() {
    this.setState({ askDelete: false });
  }

  onDeleteDashboardCancel() {
    this.setState({ askDelete: false });
  }

  downloadBlob(data: string, mimeType: string, filename: string) {
    const blob = new Blob([data], {
      type: mimeType
    });
    var el = document.createElement('a');
    el.setAttribute('href', window.URL.createObjectURL(blob));
    el.setAttribute('download', filename);
    el.style.display = 'none';
    document.body.appendChild(el);
    el.click();
    document.body.removeChild(el);
  }

  exportDataSources() {
    const sources = DataSourceConnector.getDataSources();
    let states = {};
    Object.keys(sources).forEach(key => {
      let state = sources[key].store.state;
      if (_.isEmpty(state)) {
        return;
      }
      let isEmpty = Object.keys(state).every(prop => {
        if (state[prop] === null || state[prop] === undefined) {
          return true;
        }
        return false;
      });
      if (isEmpty) {
        return;
      }
      states[key] = {
        title: key,
        data: state,
        checked: true,
      };
    });
    return states;
  }

  onDownload() {
    const data = this.exportDataSources();
    this.setState({ askDownload: true, download: data });
  }

  onDownloadData(event: any) {
    const { download } = this.state;
    let payload = {};
    Object.keys(download).forEach(key => {
      let item = download[key];
      if (item.checked) {
        payload[key] = item;
      }
    });
    this.downloadBlob(JSON.stringify(payload), 'application/json', 'data.json');
  }

  onDownloadCancel() {
    this.setState({ askDownload: false });
  }

  onChangeDownloadOption(item: IDownloadValue, checked: boolean) {
    let newDownload = { ...this.state.download };
    newDownload[item.title].checked = checked;
    this.setState({ download: newDownload });
  }

  render() {

    let { dashboard } = this.props;
    var { currentBreakpoint, grid, editMode, askDelete, askDownload, download } = this.state;
    var layout = this.state.layouts[currentBreakpoint];

    if (!grid) {
      return null;
    }

    // Creating visual elements
    var elements = ElementConnector.loadElementsFromDashboard(dashboard, layout);

    // Creating filter elements
    var { filters, /*additionalFilters*/ } = ElementConnector.loadFiltersFromDashboard(dashboard);

    // Loading dialogs
    var dialogs = loadDialogsFromDashboard(dashboard);

    // Actions to perform on an active dashboard
    let toolbarActions = [
      <Button key="edit" icon primary={editMode} tooltipLabel="Edit Dashboard" onClick={this.toggleEditMode}>edit</Button>,
      <Button key="settings" icon tooltipLabel="Connections" onClick={this.onEditDashboard}>settings_applications</Button>
    ];

    if (editMode) {
      toolbarActions.push(
        <Button key="delete" icon tooltipLabel="Delete dashboard" onClick={this.onDeleteDashboard}>delete</Button>
      );
    }

    if (download) {
      toolbarActions.unshift(
        <Button key="export" icon tooltipLabel="Export data" onClick={this.onDownload}>play_for_work</Button>
      );
    }

    let downloadItems = [];
    if (download) {
      Object.keys(download).forEach(key => {
        let item: IDownloadValue = download[key];
        downloadItems.push(
          <ListItemControl
            key={item.title}
            secondaryAction={(
              <Switch
                id={item.title}
                name={item.title}
                label={item.title}
                labelBefore
                checked={item.checked}
                onChange={this.onChangeDownloadOption.bind(this, item)}
              />
            )}
          />
        );
      });
    }

    return (
      <div style={{ width: '100%' }}>
        <Toolbar actions={toolbarActions}>
          {filters}
          <Spinner />
        </Toolbar>
        <ResponsiveReactGridLayout
          {...grid}

          isDraggable={editMode}
          isResizable={editMode}

          layouts={this.state.layouts}
          onBreakpointChange={this.onBreakpointChange}
          onLayoutChange={this.onLayoutChange}
          // WidthProvider option
          measureBeforeMount={false}
          // I like to have it animate on mount. If you don't, delete `useCSSTransforms` (it's default `true`)
          // and set `measureBeforeMount={true}`.
          useCSSTransforms={this.state.mounted}
        >
          {elements}
        </ResponsiveReactGridLayout>

        {dialogs}

        <Dialog
          id="downloadData"
          visible={askDownload}
          title="Export data"
          aria-labelledby="downloadDataDescription"
          modal
          actions={[
            { onClick: this.onDownloadData, primary: true, label: 'Download', },
            { onClick: this.onDownloadCancel, primary: false, label: 'Cancel' }
          ]}
        >
          <div className="md-grid">
            <div className="md-cell md-cell--12">
              <p id="downloadDataDescription" className="md-color--secondary-text">Select data to export&hellip;</p>
            </div>
            <List className="md-cell md-cell--12">
              {downloadItems}
            </List>
          </div>
        </Dialog>

        <Dialog
          id="speedBoost"
          visible={askDelete}
          title="Use Google's location service?"
          aria-labelledby="speedBoostDescription"
          modal
          actions={[
            { onClick: this.onDeleteDashboardApprove, primary: false, label: 'Permanently Delete', },
            { onClick: this.onDeleteDashboardCancel, primary: true, label: 'Cancel' }
          ]}
        >
          <p id="speedBoostDescription" className="md-color--secondary-text">
            Deleting this dashboard will remove all Connections/Customization you have made to it.
            Are you sure you want to permanently delete this dashboard?
          </p>
        </Dialog>
      </div>
    );
  }
}
