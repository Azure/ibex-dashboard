import _ from 'lodash';
import alt from '../alt';
import TimelineActions from '../actions/TimelineActions';
import TimespanActions from '../actions/TimespanActions';
import TimespanStore from './TimespanStore';

class TimelineStore {
  constructor() {
    this.bindListeners({
      refresh: TimelineActions.refresh,
      refreshFail: TimelineActions.refreshFail,
      dismissError: TimelineActions.dismissError,
      updateMode: TimelineActions.updateMode
    });

    this.bindListeners({
      updateExcludedChannels: [ TimespanActions.toggleChannel, TimespanActions.toggleAllChannel ]
    })

    this.state = {
      data: [],
      mode: 'messages',
      channels: [],
      excluded: [],
      _channelUsageAll: [],
      channelUsage: [],
      timespan: null,
      error: null,
      activePieIndex: 0
    };
  }

  refresh(result) {
    this.setState(result);
    this.setState({ _channelUsageAll: result.channelUsage })
  }

  updateMode(mode) {
    this.setState({ mode });
    TimelineActions.refresh(this.state.timespan);
  }

  refreshFail(error) {
    this.setState({ error })
  }

  dismissError() {
    this.setState({ error: null });
  }

  updateExcludedChannels() {
    this.waitFor(TimespanStore);

    var excluded = TimespanStore.getState().excluded;
    this.setState({ 
      excluded, 
      channelUsage: _.reject(this.state._channelUsageAll, channel => excluded.includes(channel.name))
    });
  }
}

export default alt.createStore(TimelineStore, 'TimelineStore');
