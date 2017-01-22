# Bot Framedash
This is an application insights based project that displays a bots analytics dashboard.

# Preview

[![Preview](/docs/bot-framedash.png)](/docs/bot-framedash.png)
[![Preview](/docs/bot-framedash-msgs.png)](/docs/bot-framedash-msgs.png)

### Show With Your Own Data

1. Clone
2. Get an Application Insights App ID and Api Key
3. Create the following `.env` file:

```bash
REACT_APP_APP_INSIGHTS_APPID={APP ID}
REACT_APP_APP_INSIGHTS_APIKEY={API KEY}
```

4. Run `npm start`
5. Open **http://localhost:3000/**

## Deploy To Azure

To deploy to azure fork this repo (to be able to automatically create github deployment key).
from you new repo run:

```sh 
clone https://github.com/[your-user-name/group]/bot-fmk-dashboard
cd bot-fmk-dashboard
cd deploy
cp dashboard.parameters.json dashboard.parameters.private.json
```

Edit `dashboard.parameters.private.json` and change the repo url to your own, and fix the other parameters as well.

```sh
azure login
azure account list
azure account set "{account id}"
azure group create "new-resource-group" -l "West Europe" -f dashboard.template.json -e dashboard.parameters.private.json
```

Since application insights API doesn't support ARM yet, we need to manually [create an API Key](https://dev.applicationinsights.io/documentation/Authorization/API-key-and-App-ID) for the application insights service.
Once you created the api key, copy and paste it into the **Web App ==> Application Settings ==> REACT_APP_APP_INSIGHTS_APIKEY**.

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
