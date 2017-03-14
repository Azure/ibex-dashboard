Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const GenericComponent_1 = require("./GenericComponent");
const Media_1 = require("react-md/lib/Media");
const Cards_1 = require("react-md/lib/Cards");
const FontIcons_1 = require("react-md/lib/FontIcons");
class Scorecard extends GenericComponent_1.GenericComponent {
    render() {
        var { value, icon, className } = this.state;
        var { title } = this.props;
        return (<Cards_1.Card>
        <Media_1.Media className='md-card-scorecard'>
          <div className='md-grid md-headline'>
            {icon &&
            <div className="ms-cell md-cell--middle md-cell--2 dash-icon">
                <FontIcons_1.default className={className}>{icon}</FontIcons_1.default>
              </div>}
            <div className='md-cell'>{title}</div>
            <div className='md-cell--right dash-value'>{value}</div>
          </div>
        </Media_1.Media>
      </Cards_1.Card>);
    }
}
exports.default = Scorecard;
