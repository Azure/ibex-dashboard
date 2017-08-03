import * as React from 'react';

import Dialog from 'react-md/lib/Dialogs';
import Button from 'react-md/lib/Buttons/Button';
import Toolbar from 'react-md/lib/Toolbars';
import CircularProgress from 'react-md/lib/Progress/CircularProgress';
import SelectField from 'react-md/lib/SelectFields';

import AceEditor, { EditorProps, Annotation } from 'react-ace';
import * as brace from 'brace';
import 'brace/mode/text';
import 'brace/mode/json';
import 'brace/theme/github';

import SettingsActions from './SettingsActions';
import SettingsStore, { IExportData } from './SettingsStore';
import { Toast, ToastActions, IToast } from '../../Toast';

const editorProps: EditorProps = {
  $blockScrolling: 1
};

interface ISettingsProps {
  offsetHeight?: number;
  dashboard: IDashboardConfig;
}

interface ISettingsState {
  visible: boolean;
  title: string;
  elementId: string;
  dashboard?: IDashboardConfig;
  selectedIndex: number;
  exportData?: IExportData[];
  result?: string;
}

export default class Edit extends React.PureComponent<ISettingsProps, ISettingsState> {

  static defaultProps = {
    offsetHeight: 64 // set to height of header / toolbar
  };

  constructor(props: ISettingsProps) {
    super(props);

    this.state = SettingsStore.getState();

    this.onChange = this.onChange.bind(this);
    this.copyData = this.copyData.bind(this);
    this.copyQuery = this.copyQuery.bind(this);
  }

  componentDidMount() {
    SettingsStore.listen(this.onChange);
  }
  componentWillUnmount() {
    SettingsStore.unlisten(this.onChange);
  }

  onChange(state: ISettingsState) {
    const { visible, elementId, title, selectedIndex, exportData } = state;
    this.setState({ visible, elementId, title, selectedIndex, exportData });
  }

  openDialog = (title: string, elementId: string) => {
    SettingsActions.openDialog(title, elementId);
  }

  closeDialog = () => {
    SettingsActions.closeDialog();
  }

  copyData() {
    const { exportData, selectedIndex} = this.state;
    if (!exportData) {
      return;
    }
    const selected = exportData[selectedIndex];
    const text = selected.isJSON ? JSON.stringify(selected.data, null, 2) : selected.data.toString();
    this.copyToClipboard(text);
  }

  copyQuery() {
    const { exportData, selectedIndex} = this.state;
    if (!exportData) {
      return;
    }
    const selected = exportData[selectedIndex];
    const text = selected.query;
    this.copyToClipboard(text);
  }

  componentWillUpdate(nextProps: any, nextState: any) {
    const { visible } = this.state;
    const { dashboard } = this.props;
    if (nextState.visible === true && visible !== nextState.visible) {
      SettingsActions.getExportData(dashboard);
    }
  }

  render() {
    const { visible, title, elementId, selectedIndex, exportData } = this.state;
    const { offsetHeight, dashboard } = this.props;

    const aceHeight = 'calc(100vh - ' + (offsetHeight * 4) + 'px)';
    const titleStyle = { height: offsetHeight + 'px)' } as React.CSSProperties;

    let actions = null;
    let json = '';
    let query = '';

    let mode = 'text';

    let dataActions = null;
    let queryActions = null;

    if (exportData && exportData.length > 0) {
      const options = exportData.map(item => item.id);
      const selectedValue = options[selectedIndex];
      actions = options.length > 1 ? [
        (
          <SelectField
            id="theme"
            placeholder="Theme"
            position={SelectField.Positions.BELOW}
            defaultValue={selectedValue}
            menuItems={options}
            onChange={(newValue, index) => SettingsActions.selectIndex(index)}
            tabIndex={-1}
            toolbar
          />
        )
      ] : <Button flat disabled label={selectedValue} style={{ textTransform: 'none', fontWeight: 'normal' }} />;

      const selected: IExportData = exportData[selectedIndex];

      // data
      const data = selected.data;
      switch (typeof data) {
        case 'object':
          json = data ? JSON.stringify(data, null, 2) : 'null';
          mode = 'json';
          break;
        case 'string':
          json = data;
          break;
        case 'boolean':
          json = (data === true) ? 'true' : 'false';
          break;
        case 'undefined':
          json = 'undefined';
          break;
        case 'number':
        default:
          json = data.toString();
      }

      // query
      if (selected.query) {
        query = selected.query;
      }

      // actions
      dataActions = [
        (
          <Button icon tooltipLabel="Copy" onClick={this.copyData} tabIndex={-1}>
            content_copy
          </Button>
        ),
        (
          <Button icon tooltipLabel="Download" onClick={SettingsActions.downloadData} tabIndex={-1}>
            file_download
          </Button>
        )
      ];

      queryActions = [
        (
          <Button icon tooltipLabel="Copy" onClick={this.copyQuery} tabIndex={-1}>
            content_copy
          </Button>
        )
      ];
    }

    let id = 'Element id error';
    if ( elementId) {
      id = elementId.split('@')[0] || 'Element index error';
    }

    const content = !query ? (
      <div className="md-toolbar-relative md-grid">
        <div className="md-cell--12">
          <h3>{id}</h3>
        </div>
        <div className="md-cell--12">
          <p>Use the same id for the element and data source to unwind the query and data.</p>
        </div>
      </div>
    ) : (
      <div className="md-toolbar-relative md-grid md-grid--no-spacing">
        <div className="md-cell--6">
          <Toolbar title="Data" actions={dataActions} themed style={{ width: '100%' }} />
          <AceEditor className="md-cell--12"
            name="ace"
            mode={mode}
            theme="github"
            value={json}
            readOnly={true}
            showGutter={true}
            showPrintMargin={false}
            highlightActiveLine={true}
            tabSize={2}
            width="100%"
            height={aceHeight}
            editorProps={editorProps}
          />
        </div>
        <div className="md-cell--6">
          <Toolbar title="Query" actions={queryActions} themed style={{ width: '100%' }} />
          <AceEditor className="md-cell--12"
            name="ace"
            mode="text"
            theme="github"
            value={query}
            readOnly={true}
            showGutter={true}
            showPrintMargin={false}
            highlightActiveLine={true}
            tabSize={2}
            width="100%"
            height={aceHeight}
            editorProps={editorProps}
          />
        </div>
      </div>
    );

    return (
      <Dialog
        id="editElementDialog"
        visible={visible}
        aria-label="Element settings"
        focusOnMount={false}
        onHide={this.closeDialog}
        dialogStyle={{ width: '80%' }}
        contentStyle={{ margin: '0px', padding: '0px' }}
        lastChild={true}
      >
        <Toolbar
          colored
          nav={<Button icon onClick={this.closeDialog} tabIndex={-1}>close</Button>}
          actions={actions}
          title={title}
          fixed
          style={{ width: '100%' }}
        />
        {content}
      </Dialog>
    );
  }

  private toast(text: string) {
    ToastActions.showText(text);
  }

  private copyToClipboard(text: string) {
    if (!document.queryCommandSupported('copy')) {
      this.toast('Browser not supported');
      return;
    }
    const input = document.createElement('textarea');
    input.style.position = 'fixed';
    input.style.opacity = '0';
    input.value = text;
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);
  }

}