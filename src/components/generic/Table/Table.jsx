Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const GenericComponent_1 = require("../GenericComponent");
const moment = require("moment");
const DataTables_1 = require("react-md/lib/DataTables");
const Cards_1 = require("react-md/lib/Cards");
const FontIcons_1 = require("react-md/lib/FontIcons");
const Button_1 = require("react-md/lib/Buttons/Button");
require("./Table.css");
class Table extends GenericComponent_1.GenericComponent {
    constructor(props) {
        super(props);
        this.state = {
            values: []
        };
        this.onButtonClick = (col, value) => {
            this.trigger(col.onClick, value);
        };
        this.onButtonClick = this.onButtonClick.bind(this);
    }
    render() {
        var { props } = this.props;
        var { checkboxes, cols } = props;
        var { values } = this.state;
        var arr = values.slice(0);
        arr = arr.concat(values);
        arr = arr.concat(values);
        arr = arr.concat(values);
        arr = arr.concat(values);
        arr = arr.concat(values);
        const rows = arr.map((value, i) => (<DataTables_1.TableRow key={i}>
        {cols.map((col, i) => <DataTables_1.TableColumn key={i}>{col.type === 'icon' ?
            <FontIcons_1.default>{col.value || value[col.field]}</FontIcons_1.default> :
            col.type === 'button' ?
                <Button_1.default icon onClick={this.onButtonClick.bind(this, col, value)}>{col.value || value[col.field]}</Button_1.default> :
                col.type === 'time' ?
                    moment(value[col.field]).format('MMM-DD HH:mm:ss') :
                    value[col.field]}</DataTables_1.TableColumn>)}
      </DataTables_1.TableRow>));
        return (<Cards_1.Card>
        <DataTables_1.DataTable plain={!checkboxes} data={checkboxes}>
          <DataTables_1.TableHeader>
            <DataTables_1.TableRow>
              {cols.map((col, i) => <DataTables_1.TableColumn key={i} width={col.width}>{col.header}</DataTables_1.TableColumn>)}
            </DataTables_1.TableRow>
          </DataTables_1.TableHeader>
          <DataTables_1.TableBody>
            {rows}
          </DataTables_1.TableBody>
        </DataTables_1.DataTable>
      </Cards_1.Card>);
    }
}
exports.default = Table;
