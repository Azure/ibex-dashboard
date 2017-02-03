var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var generic_1 = require("../../generic");
var GenericComponent = (function (_super) {
    __extends(GenericComponent, _super);
    // static propTypes = {}
    // static defaultProps = {}
    function GenericComponent(props) {
        var _this = _super.call(this, props) || this;
        _this.onChange = _this.onChange.bind(_this);
        _this.trigger = _this.trigger.bind(_this);
        var result = generic_1.PipeComponent.extrapolateDependencies(_this.props.dependencies);
        var initialState = {};
        Object.keys(result.dependencies).forEach(function (key) {
            initialState[key] = result.dependencies[key];
        });
        _this.state = initialState;
        return _this;
    }
    GenericComponent.prototype.componentDidMount = function () {
        var _this = this;
        var result = generic_1.PipeComponent.extrapolateDependencies(this.props.dependencies);
        Object.keys(result.dataSources).forEach(function (key) {
            result.dataSources[key].store.listen(_this.onChange);
        });
    };
    GenericComponent.prototype.componentWillUnmount = function () {
        var _this = this;
        var result = generic_1.PipeComponent.extrapolateDependencies(this.props.dependencies);
        Object.keys(result.dataSources).forEach(function (key) {
            result.dataSources[key].store.unlisten(_this.onChange);
        });
    };
    GenericComponent.prototype.onChange = function (state) {
        var result = generic_1.PipeComponent.extrapolateDependencies(this.props.dependencies);
        var updatedState = {};
        Object.keys(result.dependencies).forEach(function (key) {
            updatedState[key] = result.dependencies[key];
        });
        this.setState(updatedState);
    };
    GenericComponent.prototype.trigger = function (actionName, args) {
        var action = this.props.actions[actionName];
        // if action was not defined, not action needed
        if (!action)
            return;
        generic_1.PipeComponent.triggerAction(action, args);
    };
    return GenericComponent;
}(React.Component));
exports.GenericComponent = GenericComponent;
