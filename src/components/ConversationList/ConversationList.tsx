import * as React from 'react';
import * as _ from 'lodash';
import * as moment from 'moment';

import HandoffButton from './HandoffButton';
import { GenericComponent, IGenericProps, IGenericState } from '../generic/GenericComponent';

import FontIcon from 'react-md/lib/FontIcons';
import List from 'react-md/lib/Lists/List';
import ListItem from 'react-md/lib/Lists/ListItem';
import Avatar from 'react-md/lib/Avatars';
import Divider from 'react-md/lib/Dividers';
import Subheader from 'react-md/lib/Subheaders';
import Dialog from 'react-md/lib/Dialogs';
import Card from 'react-md/lib/Cards';
import { ResponsiveContainer } from 'recharts';

interface IConversationListState extends IGenericState {
  handoff?: boolean;
  visible?: boolean;
  conversationListItemId?: number;
  values?: Object[];
}

const heyd = [
/* 1 */
{
    '_id' : ('59232c4ec6b7c81a145c4944'),
    'customer' : {
        'id' : 'nn91eh261mc1e313',
        'channelId' : 'emulator',
        'user' : {
            'id' : 'default-user',
            'name' : 'User'
        },
        'conversation' : {
            'id' : '4laka6ai77fgjfdf9'
        },
        'bot' : {
            'id' : 'default-bot',
            'name' : 'Bot'
        },
        'serviceUrl' : 'http://127.0.0.1:58932'
    },
    'state' : 0,
    'transcript' : [ 
        {
            'timestamp' : 1495477332254.0,
            'from' : 'Customer',
            'text' : 'hey world',
            '_id' : ('59232c54c6b7c81a145c4945')
        }, 
        {
            'timestamp' : 1495477335442.0,
            'from' : 'Bot',
            'text' : 'Echo hey world',
            '_id' : ('59232c57c6b7c81a145c4946')
        }, 
        {
            'timestamp' : 1495477352098.0,
            'from' : 'Customer',
            'text' : 'so now we dont have errors',
            '_id' : ('59232c68c6b7c81a145c4947')
        }, 
        {
            'timestamp' : 1495477352123.0,
            'from' : 'Bot',
            'text' : 'Echo so now we dont have errors',
            '_id' : ('59232c68c6b7c81a145c4948')
        }, 
        {
            'timestamp' : 1495477366546.0,
            'from' : 'Customer',
            'text' : 'fucking fixded it',
            '_id' : ('59232c76c6b7c81a145c4949')
        }, 
        {
            'timestamp' : 1495477366583.0,
            'from' : 'Bot',
            'text' : 'Echo fucking fixded it',
            '_id' : ('59232c76c6b7c81a145c494a')
        }
    ],
    '__v' : 0
},

/* 2 */
{
    '_id' : ('59232fd8f39d261b021d26f2'),
    'customer' : {
        'id' : '4kam8lcgab919a9i',
        'channelId' : 'emulator',
        'user' : {
            'id' : 'default-user',
            'name' : 'User'
        },
        'conversation' : {
            'id' : '0jmaf1mf5gh2l2heac'
        },
        'bot' : {
            'id' : 'default-bot',
            'name' : 'Bot'
        },
        'serviceUrl' : 'http://127.0.0.1:58932'
    },
    'state' : 0,
    'transcript' : [ 
        {
            'timestamp' : 1495478233568.0,
            'from' : 'Customer',
            'text' : 'hey',
            '_id' : ('59232fd9f39d261b021d26f3')
        }, 
        {
            'timestamp' : 1495478235061.0,
            'from' : 'Bot',
            'text' : 'Echo hey',
            '_id' : ('59232fdbf39d261b021d26f4')
        }, 
        {
            'timestamp' : 1495478408719.0,
            'from' : 'Customer',
            'text' : 'just more convo',
            '_id' : ('59233088f39d261b021d26f5')
        }, 
        {
            'timestamp' : 1495478408756.0,
            'from' : 'Bot',
            'text' : 'Echo just more convo',
            '_id' : ('59233088f39d261b021d26f6')
        }, 
        {
            'timestamp' : 1495478415138.0,
            'from' : 'Customer',
            'text' : 'i need to call someone',
            '_id' : ('5923308ff39d261b021d26f7')
        }, 
        {
            'timestamp' : 1495478415153.0,
            'from' : 'Bot',
            'text' : 'Echo i need to call someone',
            '_id' : ('5923308ff39d261b021d26f8')
        }, 
        {
            'timestamp' : 1495478419294.0,
            'from' : 'Customer',
            'text' : 'what is the date',
            '_id' : ('59233093f39d261b021d26f9')
        }, 
        {
            'timestamp' : 1495478419329.0,
            'from' : 'Bot',
            'text' : 'Echo what is the date',
            '_id' : ('59233093f39d261b021d26fa')
        }, 
        {
            'timestamp' : 1495478425640.0,
            'from' : 'Customer',
            'text' : 'when is the event happening',
            '_id' : ('59233099f39d261b021d26fb')
        }, 
        {
            'timestamp' : 1495478425674.0,
            'from' : 'Bot',
            'text' : 'Echo when is the event happening',
            '_id' : ('59233099f39d261b021d26fc')
        }, 
        {
            'timestamp' : 1495478429596.0,
            'from' : 'Customer',
            'text' : 'more convo',
            '_id' : ('5923309df39d261b021d26fd')
        }, 
        {
            'timestamp' : 1495478429628.0,
            'from' : 'Bot',
            'text' : 'Echo more convo',
            '_id' : ('5923309df39d261b021d26fe')
        }
    ],
    '__v' : 0
},

/* 3 */
{
    '_id' : ('592330a1f39d261b021d26ff'),
    'customer' : {
        'id' : '672di14a114g613a3',
        'channelId' : 'emulator',
        'user' : {
            'id' : 'default-user',
            'name' : 'User'
        },
        'conversation' : {
            'id' : '4la61cde9m070i'
        },
        'bot' : {
            'id' : 'default-bot',
            'name' : 'Bot'
        },
        'serviceUrl' : 'http://127.0.0.1:58932'
    },
    'state' : 0,
    'transcript' : [ 
        {
            'timestamp' : 1495478433334.0,
            'from' : 'Customer',
            'text' : 'hello',
            '_id' : ('592330a1f39d261b021d2700')
        }, 
        {
            'timestamp' : 1495478433350.0,
            'from' : 'Bot',
            'text' : 'Echo hello',
            '_id' : ('592330a1f39d261b021d2701')
        }, 
        {
            'timestamp' : 1495478437095.0,
            'from' : 'Customer',
            'text' : 'i am a wizard',
            '_id' : ('592330a5f39d261b021d2702')
        }, 
        {
            'timestamp' : 1495478437118.0,
            'from' : 'Bot',
            'text' : 'Echo i am a wizard',
            '_id' : ('592330a5f39d261b021d2703')
        }, 
        {
            'timestamp' : 1495478438929.0,
            'from' : 'Customer',
            'text' : 'whats up',
            '_id' : ('592330a6f39d261b021d2704')
        }, 
        {
            'timestamp' : 1495478438947.0,
            'from' : 'Bot',
            'text' : 'Echo whats up',
            '_id' : ('592330a6f39d261b021d2705')
        }
    ],
    '__v' : 0
},

/* 4 */
{
    '_id' : ('592330adf39d261b021d2706'),
    'customer' : {
        'id' : 'h2iida2ahc15nh9j3',
        'channelId' : 'emulator',
        'user' : {
            'id' : 'default-user',
            'name' : 'User'
        },
        'conversation' : {
            'id' : '18j7i29j9ab5ff3kjc'
        },
        'bot' : {
            'id' : 'default-bot',
            'name' : 'Bot'
        },
        'serviceUrl' : 'http://127.0.0.1:58932'
    },
    'state' : 0,
    'transcript' : [ 
        {
            'timestamp' : 1495478445268.0,
            'from' : 'Bot',
            'text' : 'Echo what can you do',
            '_id' : ('592330adf39d261b021d2708')
        }
    ],
    '__v' : 0
},
/* 5 */
{
    '_id' : ('59233297f39d261b021d2709'),
    'customer' : {
        'id' : 'b959h9el7gi36en5ac',
        'channelId' : 'emulator',
        'user' : {
            'id' : 'default-user',
            'name' : 'User'
        },
        'conversation' : {
            'id' : 'i00ibbc0b7eeb98dl'
        },
        'bot' : {
            'id' : '6779nm0fjhfe9fma7c',
            'name' : 'Bot'
        },
        'serviceUrl' : 'https://b997f5f5.ngrok.io'
    },
    'state' : 0,
    'transcript' : [ 
        {
            'timestamp' : 1495478935581.0,
            'from' : 'Customer',
            'text' : 'hey',
            '_id' : ('59233297f39d261b021d270a')
        }, 
        {
            'timestamp' : 1495478935999.0,
            'from' : 'Bot',
            'text' : 'Echo hey',
            '_id' : ('59233297f39d261b021d270b')
        }, 
        {
            'timestamp' : 1495478942682.0,
            'from' : 'Customer',
            'text' : 'im confused',
            '_id' : ('5923329ef39d261b021d270c')
        }, 
        {
            'timestamp' : 1495478943045.0,
            'from' : 'Bot',
            'text' : 'Echo im confused',
            '_id' : ('5923329ff39d261b021d270d')
        }
    ],
    '__v' : 0
}
];

