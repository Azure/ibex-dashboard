[![Build Status](https://travis-ci.org/CatalystCode/azure-web-starter-template-reactjs.svg?branch=master)](https://travis-ci.org/CatalystCode/azure-web-starter-template-reactjs)<img src="https://cloud.githubusercontent.com/assets/7635865/11383036/781f2cee-92d3-11e5-98b9-91eb7f29e540.png" width="300" height="65"/><br>
<img src="https://cloud.githubusercontent.com/assets/7635865/11382863/6505a116-92d2-11e5-965f-33dba073d0a5.png" width="500" height="300"/>

# Starter Template for Dokku Linux Azure Web App 
A starter template for a NodeJS web application running on Microsoft Azure. This repo is a starting point for developers seeking a production ready fullstack site running on Azure. This project is intended for web applications running on the react/flux platform, and hoping to offer similar options for Angular 2, Relay / GraphQL and Ember. This is an unopinionated project, that enables developers to kickoff a web project running off any framework or CI deployment solution. 

This particular project is running off a Dokku Azure Linux VM, thanks to Steven Edouard's recent work with the folks at Dokku and Azure. You can follow these [instructions](https://github.com/sedouard/case-studies-1/blob/case_study_dokku_azure/_posts/2015-10-26-Streamlined-Dokku-Deployment.md#deploying-dokku-to-azure---the-easy-way) to get started.

This project provides a boilerplate integration with Azure Active directory authentication and Application Insight logging. Both features are optional. 

I'm currently working towards adding a VSCode plugin that will setup this app locally through your IDE. 

##### Assumptions
 1. Azure Linux Web App is Online - Please follow these [instructions](https://github.com/sedouard/case-studies-1/blob/case_study_dokku_azure/_posts/2015-10-26-Streamlined-Dokku-Deployment.md#deploying-dokku-to-azure---the-easy-way)

##### Installation
```
git clone https://github.com/CatalystCode/AzureWebStarterTemplateReactJS.git
npm run setup
```

##### Project Build / Start 
```
grunt build
npm start
```

##### Packaged Components

######Testing

 1. PhantomJS
 2. Karma
 3. Mocha 
 4. Sinon
 5. ESLint
 6. React Test Utils 

For Test-Driven Development, open up a second command window and run 
```
grunt test-dev
```

The project comes bundled with a Karma test harness and PhantomJS. All JS test scripts in the /tests directory will automatically re-run when any file(s) change. 

######Configuration

1. Dokku application configuration variables

An application will often require some configuration. Dokku supports application configuration via environment variables. Environment variables may contain private data, such as passwords or API keys, so it is not recommended to store them in your application's repository. For example, this project is on the lookout for two optional environment variables called APPINSIGHTS_INSTRUMENTATIONKEY and AAD_AUTH_CLIENTID. 

To set this up on your host, please ssh into your Dokku VM and run the following command. 
```
dokku config:set azure-web-app APPINSIGHTS_INSTRUMENTATIONKEY=xxx AAD_AUTH_CLIENTID=xxxxx
```

Then register these variables in your server.js file
```
var AZURE_CONFIG_PROPS = ['APPINSIGHTS_INSTRUMENTATIONKEY', 'AAD_AUTH_CLIENTID'];
```

######Front-end

1. ReactJS 
2. Flux

######Event Processing

1. RxJS

######Interface component

1. Bootstrap
2. Font awesome
3. JQuery
4. Bootstrap Notifier

######Starter Template layout

1. The default component for this single page app's homepage can be found in src/components/Hompepage.js. I'll be sprucing up the look and feel with Bootstrap announcing the recent release of version 4. 

######Authentication

1. Active directory

If you'd like to enable Active Directory authentication, please follow the [Register your web server app with AD](https://msdn.microsoft.com/en-us/office/office365/howto/add-common-consent-manually) instructions using your app's public hostname alias as the Sign-On URL. Once you've obtained the AAD client ID, ssh into Dokku and register the token configuration using the following command. 

```
dokku config:set azure-web-app AAD_AUTH_CLIENTID=xxxxx
```

######Logging

1. Application Insights

Application Insights is a powerhouse platform that provides insight and transparency into the health of your application. You can use it to create monitoring rules / notifications, and log errors and traces about your app. 

If you'd like to setup application insights, head on over to the [Azure Preview Portal](https://ms.portal.azure.com/#create/Microsoft.AppInsights) and create a new application insight resource selecting 'Other(preview)' as the application type. Once the app insight is setup, grab the Instramentation Key from Settings > Configure / Properties. You can configure app insight into your app by running the following command. Dokku will automatically restart your app, and you should start seeing app insight events flowing through the azure portal right away. 

```
dokku config:set azure-web-app APPINSIGHTS_INSTRUMENTATIONKEY=xxxxx
```

The app insight client library is available in the window object of the DOM. You can publish custom traces and events to App Insight anywhere throughout your app by adding the following code in any of your javascript source files.

```
appInsights.trackEvent("CanYouHearMe", {message: 'I sure can'});
```

######Web Routing

1. react-router

This project uses React Router to keep your UI in sync with the URL. React Router was inspired by Ember's fantastic router. Routes are managed in the /src/routes/routes.js file. 

```
import {EntryPage} from './EntryPage';

export const routes = (
    <Route>
    	<Route path="/" component={EntryPage} linkLabel="My App" href="/" icon="fa fa-share-alt-square fa" />
    </Route>
);
```

For any route, you need to specify the React Component that's binded to the route, the URL path, href and the header link label. The presence of the href attribute determines if the route should be displayed on the header. You can optionally provide a font awesome icon that should be rendered for the menu item on the header.

######Asset pipeline automation

1. grunt tasks that cover css/js minifacation, unification
2. Browserify
3. Babel

We're using grunt as our asset pipeline automation framework. Any additional tasks can be setup in Gruntfile.js

######Web server

1. node
2. express

######3rd party components

1. bower

######Continous Integration
Batteries are included - If you decide to use Travis, this repo comes packaged with travis deployment scripts(.travis.yml) that will deploy your web app builds to Azure on Git push events. Please refer to the ["Getting Started Guide"](https://docs.travis-ci.com/user/getting-started/) if this is your first time using Travis. 

Assumptions

1. Travis CLI and Ruby is localled installed. Travis CLI operates in Ruby's runtime environment. Checkout this [post](https://docs.travis-ci.com/user/encrypting-files/#Preparation) to install the Travis CLI and [here](https://github.com/travis-ci/travis.rb#installation) for installing Ruby.
2. You have a Dokku VM web app.
3. You have a Dokku Deploy SSH private key
4. You have a Dokku VM private key
5. You have [Git Bash](https://git-scm.com/downloads) locally installed or using a Bash terminal. 
6. Your current working directory is the root of the clones repo. 
7. The Travis deployment instance is setup on travis-ci.org.

The Git push events on the Dokku remote Git target trigger a rebuild on the host. This requires adding both SSH keys created during the VM provisioning described in Stephen's post above. You'll need to hook in your encrypted ssh keys for Travis deploy. We're evaluating more of a streamlined solution, so this may be simplified in the future. 

You will need Ruby installed in order to use the Travis CLI tool and also access to both the Dokku Deploy and Dokku VM SSH keys, from the Dokku Web App setup. Travis CLI will securely store the encyption secret within the settings of your deployment on Travis, as the encrypted SSH keys will be decrypted by Travis during the deployment. 

Register your encryption secret with Travis
```
travis encrypt secret_password=your_super_secret --add
```
Copy both SSH private keys into a folder called .travis within the root of the repo. This folder will not be added to the repo as it's included in .gitignore. ssh_keys.tar is also added to git ignore, as we do not want to add the unencrypted private keys to Git.  
```
tar cvf ssh_keys.tar .travis/hostname_key .travis/dokku_deploy_key
```

Encrypt the private ssh_keys. This will add the encrypted ssh_keys.tar.enc to your repo for the deployment. 
```
openssl aes-256-cbc -k "your_super_secret" -in ssh_keys.tar -out ssh_keys.tar.enc
```

That's it. 
