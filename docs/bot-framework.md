# Bot Framework 

A [Bot Framework](https://dev.botframework.com) [Direct Line](https://docs.botframework.com/en-us/restapi/directline3/#navtitle) secret can be added to the list of required connections. This will enable advanced features to be actioned from the dashboard such as 'hand-off' to human.

## Config 
To enable [Direct Line](https://docs.botframework.com/en-us/restapi/directline3/#navtitle) add 'bot-framework' with a 'directLine' property to the connections config. The `directLine` property will become a required value.

```js
connections: {
  'bot-framework': { 
    'directLine': "" 
  }
}
```