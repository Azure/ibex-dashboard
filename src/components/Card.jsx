Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const Media_1 = require("react-md/lib/Media");
const Cards_1 = require("react-md/lib/Cards");
exports.default = ({ children = null, title = '', subtitle = '' }) => <Cards_1.Card>
    <Cards_1.CardTitle title={title} subtitle={subtitle}/>
    <Media_1.Media>
      {children}
    </Media_1.Media>
  </Cards_1.Card>;
