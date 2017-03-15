Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const GenericComponent_1 = require("./GenericComponent");
const DataTables_1 = require("react-md/lib/DataTables");
const Cards_1 = require("react-md/lib/Cards");
const FontIcons_1 = require("react-md/lib/FontIcons");
class Table extends GenericComponent_1.GenericComponent {
    constructor() {
        super(...arguments);
        this.state = {
            values: []
        };
    }
    render() {
        var { props } = this.props;
        var { checkboxes, cols } = props;
        var { values } = this.state;
        const rows = values.map((value, i) => (<DataTables_1.TableRow key={i}>
        {cols.map((col, i) => <DataTables_1.TableColumn key={i}>{col.type === 'icon' ?
            <FontIcons_1.default>{col.value || value[col.field]}</FontIcons_1.default> :
            value[col.field]}</DataTables_1.TableColumn>)}
      </DataTables_1.TableRow>));
        return (<Cards_1.Card tablecard>
        <DataTables_1.DataTable plain={!checkboxes} data={checkboxes}>
          <DataTables_1.TableHeader>
            <DataTables_1.TableRow>
              {cols.map((col, i) => <DataTables_1.TableColumn key={i}>{col.header}</DataTables_1.TableColumn>)}
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
