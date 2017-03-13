Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var Media_1 = require("react-md/lib/Media");
var Cards_1 = require("react-md/lib/Cards");
exports.default = function (_a) {
    var _b = _a.children, children = _b === void 0 ? null : _b, _c = _a.title, title = _c === void 0 ? '' : _c, _d = _a.subtitle, subtitle = _d === void 0 ? '' : _d;
    return <Cards_1.Card>
    <Cards_1.CardTitle title={title} subtitle={subtitle}/>
    <Media_1.Media>
      {children}
    </Media_1.Media>
  </Cards_1.Card>;
};
