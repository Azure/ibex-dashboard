import alt, { AbstractActions } from '../alt';

interface IConfigurationsActions {
  loadConfiguration(): any;
  failure(error: any): void;
}

class ConfigurationsActions extends AbstractActions implements IConfigurationsActions {
  constructor(alt: AltJS.Alt) {
    super(alt);
  }

  private getScript(source: string, callback?: () => void): void {
    let script: any = document.createElement('script');
    let prior = document.getElementsByTagName('script')[0];
    script.async = 1;
    prior.parentNode.insertBefore(script, prior);

    script.onload = script.onreadystatechange = (_, isAbort) => {
      if(isAbort || !script.readyState || /loaded|complete/.test(script.readyState) ) {
        script.onload = script.onreadystatechange = null;
        script = undefined;

        if(!isAbort) { if(callback) callback(); }
      }
    };

    script.src = source;
  }

  loadConfiguration() {
    
    return (dispatcher: (dashboard: IDashboardConfig) => void) => {
      
      this.getScript('/api/config.js', () => {
        let dashboards: IDashboardConfig[] = (window as any)["dashboards"];

        if (!dashboards || !dashboards.length) {
          return this.failure(new Error('Could not load configuration'));
        }

        let dashboard = dashboards[0];
        return dispatcher(dashboard);
      });
    };
  }

  failure(error: any) {
    return { error };
  }
}

const configurationsActions = alt.createActions<IConfigurationsActions>(ConfigurationsActions);

export default configurationsActions;