export default class ConversationList extends GenericComponent<any, IConversationListState> {

  state: IConversationListState = {
    handoff: false,
    visible: false,
    conversationListItemId: 0,
    values: null
  };

  constructor(props: any) {
    super(props);

    this.openDialog = this.openDialog.bind(this);
    this.closeDialog = this.closeDialog.bind(this);
  }

  openDialog = (listItemId) => {
    this.setState({ visible: true, conversationListItemId: listItemId}); 
  }

  closeDialog = () => {
    this.setState({ visible: false });
  }

  render() {
    var {values} = this.state;

    if (!values) { return null; }

    // TODO: order list by timestamp
    let listItems = values.map((item, i) => (
      <ListItem
        key={i}
        rightIcon={<FontIcon>tag_faces</FontIcon>}
        primaryText={item['transcript'][item['transcript'].length - 1]['text']}
        secondaryText={moment(item['transcript'][item['transcript'].length - 1].timestamp).format('HH:mm')}
        onClick={() => this.openDialog(i)}
      />
    ));

    let transcriptItems = values[this.state.conversationListItemId]['transcript'].map((item, i) => (
      <ListItem
        key={i}
        rightIcon={item.from}
        primaryText={item['text']}
        secondaryText={moment(item.timestamp).format('HH:mm')}
      />
    ));

    return (
      <Card title="Title" subtitle="Subtitle">
        <ResponsiveContainer>
          <div className="lg-grid">
            <List >
              {listItems}
            </List>

            <Dialog
              id="simpleDialogExample"
              visible={this.state.visible}
              title=
              {
                <div>
                  <h3> 
                    Conversation with {values[this.state.conversationListItemId]['customer'].user.name} 
                    <HandoffButton convoData={values[this.state.conversationListItemId]['customer']} /> 
                  </h3>
                  <List >
                    {transcriptItems}
                  </List>
                </div>
              }
              onHide={this.closeDialog}
              dialogStyle={{ width: '50%' }}
              contentStyle={{ marginTop: '20px' }}
            />

          </div>
        </ResponsiveContainer>
      </Card>
    );
  }
}