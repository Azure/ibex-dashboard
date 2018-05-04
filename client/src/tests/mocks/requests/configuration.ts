import * as nock from 'nock';
import dashboard from '../dashboards/dashboard';

function mockRequests() {

  nock('http://localhost')
    .get('/api/dashboards')
    .reply(200, `
      (function (window) {
        var dashboardTemplate = (function () {
          return ${JSON.stringify(dashboard)};
        })();
        window.dashboardTemplates = window.dashboardTemplates || [];
        window.dashboardTemplates.push(dashboardTemplate);
      })(window);
      (function (window) {
        var dashboard = (function () {
          return ${JSON.stringify(dashboard)};
        })();
        window.dashboardDefinitions = window.dashboardDefinitions || [];
        window.dashboardDefinitions.push(dashboard);
      })(window);
    `);

  nock('http://localhost')
    .get('/api/dashboards/id_fail')
    .reply(404, `Some error`);

  nock('http://localhost')
    .get('/api/dashboards/id_success')
    .reply(200, `
      (function (window) {
        var dashboard = (function () {
          return ${JSON.stringify(dashboard)};
        })();
        window.dashboard = dashboard || null;
      })(window);
    `);
  
  nock('http://localhost')
    .get('/api/templates/id_fail')
    .reply(404, `Some error`);

  nock('http://localhost')
    .get('/api/templates/id_success')
    .reply(200, `
      (function (window) {
        var template = (function () {
          return ${JSON.stringify(dashboard)};
        })();
        window.template = template || null;
      })(window);
    `);

  nock('http://localhost')
    .put('/api/dashboards/id')
    .reply(200, { success: true });
  
  nock('http://localhost')
    .put('/api/templates/id')
    .reply(200, { script: true });
}
export {
  mockRequests
};