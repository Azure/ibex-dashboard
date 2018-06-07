import * as React from 'react';
import MonacoEditor from 'react-monaco-editor';
import * as monacoEditor from 'monaco-editor';

export interface MonacoQueryEditorProps {
  onChange?: (value: string) => void;
}

export default class MonacoQueryEditor extends React.Component<MonacoQueryEditorProps> {
  constructor(props: MonacoQueryEditorProps) {
    super(props);
  }

  public render() {
    return (
      <div style={{ height: '300px' }}>
        <MonacoEditor
          width="100%"
          language="kusto"
          theme="vs"
          value="MaQosSummary | limit 1000 | summarize count() by bin(TIMESTAMP, 1s)"
          options={this.getMonacoEditorSettings()}
          onChange={this.props.onChange}
        />
      </div>
    );
  }

  private getMonacoEditorSettings(): monacoEditor.editor.IEditorOptions {
    var minimapOptions: monacoEditor.editor.IEditorMinimapOptions = {
      enabled: false
    };

    var scrollbarOptions: monacoEditor.editor.IEditorScrollbarOptions = {
      horizontal: 'Hidden',
      arrowSize: 30,
      useShadows: false
    };
 
    var editorOptions: monacoEditor.editor.IEditorOptions = {
      minimap: minimapOptions,
      scrollbar: scrollbarOptions,
      lineNumbers: 'off',
      lineHeight: 19,
      // fontSize: 19,
      suggestFontSize: 13,
      dragAndDrop: false,
      occurrencesHighlight: false,
      selectionHighlight: false,
      renderIndentGuides: false,
      wordWrap: 'off',
      wordWrapColumn: 0,
      renderLineHighlight: 'none',
      automaticLayout: true           // Auto resize whenever DOM is changing (e.g. zooming)
    };

    return editorOptions;
  }
}