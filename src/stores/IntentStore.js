import _ from 'lodash';
import alt from '../alt';
import IntentActions from '../actions/IntentActions';

class IntentStore {
  constructor() {
    this.bindListeners({
      refresh: IntentActions.refresh,
      selectIntent: IntentActions.selectIntent,
      fetchIntentConversations: IntentActions.fetchIntentConversations,
      selectConversation: IntentActions.selectConversation,
      fetchConversationMessages: IntentActions.fetchConversationMessages
    });

    this.state = {
      intents: [],
      timespan: null,
      selectedIntent: null,
      intentConversations: [],
      selectedConversation: null,
      conversationMessages: []
    };
  }

  refresh(result) {
    this.setState(result);
  }
  
  selectIntent(intent) {
    this.setState({ selectedIntent: intent });
    IntentActions.fetchIntentConversations(intent, this.state.timespan);
  }

  fetchIntentConversations(intentConversations) {
    this.setState({ intentConversations });
  }

  selectConversation(selectedConversation) {
    this.setState({ selectedConversation });
    IntentActions.fetchConversationMessages(selectedConversation, this.state.timespan);
  }

  fetchConversationMessages(conversationMessages) {
    this.setState({ conversationMessages });
  }
}

export default alt.createStore(IntentStore, 'IntentStore');
