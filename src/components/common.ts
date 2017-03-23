
function getScript(source: string, callback?: () => void): void {
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

let config = null;
function loadConfig(callback: (config: IDashboardConfig) => void): void {

  if (config) {
    return callback(config);
  }
  
  getScript('/api/config.js', () => {
    let dashboards: IDashboardConfig[] = (window as any)["dashboards"];
    let dashboard = dashboards[0];
    return callback(dashboard);
  });
}

export {
  loadConfig
}