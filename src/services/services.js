import Rx from 'rx';
import 'rx-dom';
import {Actions} from '../actions/Actions';
import {guid, momentToggleFormats, getEnvPropValue} from '../utils/Utils.js';

const maxMappingLevels = 4;
const blobHostnamePattern = "https://{0}.blob.core.windows.net";

export const SERVICES = {
  getUserAuthenticationInfo(){
   ///Make sure the AAD client id is setup in the config
   let userProfile = window.userProfile;

    if(userProfile && userProfile.given_name)
       return userProfile;

    if(!process.env.REACT_APP_AAD_AUTH_CLIENTID || process.env.REACT_APP_AAD_AUTH_CLIENTID === ''){
      console.log('AAD Auth Client ID config is not setup in Azure for this instance');
      return {};
    }

    console.log('AD ID: ' + process.env.REACT_APP_AAD_AUTH_CLIENTID);

    window.config = {
      instance: 'https://login.microsoftonline.com/',
      tenant: 'microsoft.com',
      clientId: process.env.REACT_APP_AAD_AUTH_CLIENTID,
      postLogoutRedirectUri: 'http://www.microsoft.com',
      cacheLocation: 'localStorage', // enable this for IE, as sessionStorage does not work for localhost.
    };

    let authContext = new window.AuthenticationContext(window.config);

    var isCallback = authContext.isCallback(window.location.hash);
    authContext.handleWindowCallback();

    if (isCallback && !authContext.getLoginError()) {
        window.location = authContext._getItem(authContext.CONSTANTS.STORAGE.LOGIN_REQUEST);
    }
    // Check Login Status, Update UI
    var user = authContext.getCachedUser();
    if (user) {
        let sessionId = guid();
        // We are logged in. We're is good!
        window.userProfile = {
          unique_name: user.profile.upn,
          family_name: user.profile.family_name,
          given_name: user.profile.given_name,
          sessionId: sessionId
        };

        window.appInsights.trackEvent("login", {profileId: window.userProfile.unique_name});

        return window.userProfile;
    } else {
        // We are not logged in.  Try to login.
        authContext.login();
    }
  },

  getPopularTermsTimeSeries(siteKey, datetimeSelection, timespanType){
     let formatter = Actions.constants.TIMESPAN_TYPES[timespanType];
     let hostname = blobHostnamePattern.format(getEnvPropValue(siteKey, process.env.REACT_APP_STORAGE_ACCT_NAME));
     let blobContainer = getEnvPropValue(siteKey, process.env.REACT_APP_BLOB_TIMESERIES);

     let url = "{0}/{1}/{2}/top5.json".format(hostname, blobContainer, momentToggleFormats(datetimeSelection, formatter.format, formatter.blobFormat));

      return Rx.DOM.getJSON(url);
  },

  getDefaultSuggestionList(siteKey){
      return Rx.DOM.ajax({url: getEnvPropValue(siteKey, process.env.REACT_APP_TBL_KEYWORDS),
                          responseType: 'json',
                          headers: {"Accept": "application/json;odata=nometadata"}
                        });
  },

  processFolderItem(parentFolder, mappingItem, level){
       if(level <= maxMappingLevels){
           let folderKey = mappingItem["level" + level + "Key"] || "";
           if(folderKey && !parentFolder.has(folderKey)){
                let newFolder = {folderName: mappingItem["level" + level + "Display"], subFolders: new Map(), eventCount: 0};
                parentFolder.set(folderKey, newFolder);

                this.processFolderItem(newFolder.subFolders, mappingItem, level + 1);
           }else if(folderKey){
                this.processFolderItem(parentFolder.get(folderKey).subFolders, mappingItem, level + 1);
           }
       }
  },

  getSentimentTreeData(siteKey, cb){
      Rx.DOM.ajax({url: getEnvPropValue(siteKey, process.env.REACT_APP_TBL_CLASSIFICATION),
                          responseType: 'json',
                          headers: {"Accept": "application/json;odata=nometadata"}
                        })
            .subscribe(tableValues => {
                  if(tableValues.response && tableValues.response.value){
                       let folderTree = new Map();

                       tableValues.response.value.forEach(item => {
                             let parentFolder = folderTree.get(item.PartitionKey);
                             if(!parentFolder){
                                 parentFolder = {folderName: item.PartitionKey, subFolders: new Map(), eventCount: 0};
                                 folderTree.set(item.PartitionKey, parentFolder);
                             }

                             this.processFolderItem(parentFolder.subFolders, item, 1);
                       });

                       cb(folderTree);
                   }
              }, error => {
                            console.error('An error occured trying to query the search terms: ' + error);
              });
  },

  getActivityEvents: function(siteKey, categoryValue, categoryType, timespanType, dateSelection){
      let testData =[[{
        "id": 1,
        "name": "Kathy Wood",
        "source": "facebook",
        "timeLabel": "1 hour ago",
        "eventSubSource": "AP",
        "sentence": "@RealBenCarson</a> says he will never forgive <a href='#'>@HillaryClinton</a> for <a href='#'>#Benghazi</a>",
        "dataType": "comment",
        "messageTitle": "Refugees Fleeing Bengazi",
        "avatar": "http://webapplayers.com/inspinia_admin-v2.4/img/a3.jpg"
        }, {
        "id": 2,
        "name": "Lisa Bell",
        "source": "facebook",
        "timeLabel": "2 hours ago",
        "eventSubSource": "AP",
        "sentence": "Vestibulum rutrum rutrum neque.",
        "dataType": "comment",
        "messageTitle": "Hunger Hits Tripoli",
        "avatar": "http://webapplayers.com/inspinia_admin-v2.4/img/a2.jpg"
        }, {
        "id": 3,
        "name": "Samuel Dunn",
        "source": "facebook",
        "timeLabel": "2 hours ago",
        "eventSubSource": "BBC",
        "sentence": "Fusce consequat.",
        "dataType": "comment",
        "messageTitle": "ISIS attack in Benghazi",
        "avatar": "http://webapplayers.com/inspinia_admin-v2.4/img/profile.jpg"
        }, {
        "id": 4,
        "name": "Philip Price",
        "source": "facebook",
        "timeLabel": "4 hours ago",
        "eventSubSource": "Al Jazeera",
        "sentence": "Integer non velit. Donec diam neque, vestibulum eget, vulputate ut, ultrices vel, augue. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Donec pharetra, magna vestibulum aliquet ultrices, erat tortor sollicitudin mi, sit amet lobortis sapien sapien non mi.",
        "dataType": "comment",
        "messageTitle": "Water Famine Continues",
        "avatar": "http://webapplayers.com/inspinia_admin-v2.4/img/a2.jpg"
        }, {
        "id": 5,
        "name": "Linda Nguyen",
        "source": "twitter",
        "timeLabel": "1:33 PM",
        "eventSubSource": "AP",
        "sentence": "Etiam justo. Etiam pretium iaculis justo. In hac habitasse platea dictumst.",
        "dataType": "post",
        "messageTitle": false,
        "avatar": "http://webapplayers.com/inspinia_admin-v2.4/img/a5.jpg"
        }, {
        "id": 6,
        "name": "Heather Freeman",
        "source": "twitter",
        "timeLabel": "2:30 AM",
        "eventSubSource": "AP",
        "sentence": "Donec dapibus. Duis at velit eu est congue elementum. In hac habitasse platea dictumst.",
        "dataType": "tweet",
        "messageTitle": false,
        "avatar": "http://webapplayers.com/inspinia_admin-v2.4/img/a2.jpg"
        }, {
        "id": 7,
        "name": "Diane Hernandez",
        "source": "twitter",
        "timeLabel": "3:05 AM",
        "eventSubSource": "AP",
        "sentence": "Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vivamus vestibulum sagittis sapien.",
        "dataType": "tweet",
        "messageTitle": false,
        "avatar": "http://webapplayers.com/inspinia_admin-v2.4/img/a2.jpg"
        }, {
        "id": 8,
        "name": "Jennifer Willis",
        "source": "facebook",
        "timeLabel": "5:47 AM",
        "eventSubSource": "AP",
        "sentence": "Morbi non lectus.",
        "dataType": "comment",
        "messageTitle": false,
        "avatar": "http://webapplayers.com/inspinia_admin-v2.4/img/a2.jpg"
        }, {
        "id": 9,
        "name": "Maria Porter",
        "source": "twitter",
        "timeLabel": "2:03 AM",
        "eventSubSource": "Al Jazeera",
        "sentence": "Nulla ac enim. In tempor, turpis nec euismod scelerisque, quam turpis adipiscing lorem, vitae mattis nibh ligula nec sem.",
        "dataType": "comment",
        "messageTitle": false,
        "avatar": "http://webapplayers.com/inspinia_admin-v2.4/img/a2.jpg"
        }, {
        "id": 10,
        "name": "Walter Chapman",
        "source": "twitter",
        "timeLabel": "9:18 AM",
        "eventSubSource": "Libyan Times",
        "sentence": "Morbi non lectus. Aliquam sit amet diam in magna bibendum imperdiet.",
        "dataType": "tweet",
        "messageTitle": false,
        "avatar": "http://webapplayers.com/inspinia_admin-v2.4/img/a2.jpg"
        }, {
        "id": 11,
        "name": "Kathleen Nelson",
        "source": "twitter",
        "timeLabel": "2:16 PM",
        "eventSubSource": "Al Jazeera",
        "sentence": "In tempor, turpis nec euismod scelerisque, quam turpis adipiscing lorem, vitae mattis nibh ligula nec sem. Duis aliquam convallis nunc. Proin at turpis a pede posuere nonummy.",
        "dataType": "comment",
        "messageTitle": false,
        "avatar": "http://webapplayers.com/inspinia_admin-v2.4/img/a2.jpg"
        }, {
        "id": 12,
        "name": "Bruce Day",
        "source": "facebook",
        "timeLabel": "11:20 PM",
        "eventSubSource": "AP",
        "sentence": "Nulla facilisi.",
        "dataType": "post",
        "messageTitle": false,
        "avatar": "http://webapplayers.com/inspinia_admin-v2.4/img/a2.jpg"
        }, {
        "id": 13,
        "name": "Lawrence Parker",
        "source": "facebook",
        "timeLabel": "6:49 AM",
        "eventSubSource": "Al Jazeera",
        "sentence": "Nullam porttitor lacus at turpis. Donec posuere metus vitae ipsum. Aliquam non mauris.",
        "dataType": "comment",
        "messageTitle": false,
        "avatar": "http://webapplayers.com/inspinia_admin-v2.4/img/a2.jpg"
        }, {
        "id": 14,
        "name": "Johnny Ruiz",
        "source": "facebook",
        "timeLabel": "7:55 AM",
        "eventSubSource": "AP",
        "sentence": "Morbi ut odio.",
        "dataType": "tweet",
        "messageTitle": false,
        "avatar": "http://www.material-ui.com/images/ok-128.jpg"
        }, {
        "id": 15,
        "name": "Ashley Fernandez",
        "source": "facebook",
        "timeLabel": "3:39 PM",
        "eventSubSource": "Al Jazeera",
        "sentence": "Fusce lacus purus, aliquet at, feugiat non, pretium quis, lectus.",
        "dataType": "tweet",
        "messageTitle": false,
        "avatar": "http://webapplayers.com/inspinia_admin-v2.4/img/a2.jpg"
        }, {
        "id": 16,
        "name": "Bonnie Wells",
        "source": "facebook",
        "timeLabel": "2:32 PM",
        "eventSubSource": "AP",
        "sentence": "Aliquam augue quam, sollicitudin vitae, consectetuer eget, rutrum at, lorem.",
        "dataType": "tweet",
        "messageTitle": false,
        "avatar": "http://webapplayers.com/inspinia_admin-v2.4/img/a2.jpg"
        }, {
        "id": 17,
        "name": "Barbara Montgomery",
        "source": "twitter",
        "timeLabel": "4:28 PM",
        "eventSubSource": "Al Jazeera",
        "sentence": "Lorem ipsum dolor sit amet, consectetuer adipiscing elit.",
        "dataType": "tweet",
        "messageTitle": false,
        "avatar": "http://webapplayers.com/inspinia_admin-v2.4/img/a2.jpg"
        }, {
        "id": 18,
        "name": "Marie Mitchell",
        "source": "twitter",
        "timeLabel": "12:27 AM",
        "eventSubSource": "BBC",
        "sentence": "Donec dapibus. Duis at velit eu est congue elementum. In hac habitasse platea dictumst.",
        "dataType": "post",
        "messageTitle": false,
        "avatar": "http://www.material-ui.com/images/ok-128.jpg"
        }, {
        "id": 19,
        "name": "Doris Garcia",
        "source": "facebook",
        "timeLabel": "8:11 AM",
        "eventSubSource": "BBC",
        "sentence": "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Proin interdum mauris non ligula pellentesque ultrices.",
        "dataType": "comment",
        "messageTitle": false,
        "avatar": "http://webapplayers.com/inspinia_admin-v2.4/img/a2.jpg"
        }, {
        "id": 20,
        "name": "Gregory Warren",
        "source": "facebook",
        "timeLabel": "11:18 AM",
        "eventSubSource": "BBC",
        "sentence": "Maecenas ut massa quis augue luctus tincidunt. Nulla mollis molestie lorem.",
        "dataType": "tweet",
        "messageTitle": false,
        "avatar": "http://webapplayers.com/inspinia_admin-v2.4/img/a2.jpg"
        }, {
        "id": 21,
        "name": "Samuel Fisher",
        "source": "facebook",
        "timeLabel": "8:38 AM",
        "eventSubSource": "AP",
        "sentence": "Fusce posuere felis sed lacus. Morbi sem mauris, laoreet ut, rhoncus aliquet, pulvinar sed, nisl. Nunc rhoncus dui vel sem.",
        "dataType": "comment",
        "messageTitle": false,
        "avatar": "http://webapplayers.com/inspinia_admin-v2.4/img/a2.jpg"
        }, {
        "id": 22,
        "name": "Theresa Wilson",
        "source": "twitter",
        "timeLabel": "7:15 PM",
        "eventSubSource": "Al Jazeera",
        "sentence": "Aliquam erat volutpat. In congue.",
        "dataType": "comment",
        "messageTitle": false,
        "avatar": "http://webapplayers.com/inspinia_admin-v2.4/img/a2.jpg"
        }, {
        "id": 23,
        "name": "Jeremy Sims",
        "source": "twitter",
        "timeLabel": "1:58 PM",
        "eventSubSource": "BBC",
        "sentence": "Nunc purus.",
        "dataType": "tweet",
        "messageTitle": false,
        "avatar": "http://webapplayers.com/inspinia_admin-v2.4/img/a2.jpg"
        }, {
        "id": 24,
        "name": "Bonnie Carr",
        "source": "twitter",
        "timeLabel": "10:29 AM",
        "eventSubSource": "BBC",
        "sentence": "Etiam faucibus cursus urna.",
        "dataType": "tweet",
        "messageTitle": false,
        "avatar": "http://webapplayers.com/inspinia_admin-v2.4/img/a2.jpg"
        }, {
        "id": 25,
        "name": "Richard Ortiz",
        "source": "facebook",
        "timeLabel": "1:13 PM",
        "eventSubSource": "Libyan Times",
        "sentence": "Curabitur in libero ut massa volutpat convallis.",
        "dataType": "comment",
        "messageTitle": false,
        "avatar": "http://webapplayers.com/inspinia_admin-v2.4/img/a2.jpg"
        }, {
        "id": 26,
        "name": "Martin Cunningham",
        "source": "twitter",
        "timeLabel": "4:39 PM",
        "eventSubSource": "Al Jazeera",
        "sentence": "Suspendisse ornare consequat lectus. In est risus, auctor sed, tristique in, tempus sit amet, sem.",
        "dataType": "comment",
        "messageTitle": false,
        "avatar": "http://webapplayers.com/inspinia_admin-v2.4/img/a2.jpg"
        }, {
        "id": 27,
        "name": "Henry Perkins",
        "source": "facebook",
        "timeLabel": "6:37 PM",
        "eventSubSource": "AP",
        "sentence": "Morbi a ipsum. Integer a nibh.",
        "dataType": "comment",
        "messageTitle": false,
        "avatar": "http://www.material-ui.com/images/ok-128.jpg"
        }, {
        "id": 28,
        "name": "Jennifer Rodriguez",
        "source": "twitter",
        "timeLabel": "9:54 PM",
        "eventSubSource": "Libyan Times",
        "sentence": "Nunc purus. Phasellus in felis.",
        "dataType": "tweet",
        "messageTitle": false,
        "avatar": "http://webapplayers.com/inspinia_admin-v2.4/img/a2.jpg"
        }, {
        "id": 29,
        "name": "Bonnie Coleman",
        "source": "facebook",
        "timeLabel": "1:27 PM",
        "eventSubSource": "AP",
        "sentence": "Quisque erat eros, viverra eget, congue eget, semper rutrum, nulla. Nunc purus.",
        "dataType": "tweet",
        "messageTitle": false,
        "avatar": "http://webapplayers.com/inspinia_admin-v2.4/img/a2.jpg"
        }, {
        "id": 30,
        "name": "Ralph Frazier",
        "source": "facebook",
        "timeLabel": "9:23 PM",
        "eventSubSource": "BBC",
        "sentence": "Suspendisse potenti. Cras in purus eu magna vulputate luctus. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.",
        "dataType": "comment",
        "messageTitle": false,
        "avatar": "http://webapplayers.com/inspinia_admin-v2.4/img/a2.jpg"
        }]];

      return Rx.Observable.from(testData);
  },

  getHeatmapTiles: function(siteKey, categoryType, timespanType, categoryValue, datetimeSelection, tileId){
    let formatter = Actions.constants.TIMESPAN_TYPES[timespanType];
    let hostname = blobHostnamePattern.format(getEnvPropValue(siteKey, process.env.REACT_APP_STORAGE_ACCT_NAME));
    let blobContainer = getEnvPropValue(siteKey, process.env.REACT_APP_BLOB_TILES);

    let url = "{0}/{1}/{2}/{3}/{4}/{5}.json".format(hostname, blobContainer,
                                       categoryType.toLowerCase(), categoryValue.replace(" ", ""),
                                       momentToggleFormats(datetimeSelection, formatter.format, formatter.blobFormat), tileId);

    return Rx.DOM.getJSON(url);
  },

  getFacts: function (pageSize, skip) {
      let url = "http://fortisfactsservice.azurewebsites.net/api/facts?pageSize={0}&skip={1}&fullInfo=false".format(pageSize, skip);
      return Rx.DOM.getJSON(url);
  },

  getFact: function (id) {
      let url = "http://fortisfactsservice.azurewebsites.net/api/facts/" + id;
      return Rx.DOM.getJSON(url);
  },
}
