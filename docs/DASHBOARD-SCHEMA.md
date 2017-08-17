# Dashboard Schema

This document describes the schema which constitutes a dashboard (template and instance).

## Locations

All dashboards are stored in the server and executed on the client, with the following locations:

* `/server/dashboards/*.private.js` - JavaScript instanciated, private dashboards
* `/server/dashboards/preconfigured/*.ts` - TypeScript templates (common in the repo)
* `/server/dashboards/customTemplates/*.private.ts` - TypeScript custom, private templates (populated by saving an instanciated, private dashboard or uploading a new template).

## TypeScript Interface

[types.d.ts > IDashboardConfig](../client/@types/types.d.ts)

## Top Level

```ts
{
  id: string, // Unique id for the template to be used when looking up a dashboard
  name: string, // Name to be displayed in navigation
  icon: string, // Icon to be displayed in navigation (see https://material.io/icons/)
  url: string, // Url path (should be same as id)
  description: string,
  preview: "/images/sample.png",
  category: 'Samples',
  html: ,
  config: {
    connections: {},
    layout: {
      isDraggable: true,
      isResizable: true,
      rowHeight: 30,
      verticalCompact: false,
      cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 },
      breakpoints: { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }
    }
  },
  dataSources: [],
  filters: [],
  elements: [],
  dialogs: []
}
```