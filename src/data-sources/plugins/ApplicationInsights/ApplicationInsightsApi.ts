import * as request from 'xhr-request';
import { appInsightsUri } from './common';

export interface IApplicationInsightsApi{
  callQuery (query:string, callback: () => void): void;
}

export default class ApplicationInsightsApi implements IApplicationInsightsApi{
  
  _appId:string;
  _apiKey:string;
  _apiUrl:string;


  constructor(appId:string, apiKey:string){
      this._appId = appId;
      this._apiKey = apiKey;
      this._apiUrl = appInsightsUri;
  }
  
  
  callQuery (query:string, callback: (json:any) => void){
      
      var url = `${this._apiUrl}/${this._appId}/query`; 
      try{
      request(url, {
        method: 'POST',
        json: true,
        headers: {
          'x-api-key': this._apiKey
        },
        body: {
          query
        }
      }, (error, json) => {
        if (error) {
          console.log(error);
          callback(null);
        }
        
        //return json
        callback(json);
    });
      }
      catch(ex){
        console.log(ex);
        callback(null);
      }
  }
}