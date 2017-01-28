var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var DataSourcePlugin_1 = require("./DataSourcePlugin");
var ConstantOptions = (function (_super) {
    __extends(ConstantOptions, _super);
    function ConstantOptions() {
        return _super.apply(this, arguments) || this;
    }
    return ConstantOptions;
}(DataSourcePlugin_1.DataSourceOptions));
var Constant = (function (_super) {
    __extends(Constant, _super);
    function Constant(options) {
        var _this = _super.call(this, 'Constant', options) || this;
        var props = _this._props;
        var params = options.params;
        if (!params.values || !params.values.length) {
            throw new Error('Constant requires a values list.');
        }
        props.actions.push.apply(props.actions, ['initialize']);
        return _this;
    }
    Constant.prototype.initialize = function () {
        var selectedValue = this._props.params.selectedValue;
        var obj = {};
        obj[this._props.id] = selectedValue;
        return obj;
    };
    /**
     * updateDependencies - called when dependencies are created
     */
    Constant.prototype.updateDependencies = function (dependencies) {
        return dependencies;
    };
    return Constant;
}(DataSourcePlugin_1.DataSourcePlugin));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Constant;
