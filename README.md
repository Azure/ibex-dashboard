[![Build Status](https://travis-ci.org/CatalystCode/azure-web-starter-template-reactjs.svg?branch=master)](https://travis-ci.org/CatalystCode/azure-web-starter-template-reactjs)

# OCHA Current State of Libya Monitoring Dashboard
The portal for the FORTIS humanitarian insight tool. This site currently contains two sites.
- [fortis-dashboard.azurewebsites.net/#/site/ocha](fortis-dashboard.azurewebsites.net/#/site/ocha)
- [fortis-dashboard.azurewebsites.net/#/site/dengue](fortis-dashboard.azurewebsites.net/#/site/dengue)

### Assumptions
 1. Running node version 4.5 or above. 

### Installation
```
git clone https://github.com/CatalystCode/Fortis-Client.git
cd Fortis-Client
npm install -g create-react-app
npm install
```

### Dev
```
npm start
```

### Test Watcher
Runs the test watcher in an interactive mode.
By default, runs tests related to files changes since the last commit.

```
npm test
```

### Build for Production
```
npm run build
```

## What’s Inside?

* [webpack](https://webpack.github.io/) with [webpack-dev-server](https://github.com/webpack/webpack-dev-server), [html-webpack-plugin](https://github.com/ampedandwired/html-webpack-plugin) and [style-loader](https://github.com/webpack/style-loader)
* [Babel](http://babeljs.io/) with ES6 and extensions used by Facebook (JSX, [object spread](https://github.com/sebmarkbage/ecmascript-rest-spread/commits/master), [class properties](https://github.com/jeffmo/es-class-public-fields))
* [Autoprefixer](https://github.com/postcss/autoprefixer)
* [ESLint](http://eslint.org/)
* [Jest](http://facebook.github.io/jest)
