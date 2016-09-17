import moment from 'moment';
import env_properties from '../../config.json';

function InvalidPropException(propName) {
   this.propName = propName;
   this.name = "InvalidPropException";
}

String.prototype.format = function(){
   var content = this;
   for (var i=0; i < arguments.length; i++)
   {
        var replacement = '{' + i + '}';
        content = content.replace(replacement, arguments[i]);
   }
   return content;
};

window.guid = function(){
    function _p8(s) {
        var p = (Math.random().toString(16)+"000000000").substr(2,8);
        return s ? "-" + p.substr(0,4) + "-" + p.substr(4,4) : p ;
    }
    return _p8() + _p8(true) + _p8(true) + _p8();
}

Number.prototype.randomize = function(min,max)
{
    return Math.floor(Math.random()*(max-min+1)+min);
}

 window.momentToggleFormats = function(dateString, fromFormat, targetFormat){
      return moment(dateString, fromFormat).format(targetFormat);
 }

 window.getEnvPropValue = function(siteKey, propName){
     let propNamePrefix;

     if(env_properties.SITES){
         let sitePrefixes = env_properties.SITES.split(',');

         if(sitePrefixes.length > 0){
             let site = sitePrefixes.find(site=>site.startsWith(siteKey+":"));
             let siteSplit = site.split(':');
             
             if(siteSplit.length == 2){
                 propNamePrefix = siteSplit[1];
             }
         }
     }
     
     if(!propNamePrefix){
         throw new InvalidPropException(siteKey);
     }

     let envVarName = "{0}{1}".format(propNamePrefix, propName);
     let propValue = env_properties[envVarName];

     if(!propValue){
         throw new InvalidPropException(envVarName);
     }

     return propValue;
 }