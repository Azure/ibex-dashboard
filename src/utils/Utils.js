import moment from 'moment';

function InvalidPropException(propName) {
   this.propName = propName;
   this.name = "InvalidPropException";
}

export function guid (){
    function _p8(s) {
        var p = (Math.random().toString(16)+"000000000").substr(2,8);
        return s ? "-" + p.substr(0,4) + "-" + p.substr(4,4) : p ;
    }
    return _p8() + _p8(true) + _p8(true) + _p8();
}

export function momentToggleFormats(dateString, fromFormat, targetFormat){
      return moment(dateString, fromFormat).format(targetFormat);
 }

function GetSitePrefixKey(siteKey){
     let propNamePrefix;

     if(process.env.REACT_APP_SITES){
         let sitePrefixes = process.env.REACT_APP_SITES.split(',');

         if(sitePrefixes.length > 0){
             let site = sitePrefixes.find(site=>site.startsWith(siteKey+":"));
             let siteSplit = site.split(':');

             if(siteSplit.length === 2){
                 propNamePrefix = siteSplit[1];
             }
         }
     }
     
     if(!propNamePrefix){
         throw new InvalidPropException(siteKey);
     }

     return propNamePrefix;
} 

export function getEnvPropValue(siteKey, propValueJSONStr){
     let propertyJSON = JSON.parse(propValueJSONStr);
     let sitePrefix = GetSitePrefixKey(siteKey);

     if(Object.keys(propertyJSON).length === 0){
         throw new InvalidPropException(propValueJSONStr);
     }

     let propValue = propertyJSON[sitePrefix];

     if(!propValue){
         throw new InvalidPropException(sitePrefix);
     }

     return propValue;
 }