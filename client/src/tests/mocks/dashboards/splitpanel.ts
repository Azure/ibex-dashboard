import { createDashboard } from "./utils";

let dashboard = createDashboard();
dashboard.dataSources.push(
  {
    id: "samples",
    type: "Sample",
    params: { 
      samples: { }
    }
  }
);
dashboard.elements.push(
  {
    id: "splitpanel",
    type: "SplitPanel",
    title: "Values",
    size: { w: 12,h: 16 },
    dependencies: { groups: "samples:groups", values: "samples:values" },
    props: {
      group: { field: "title",secondaryField: "subtitle", countField: "count" },
      cols: [
        { header: "Id",field: "id",secondaryHeader: "Repeat Id",secondaryField: "id" },
        { header: "Count",field: "count" },
      ]
    },
    actions: {
      select: {
        action: "samples:updateDependencies",
        params: { title: "args:title",type: "args:title" }
      }
    }
  }
);

export default dashboard;