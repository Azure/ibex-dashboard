Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const GenericComponent_1 = require("./GenericComponent");
const SelectFields_1 = require("react-md/lib/SelectFields");
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
class TextFilter extends GenericComponent_1.GenericComponent {
    // static propTypes = {}
    // static defaultProps = {}
    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
    }
    onChange(newValue, index, event) {
        this.trigger('onChange', [newValue]);
    }
    render() {
        var { selectedValue, values } = this.state;
        values = values || [];
        // var buttons = values.map((value, idx) => {
        //   return <Button flat key={idx} label={value} primary={value === selectedValue} onClick={this.onChange.bind(null, value)} />
        // })
        return (<SelectFields_1.default id="timespan" label="Timespan" value={selectedValue} menuItems={values} position={SelectFields_1.default.Positions.BELOW} onChange={this.onChange} toolbar={false} className='md-select-field--toolbar'/>);
    }
}
exports.default = TextFilter;
