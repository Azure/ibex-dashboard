Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const generic_1 = require("../../generic");
class GenericComponent extends React.Component {
    // static propTypes = {}
    // static defaultProps = {}
    constructor(props) {
        super(props);
        this.onStateChange = this.onStateChange.bind(this);
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
            result.dataSources[key].store.listen(this.onStateChange);
        });
    }
    componentWillUnmount() {
        var result = generic_1.PipeComponent.extrapolateDependencies(this.props.dependencies);
        Object.keys(result.dataSources).forEach(key => {
            result.dataSources[key].store.unlisten(this.onStateChange);
        });
    }
    onStateChange(state) {
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
        if (!action) {
            console.warn(`no action was found with name ${name}`);
            return;
        }
        var actionId = typeof action === 'string' ? action : action.action;
        var params = typeof action === 'string' ? {} : action.params;
        generic_1.PipeComponent.triggerAction(actionId, params, args);
    }
}
exports.GenericComponent = GenericComponent;
