Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const $ = require("jquery");
const _ = require("lodash");
const CircularProgress_1 = require("react-md/lib/Progress/CircularProgress");
const Snackbars_1 = require("react-md/lib/Snackbars");
const SpinnerStore_1 = require("./SpinnerStore");
const SpinnerActions_1 = require("./SpinnerActions");
class Spinner extends React.Component {
    constructor(props) {
        super(props);
        this.state = SpinnerStore_1.default.getState();
        this.state.snacks = {
            toasts: [],
            autohide: true
        };
        this.onChange = this.onChange.bind(this);
        this._addToast = this._addToast.bind(this);
        this._removeToast = this._removeToast.bind(this);
        this._429ApplicationInsights = this._429ApplicationInsights.bind(this);
        var self = this;
        $.ajaxSetup({
            beforeSend: function () {
                SpinnerActions_1.default.startRequestLoading();
            },
            complete: function (response) {
                SpinnerActions_1.default.endRequestLoading();
                if (response.status === 429) {
                    self._429ApplicationInsights();
                }
            }
        });
        // Todo: Add timeout to requests - if no reply received, turn spinner off
    }
    componentDidMount() {
        SpinnerStore_1.default.listen(this.onChange);
    }
    componentWillUpdate(nextProps, nextState) {
        const { snacks } = nextState;
        const [toast] = snacks.toasts;
        if (this.state.snacks.toasts === snacks.toasts || !toast) {
            return;
        }
        snacks.autohide = toast.action !== 'Retry';
        this.setState({ snacks });
    }
    _removeToast() {
        const { snacks } = this.state;
        const [, ...toasts] = snacks.toasts;
        snacks.toasts = toasts;
        this.setState({ snacks });
    }
    _429ApplicationInsights() {
        this._addToast('You have reached the maximum number of Application Insights requests.');
    }
    _addToast(text, action = null) {
        const { snacks } = this.state;
        const toasts = snacks.toasts.slice();
        if (_.find(toasts, { text })) {
            return;
        }
        toasts.push({ text, action });
        snacks.toasts = toasts;
        this.setState({ snacks });
    }
    onChange(state) {
        this.setState(state);
    }
    render() {
        let refreshing = this.state.pageLoading || this.state.requestLoading || false;
        return (<div>
        {refreshing && <CircularProgress_1.default key="progress" id="contentLoadingProgress"/>}
        <Snackbars_1.default {...this.state.snacks} onDismiss={this._removeToast}/>
      </div>);
    }
}
exports.default = Spinner;
