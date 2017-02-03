var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var GenericComponent_1 = require("./GenericComponent");
var FlatButton_1 = require("material-ui/FlatButton");
var TextFilter = (function (_super) {
    __extends(TextFilter, _super);
    // static propTypes = {}
    // static defaultProps = {}
    function TextFilter(props) {
        var _this = _super.call(this, props) || this;
        _this.changeSelected = _this.changeSelected.bind(_this);
        return _this;
    }
    TextFilter.prototype.changeSelected = function (newValue) {
        this.trigger('changeSelected', [newValue]);
    };
    TextFilter.prototype.render = function () {
        var _this = this;
        var _a = this.state, selectedValue = _a.selectedValue, values = _a.values;
        values = values || [];
        var buttons = values.map(function (value, idx) {
            return React.createElement(FlatButton_1.default, { key: idx, label: value, primary: value === selectedValue, onClick: _this.changeSelected.bind(null, value) });
        });
        return (React.createElement("div", null, buttons));
    };
    return TextFilter;
}(GenericComponent_1.GenericComponent));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TextFilter;
