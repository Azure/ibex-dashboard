import samples from './rich-samples';
import { createDashboard } from "./utils";

let dashboard = createDashboard(samples);
dashboard.elements.push({
  id: "pie",
  type: "PieData",
  title: "Pie Data",
  subtitle: "Pie Data sub-title",
  size: { w: 3,h: 8 },
  source: "data",
  props: { showLegend: true,compact: true,entityType: "Messages" }
});

export default dashboard;