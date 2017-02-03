var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var DataSourcePlugin_1 = require("./DataSourcePlugin");
var Constant = (function (_super) {
    __extends(Constant, _super);
    function Constant(options) {
        var _this = _super.call(this, 'Constant', 'selectedValue', options) || this;
        var props = _this._props;
        var params = options.params;
        props.actions.push.apply(props.actions, ['initialize', 'updateSelectedValue']);
        return _this;
    }
    Constant.prototype.initialize = function () {
        var _a = this._props.params, selectedValue = _a.selectedValue, values = _a.values;
        return { selectedValue: selectedValue, values: values };
    };
    /**
     * updateDependencies - called when dependencies are created
     */
    Constant.prototype.updateDependencies = function (dependencies) {
        return dependencies;
    };
    Constant.prototype.updateSelectedValue = function (dependencies, selectedValue) {
        return { selectedValue: selectedValue };
    };
    return Constant;
}(DataSourcePlugin_1.DataSourcePlugin));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Constant;
