/// <reference path="../../../src/types.d.ts"/>
import * as _ from 'lodash';

// The following line is important to keep in that format so it can be rendered into the page
export const config: IDashboardConfig = /*return*/ {
  id: 'cosmosdb_handoff',
  name: 'Cosmos DB conversations',
  icon: 'question_answer',
  url: 'cosmosdb_handoff',
  description: 'Conversations with option to hand-off to human',
  preview: '/images/bot-framework-preview.png',
  html: `<div>
    <h1>Cosmos DB conversations</h1>
    <p>Displays list of active conversations with a bot using Cosmos DB as the data source.</p> 
    <p>If there is a conversation of interest this can be selected to show the option to hand-off to human agent.</p>
    <p>
      <span>Refer to the </span>
      <span>
        <a href="https://github.com/CatalystCode/ibex-dashboard/blob/master/docs/bot-framework.md" target="_blank">
          bot-framework
        </a> docs for setup instructions.</span>
    </p>
  </div>`,
  config: {
    connections: {
      'bot-framework': {
        'directLine': '',
        'conversationsEndpoint': '',
        'webchatEndpoint': ''
      },
      'cosmos-db': {
        'host': '',
        'key': ''
      }
    },
    layout: {
      isDraggable: true,
      isResizable: true,
      rowHeight: 30,
      verticalCompact: false,
      cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 },
      breakpoints: { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }
    }
  },
  filters: [
    {
      type: 'TextFilter',
      title: 'Timespan',
      dependencies: { selectedValue: 'timespan', values: 'timespan:values' },
      actions: { onChange: 'timespan:updateSelectedValue' },
      first: true
    }
  ],
  dataSources: [
    {
      id: 'timespan',
      type: 'Constant',
      params: { values: ['24 hours', '1 week', '1 month', '3 months'], selectedValue: '1 month' },
      calculated: (state, dependencies) => {
        var queryTimespan =
          state.selectedValue === '24 hours' ? 'PT24H' :
            state.selectedValue === '1 week' ? 'P7D' :
              state.selectedValue === '1 month' ? 'P30D' :
                'P90D';
        var granularity =
          state.selectedValue === '24 hours' ? '5m' :
            state.selectedValue === '1 week' ? '1d' : '1d';

        return { queryTimespan, granularity };
      }
    },
    {
      id: 'botConversations',
      type: 'CosmosDB/Query',
      dependencies: { timespan: 'timespan', queryTimespan: 'timespan:queryTimespan' },
      params: {
        databaseId: 'admin',
        collectionId: 'conversations',
        query: () => `SELECT * FROM conversations c WHERE (c.state = 0 OR c.state = 1) ORDER BY c.state`,
        parameters: []
      },
      calculated: (result) => {
        if (!Array.isArray(result.Documents)) {
          return null;
        }
        const values = result.Documents.reduce((a, c) => {
          const lastMessageIndex = c.transcript.reverse().findIndex(x => x.from !== 'Bot');
          const value = {
            userId: c.customer.id,
            conversationId: c.customer.conversation.id,
            username: c.customer.user.name,
            timestamp: c.transcript[lastMessageIndex].timestamp,
            lastMessage: c.transcript[lastMessageIndex].text || '',
            icon: c.state === 1 ? 'perm_identity' : 'memory',
          };
          a.push(value);
          return a;
        }, []);

        return { result, 'values': values };
      }
    }
  ],
  elements: [
    {
      id: 'conversations',
      type: 'Table',
      title: 'Recent Conversations',
      subtitle: 'Monitor bot communications',
      size: { w: 12, h: 12 },
      dependencies: { values: 'botConversations:values' },
      props: {
        cols: [
          { header: 'Timestamp', field: 'timestamp', type: 'time', format: 'MMM-DD HH:mm:ss' },
          { header: 'Last Message', field: 'lastMessage' },
          { header: 'Username', field: 'username' },
          { header: 'Status', field: 'icon', type: 'icon' },
          { type: 'button', value: 'chat', click: 'openTranscriptsDialog' }
        ]
      },
      actions: {
        openTranscriptsDialog: {
          action: 'dialog:transcripts',
          params: { title: 'args:username', conversationId: 'args:conversationId', queryspan: 'timespan:queryTimespan' }
        }
      }
    }
  ],
  dialogs: [
    {
      id: 'transcripts',
      width: '60%',
      params: ['title', 'conversationId', 'queryspan'],
      dataSources: [
        {
          id: 'transcripts-data',
          type: 'CosmosDB/Query',
          dependencies: {
            conversationId: 'dialog_transcripts:conversationId',
            queryTimespan: 'dialog_transcripts:queryspan',
            secret: 'connection:bot-framework.directLine'
          },
          params: {
            databaseId: 'admin',
            collectionId: 'conversations',
            query: ({ conversationId }) => `SELECT * FROM conversations c 
              WHERE (c.customer.conversation['$id'] = '${conversationId}')`,
            parameters: []
          },
          calculated: (result, dependencies) => {
            if (!result.Documents) {
              return null;
            }

            let values = [];
            let customer = null;
            let body = {};
            let headers = {};
            let disabled = false;
            const { secret } = dependencies;

            if (result.Documents.length === 1) {
              values = result.Documents[0].transcript || [];
              customer = result.Documents[0].customer;
              disabled = result.Documents[0].state !== 0 ? true : false;
              body = {
                'conversationId': customer.conversation.id,
              };
              headers = {
                'Authorization': `Bearer ${secret}`
              };
            }
            return { 'values': values, 'customer': customer, 'headers': headers, 'body': body, 'disabled': disabled };
          }
        }
      ],
      elements: [
        {
          id: 'transcripts-button',
          type: 'RequestButton',
          title: 'Transfer to Agent',
          size: { w: 2, h: 1 },
          location: { x: 0, y: 0 },
          dependencies: {
            body: 'transcripts-data:body',
            headers: 'transcripts-data:headers',
            disabled: 'transcripts-data:disabled',
            conversationsEndpoint: 'connection:bot-framework.conversationsEndpoint'
          },
          props: {
            url: ({ conversationsEndpoint }) => `${conversationsEndpoint}`,
            method: 'POST',
            once: true,
            icon: 'person',
            buttonProps: { iconBefore: false, primary: true }
          }
        },
        {
          id: 'agent-button',
          type: 'RequestButton',
          title: 'Open Webchat',
          size: { w: 2, h: 1 },
          location: { x: 2, y: 0 },
          dependencies: { 
            token: 'connection:bot-framework.directLine', 
            webchatEndpoint: 'connection:bot-framework.webchatEndpoint',
            dependsOn: 'transcripts-data:disabled'
          },
          props: {
            url: ({ token, webchatEndpoint }) => `${webchatEndpoint}/?s=${token}`,
            link: true,
            icon: 'open_in_new',
            buttonProps: { iconBefore: false, secondary: true }
          }
        },
        {
          id: 'transcripts-list',
          type: 'Table',
          title: 'Transcripts',
          size: { w: 12, h: 11 },
          location: { x: 0, y: 1 },
          dependencies: { values: 'transcripts-data:values' },
          props: {
            rowClassNameField: 'from',
            cols: [
              { header: 'Timestamp', field: 'timestamp', type: 'time', format: 'MMM-DD HH:mm:ss', width: '50px' },
              { header: 'Text', field: 'text' }
            ]
          }
        }
      ]
    }
  ]
};