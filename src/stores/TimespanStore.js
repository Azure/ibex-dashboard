import _ from 'lodash';
import alt from '../alt';
import TimespanActions from '../actions/TimespanActions';
import TimelineActions from '../actions/TimelineActions';
import ErrorsActions from '../actions/ErrorsActions';
import IntentActions from '../actions/IntentActions';
import UsersActions from '../actions/UsersActions';
import ConversionActions from '../actions/ConversionActions';
import SentimentActions from '../actions/SentimentActions';

class TimespanStore {
  constructor() {
    this.bindListeners({
      update24Hours: TimespanActions.update24Hours,
      update1Week: TimespanActions.update1Week,
      update1Month: TimespanActions.update1Month,
      toggleChannel: TimespanActions.toggleChannel,
      toggleAllChannel: TimespanActions.toggleAllChannel
    });

    this.bindListeners({
      updateTimeline: TimelineActions.refresh
    });

    this.state = {
      timespan: '24 hours',
      channels: [],
      excluded: []
    };
  }

  updateTimespan(timespan) {
    this.setState({ timespan });
    TimelineActions.refresh.defer(this.state.timespan);
    ErrorsActions.refresh.defer(this.state.timespan);
    IntentActions.refresh.defer(this.state.timespan);
    UsersActions.refresh.defer(this.state.timespan);
    ConversionActions.refresh.defer(this.state.timespan);
    SentimentActions.refresh.defer(this.state.timespan);
  }

  update24Hours() {
    this.updateTimespan('24 hours');
  }

  update1Week() {
    this.updateTimespan('1 week');
  }

  update1Month() {
    this.updateTimespan('1 month');
  }

  updateTimeline(result) {
    var { channels } = result;
    this.setState({ channels });
  }

  toggleChannel(channel) {

    if (!this.state.excluded.includes(channel)) {
      this.state.excluded.push(channel);
      this.setState({ excluded: this.state.excluded });
    } else {
      this.setState({ excluded: _.without(this.state.excluded, channel) });
    }
  }

  toggleAllChannel(on) {
    if (on) {
      this.setState({ excluded: [] });
    } else {
      this.setState({ excluded: this.state.channels });
    }
  }
}

export default alt.createStore(TimespanStore, 'TimespanStore');
