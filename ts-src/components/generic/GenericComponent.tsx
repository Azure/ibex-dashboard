import * as React from 'react';
import { PipeComponent, IDataSourceDictionary } from '../../generic';

export interface IGenericProps {
  title: string;
  subtitle: string;
  dependencies: { [key: string] : string };
  actions: { [key: string] : IAction };
  props: { [key: string] : Object };
  layout: {
    "x": number;
    "y": number;
    "w": number;
    "h": number;
  }
}

export interface IGenericState { [key: string] : any }

export abstract class GenericComponent<T1 extends IGenericProps, T2 extends IGenericState> extends React.Component<T1, IGenericState> {
  // static propTypes = {}
  // static defaultProps = {}

  constructor(props) {
    super(props);

    this.onStateChange = this.onStateChange.bind(this);
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
      result.dataSources[key].store.listen(this.onStateChange);
    });
  }

  componentWillUnmount() {
    var result = PipeComponent.extrapolateDependencies(this.props.dependencies);
    Object.keys(result.dataSources).forEach(key => {
      result.dataSources[key].store.unlisten(this.onStateChange);
    });
  }

  private onStateChange(state) {

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
    if (!action) {
      console.warn(`no action was found with name ${name}`);
      return;
    }

    var actionId = typeof action === 'string' ? action : action.action;
    var params = typeof action === 'string' ? {} : action.params;
    PipeComponent.triggerAction(actionId, params, args);
  }

  abstract render();
}