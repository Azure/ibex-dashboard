import utils from '../../utils';
import dashboardSample from '../mocks/dashboards/samples';
import dashboardAI from '../mocks/dashboards/application-insights';
import dashboardAIForked from '../mocks/dashboards/application-insights-forked';

describe('Utils', () => {

  it ('KM Number', () => {

    expect(utils.kmNumber(0)).toBe("0");
    expect(utils.kmNumber(10)).toBe("10");
    expect(utils.kmNumber(0.1)).toBe("0.1");
    expect(utils.kmNumber(0.999)).toBe("1.0");
    expect(utils.kmNumber(10, '%')).toBe("10%");
    expect(utils.kmNumber(100)).toBe("100");
    expect(utils.kmNumber(1000)).toBe("1.0K");
    expect(utils.kmNumber(10000)).toBe("10.0K");
    expect(utils.kmNumber(100000)).toBe("100.0K");
    expect(utils.kmNumber(1000000)).toBe("1.0M");

  });

  it ('Ago', () => {
    let time = new Date();
    time.setSeconds(time.getSeconds() - 10);
    expect(utils.ago(time)).toBe('a few seconds ago');

    time = new Date();
    time.setMinutes(time.getMinutes() - 10);
    expect(utils.ago(time)).toBe('10 minutes ago');

    time = new Date();
    time.setDate(time.getDate() - 1);
    expect(utils.ago(time)).toBe('a day ago');

    time = new Date();
    time.setDate(time.getDate() - 10);
    expect(utils.ago(time)).toBe('10 days ago');

    time = new Date();
    time.setMonth(time.getMonth() - 10);
    expect(utils.ago(time)).toBe('10 months ago');
  });

  it ('string <==> object', () => {

    let s_dashboardSample = utils.convertDashboardToString(dashboardSample);
    let s_dashboardAI = utils.convertDashboardToString(dashboardAI);
    let s_dashboardAIForked = utils.convertDashboardToString(dashboardAIForked);

    expect(s_dashboardSample).toMatchSnapshot('sample dashboard');
    //expect(s_dashboardAI).toMatchSnapshot('ai dashboard');
    //expect(s_dashboardAIForked).toMatchSnapshot('ai forked dashboard');

  });
});
