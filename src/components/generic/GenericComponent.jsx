Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const generic_1 = require("../../generic");
class GenericComponent extends React.Component {
    // static propTypes = {}
    // static defaultProps = {}
    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
        this.trigger = this.trigger.bind(this);
        var result = generic_1.PipeComponent.extrapolateDependencies(this.props.dependencies);
        var initialState = {};
        Object.keys(result.dependencies).forEach(key => {
            initialState[key] = result.dependencies[key];
        });
        this.state = initialState;
    }
    componentDidMount() {
        var result = generic_1.PipeComponent.extrapolateDependencies(this.props.dependencies);
        Object.keys(result.dataSources).forEach(key => {
            result.dataSources[key].store.listen(this.onChange);
        });
    }
    componentWillUnmount() {
        var result = generic_1.PipeComponent.extrapolateDependencies(this.props.dependencies);
        Object.keys(result.dataSources).forEach(key => {
            result.dataSources[key].store.unlisten(this.onChange);
        });
    }
    onChange(state) {
        var result = generic_1.PipeComponent.extrapolateDependencies(this.props.dependencies);
        var updatedState = {};
        Object.keys(result.dependencies).forEach(key => {
            updatedState[key] = result.dependencies[key];
        });
        this.setState(updatedState);
    }
    trigger(actionName, args) {
        var action = this.props.actions[actionName];
        // if action was not defined, not action needed
        if (!action)
            return;
        generic_1.PipeComponent.triggerAction(action, args);
    }
}
exports.GenericComponent = GenericComponent;
