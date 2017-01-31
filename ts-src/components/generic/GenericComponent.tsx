import * as React from 'react';
import { PipeComponent, IDataSourceDictionary } from '../../generic';

interface IGenericProps {
  dependencies: { [key: string] : string };
  actions: { [key: string] : string };
}

interface IGenericState { [key: string] : any }

export abstract class GenericComponent<T1 extends IGenericProps> extends React.Component<T1, IGenericState> {
  // static propTypes = {}
  // static defaultProps = {}

  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);
    this.trigger = this.trigger.bind(this);

    var result = PipeComponent.extrapolateDependencies(this.props.dependencies);
    var initialState: IGenericState = {};
    Object.keys(result.dependencies).forEach(key => {
      initialState[key] = result.dependencies[key];
    });

    this.state = initialState;
  }

  componentDidMount() {
    var result = PipeComponent.extrapolateDependencies(this.props.dependencies);
    Object.keys(result.dataSources).forEach(key => {
      result.dataSources[key].store.listen(this.onChange);
    });
  }

  componentWillUnmount() {
    var result = PipeComponent.extrapolateDependencies(this.props.dependencies);
    Object.keys(result.dataSources).forEach(key => {
      result.dataSources[key].store.unlisten(this.onChange);
    });
  }

  private onChange(state) {

    var result = PipeComponent.extrapolateDependencies(this.props.dependencies);
    var updatedState: IGenericState = {};
    Object.keys(result.dependencies).forEach(key => {
      updatedState[key] = result.dependencies[key];
    });

    this.setState(updatedState);
  }

  protected trigger(actionName: string, args: any[]) {
    var action = this.props.actions[actionName];

    // if action was not defined, not action needed
    if (!action) return;

    PipeComponent.triggerAction(action, args);
  }

  abstract render();
}