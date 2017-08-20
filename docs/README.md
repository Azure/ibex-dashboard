# Ibex Dashboard Development Guide

## Framework
This project is built using [create-react-app](https://github.com/facebookincubator/create-react-app).
The server side appraoch was addopted [through this link](https://www.fullstackreact.com/articles/using-create-react-app-with-a-server/).

* [Creating a new Dashboard Template](dashboard-creation.md)

# Orchestrators

## DataSourceConnector
[DataSourceConnector](../client/src/data-sources/DataSourceConnector.ts) is a class that created and initializes the various data sources.

[ElementConnector](../client/src/components/ElementConnector.tsx) is a class the creates and initializes Visual component for the dashboard and consecutive dialogs.

## Plugins
Many of the aspects in this project are extendible. The following are possibilities to donate your own plugins.

## Connection Plugins

Connection plugins are connected to Data Source plugins. A Data Source can have a connection plugin which will provide all the instances of the Data Source with a single connection to receive credentials information from.

## Data Source Plugins

[How to create a Data Source Plugin](add-new-data-source.md)

* Constant
* Sample
* Application Insights
* [CosmosDB](data-sources/cosmos-db.md)
* [Bot Framework](data-sources/bot-framework.md)
* GraphQL
* Azure 

## Elements Plugins

[How to create a Visual Plugin](add-new-element.md)

* [Area Chart](components/area.md)
* [Bar Chart](components/bar.md)
* [Detail View](components/detail.md)
* [Pie Chart](components/pie.md)
* [Request Button](components/requestbutton.md)
* [Scatter Chart](components/scatter.md)
* [Scorecard](components/scorecard.md)
* [Split View Panel](components/splitpanel.md)
* [Table](components/table.md)
* [Timeline Chart](components/timeline.md)

## data-formats plugins

[A short excerpt on data-formats](data-formats)

# Additional Features

* [Two Modes Elements](two-modes-element.md)
* [Filter Plugins](filter.md)
* [Dialogs](dialog.md)
* [Actions](actions.md)