import samples from './rich-samples';
import { createDashboard } from "./utils";

let dashboard = createDashboard();
dashboard.dataSources.push({
  id: "samples",
  type: "Sample",
  params: { 
    samples: { 
      scorecard_data_value: 3000000
    } 
  }
});
dashboard.elements.push({
  id: "scorecard",
  type: "Scorecard",
  title: "Value",
  size: { w: 3,h: 8 },
  source: "samples",
  dependencies: {
    value: "samples:scorecard_data_value",
    color: "::#2196F3",
    icon: "::av_timer"
  }
});

export default dashboard;