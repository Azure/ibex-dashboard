# Bot Framedash
This is an application insights based project that displays a bots analytics dashboard.

# Preview

[![Preview](/docs/bot-framedash.png)](/docs/bot-framedash.png)
[![Preview](/docs/bot-framedash-msgs.png)](/docs/bot-framedash-msgs.png)

### Show With Your Own Data

1. Clone and run `npm start`
2. Get an Application Insights App ID and Api Key
3. Use with the following url: http://localhost:3000?appId={appId}&apiKey={apiKey}

You can also navigate to the online preview with your oun appId\apiKey:

http://bot-fmk-dashboard.azurewebsites.net?appId={appId}&apiKey={apiKey}

### Used Repos Technologies

* http://recharts.org/
* http://www.material-ui.com/

### Resources
This project is built using:

* https://github.com/facebookincubator/create-react-app

The server approach was added using:

* https://www.fullstackreact.com/articles/using-create-react-app-with-a-server/
* https://github.com/fullstackreact/food-lookup-demo
* https://medium.com/@patriciolpezjuri/using-create-react-app-with-react-router-express-js-8fa658bf892d#.14dex6478

Thinking about integrating with:

* https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md


### Assumptions
 1. Running node version 4.5 or above. 

### Installation
```bash
git clone https://github.com/CatalystCode/bot-fmk-dashboard.git
cd bot-fmk-dashboard
npm install -g create-react-app
npm install
```

### Dev
```bash
npm start
```

### Test Watcher
Runs the test watcher in an interactive mode.
By default, runs tests related to files changes since the last commit.

```bash
npm test
```

### Build for Production
```bash
npm run build
```

## What’s Inside?

* [webpack](https://webpack.github.io/) with [webpack-dev-server](https://github.com/webpack/webpack-dev-server), [html-webpack-plugin](https://github.com/ampedandwired/html-webpack-plugin) and [style-loader](https://github.com/webpack/style-loader)
* [Babel](http://babeljs.io/) with ES6 and extensions used by Facebook (JSX, [object spread](https://github.com/sebmarkbage/ecmascript-rest-spread/commits/master), [class properties](https://github.com/jeffmo/es-class-public-fields))
* [Autoprefixer](https://github.com/postcss/autoprefixer)
* [ESLint](http://eslint.org/)
* [Jest](http://facebook.github.io/jest)
