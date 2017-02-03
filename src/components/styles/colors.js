var colors = require("material-ui/styles/colors");
var ThemeColors = [
    colors.pink800,
    colors.purple800,
    colors.cyan800,
    colors.red800,
    colors.blue800,
    colors.lightBlue800,
    colors.deepPurple800,
    colors.lime800,
    colors.teal800
];
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    ThemeColors: ThemeColors,
    DangerColor: colors.red500,
    PersonColor: colors.teal700,
    IntentsColor: colors.tealA700,
    GoodColor: colors.lightBlue700,
    BadColor: colors.red700,
    PositiveColor: colors.lightBlue700,
    NeutralColor: colors.grey500,
    getColor: function (idx) {
        return ThemeColors[idx];
    }
};
