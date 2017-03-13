var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var GenericComponent_1 = require("./GenericComponent");
var Button_1 = require("react-md/lib/Buttons/Button");
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
            return <Button_1.default flat key={idx} label={value} primary={value === selectedValue} onClick={_this.changeSelected.bind(null, value)}/>;
        });
        return (<div>
        {buttons}
      </div>);
    };
    return TextFilter;
}(GenericComponent_1.GenericComponent));
exports.default = TextFilter;
