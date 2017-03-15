Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const GenericComponent_1 = require("./GenericComponent");
const Button_1 = require("react-md/lib/Buttons/Button");
class TextFilter extends GenericComponent_1.GenericComponent {
    // static propTypes = {}
    // static defaultProps = {}
    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
    }
    onChange(newValue) {
        this.trigger('onChange', [newValue]);
    }
    render() {
        var { selectedValue, values } = this.state;
        values = values || [];
        var buttons = values.map((value, idx) => {
            return <Button_1.default flat key={idx} label={value} primary={value === selectedValue} onClick={this.onChange.bind(null, value)}/>;
        });
        return (<div>
        {buttons}
      </div>);
    }
}
exports.default = TextFilter;
