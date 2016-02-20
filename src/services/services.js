import env_properties from '../../config.json';
import Rx from 'rx';
import {TestGraphData} from './testGraphData';

export const SERVICES = {
  host: "https://myservice-host.net/",
  
  getUserAuthenticationInfo(){
   ///Make sure the AAD client id is setup in the config
   let userProfile = window.userProfile;

    if(userProfile && userProfile.given_name)
       return userProfile;

    if(!env_properties.AAD_AUTH_CLIENTID || env_properties.AAD_AUTH_CLIENTID === ''){
      console.log('AAD Auth Client ID config is not setup in Azure for this instance');
      return {};
    }

    console.log('AD ID: ' + env_properties.AAD_AUTH_CLIENTID);

    window.config = {
      instance: 'https://login.microsoftonline.com/',
      tenant: 'microsoft.com',
      clientId: env_properties.AAD_AUTH_CLIENTID,
      postLogoutRedirectUri: 'http://www.microsoft.com',
      cacheLocation: 'localStorage', // enable this for IE, as sessionStorage does not work for localhost.
    };

    let authContext = new AuthenticationContext(config);

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

        appInsights.trackEvent("login", {profileId: window.userProfile.unique_name});

        return window.userProfile;
    } else {
        // We are not logged in.  Try to login.
        authContext.login();
    }
  },
  
  getInitialGraphDataSet(fromDate, toDate, dataType){
      let response = [TestGraphData];

      return Rx.Observable.from(response);
  },
  
  getDefaultSuggestionList(){
      let testData = [[
            {value: 'Hunger', type:'Keyword'},
            {value: 'Asylum seekers', type: 'Status'},
            {value: 'IDPs', type: 'Status'},
            {value: 'Host community', type: 'Status'},
            {value: 'Libyan', type: 'Status'},
            {value: 'Women', type: 'Group'},
            {value: 'Children', type: 'Group'},
            {value: 'Youth', type: 'Group'},
            {value: 'Elderly', type: 'Group'},
            {value: 'Disabled', type: 'Group'},
            {value: 'Babies', type: 'Group'},
            {value: 'People', type: 'Group'},
            {value: 'Men', type: 'Group'},
            {value: 'Infant', type: 'Group'},
            {value: 'General National Congress', type:'Keyword'},
            {value: 'GNC', type:'Keyword'},
            {value: 'humanitarian', type:'Keyword'},
            {value: 'food', type:'Keyword'},
            {value: 'shelter', type:'Keyword'},
            {value: 'water shortage', type:'Keyword'},
            {value: 'attack', type:'Keyword'},
            {value: 'protection', type:'Keyword'},
            {value: 'education', type:'Keyword'},
            {value: 'health', type:'Keyword'},
            {value: 'malnutrition', type:'Keyword'},
            {value: 'starving', type:'Keyword'},
            {value: 'people affected', type:'Keyword'},
            {value: 'livelihoods', type:'Keyword'},
            {value: 'shortage', type:'Keyword'},
            {value: 'internally displaced', type:'Keyword'},
            {value: 'asylum-seekers', type:'Keyword'},
            {value: 'migrants', type:'Keyword'},
            {value: 'People in need', type:'Keyword'},
            {value: 'vulnerable', type:'Keyword'},
            {value: 'minorities', type:'Keyword'},
            {value: 'healthcare', type:'Keyword'},
            {value: 'IDPs', type:'Keyword'},
            {value: 'drinking water', type:'Keyword'},
            {value: 'suffering', type:'Keyword'},
            {value: 'discrimination', type:'Keyword'},
            {value: 'displacement', type:'Keyword'},
            {value: 'Europe', type:'Keyword'},
            {value: 'traffickers', type:'Keyword'},
            {value: 'death toll', type:'Keyword'},
            {value: 'marginalization', type:'Keyword'},
            {value: 'human rights violations', type:'Keyword'},
            {value: 'human rights ', type:'Keyword'},
            {value: 'borders', type:'Keyword'},
            {value: 'Islamists', type:'Keyword'},
            {value: 'paramilitaries', type:'Keyword'},
            {value: 'air strikes', type:'Keyword'},
            {value: 'outbreak', type:'Keyword'},
            {value: 'heavy weaponry', type:'Keyword'},
            {value: 'Weapon', type:'Keyword'},
            {value: 'casualties', type:'Keyword'},
            {value: 'inaccessible', type:'Keyword'},
            {value: 'humanitarian action', type:'Keyword'},
            {value: 'Extremist', type:'Keyword'},
            {value: 'shortages', type:'Keyword'},
            {value: 'humanitarian organisations', type:'Keyword'},
            {value: 'medical supplies', type:'Keyword'},
            {value: 'Gaddafi ', type:'Keyword'},
            {value: 'protests ', type:'Keyword'},
            {value: 'disease ', type:'Keyword'},
            {value: 'Islamic state', type:'Keyword'},
            {value: 'war crimes', type:'Keyword'},
            {value: 'electricity cuts', type:'Keyword'},
            {value: 'militants ', type:'Keyword'},
            {value: 'terrorists ', type:'Keyword'},
            {value: 'bomb', type:'Keyword'},
            {value: 'militia ', type:'Keyword'},
            {value: 'Cameron ', type:'Keyword'},
            {value: 'ISIS ', type:'Keyword'},
            {value: 'United Nations ', type:'Keyword'},
            {value: 'migrants crisis', type:'Keyword'},
            {value: 'imperialist ', type:'Keyword'},
            {value: 'oil ', type:'Keyword'},
            {value: 'negotiations ', type:'Keyword'},
            {value: 'tribal ', type:'Keyword'},
            {value: 'anti terror ', type:'Keyword'},
            {value: 'United States', type:'Keyword'},
            {value: 'Egypt', type:'Keyword'},
            {value: 'UK ', type:'Keyword'},
            {value: 'Tunisia ', type:'Keyword'},
            {value: 'western intervention ', type:'Keyword'},
            {value: 'uprisings ', type:'Keyword'},
            {value: 'envoy ', type:'Keyword'},
            {value: 'Clinton ', type:'Keyword'},
            {value: 'European Union ', type:'Keyword'},
            {value: 'security threat ', type:'Keyword'},
            {value: 'chaos ', type:'Keyword'},
            {value: 'violence ', type:'Keyword'},
            {value: 'executes ', type:'Keyword'},
            {value: 'Christians ', type:'Keyword'},
            {value: 'Arab spring ', type:'Keyword'},
            {value: 'reconstruction ', type:'Keyword'},
            {value: 'ceasefire ', type:'Keyword'},
            {value: 'constitution ', type:'Keyword'},
            {value: 'NATO ', type:'Keyword'},
            {value: 'rescue operation ', type:'Keyword'},
            {value: 'Benghazi ', type:'Keyword'},
            {value: 'ISIL', type:'Keyword'},
            {value: 'Tripoli parliament', type:'Keyword'},
            {value: 'government ', type:'Keyword'},
            {value: 'Together we build Libya', type:'Keyword'},
            {value: 'Washington ', type:'Keyword'},
            {value: 'Masrata', type:'Keyword'},
            {value: 'Muslim Brotherhood ', type:'Keyword'},
            {value: 'Libya Shield ', type:'Keyword'},
            {value: 'Entity / intrest', type:'Keyword'},
            {value: 'Interim government ', type:'Keyword'},
            {value: 'Military personnels ', type:'Keyword'},
            {value: 'Ibrahim El Dabashi ', type:'Keyword'},
            {value: 'Clashes', type:'Keyword'},
            {value: 'international organizations ', type:'Keyword'},
            {value: 'Human rights organizations ', type:'Keyword'},
            {value: 'Renaissance', type:'Keyword'},
            {value: 'Armed', type:'Keyword'},
            {value: 'Soldiers ', type:'Keyword'},
            {value: 'Arrest ', type:'Keyword'},
            {value: 'journalists ', type:'Keyword'},
            {value: 'peace talks ', type:'Keyword'},
            {value: 'International Criminal Court ', type:'Keyword'},
            {value: 'Amnesty ', type:'Keyword'},
            {value: 'Bernardino Leon', type:'Keyword'},
            {value: 'war planes', type:'Keyword'},
            {value: 'civil war ', type:'Keyword'},
            {value: 'jihadists ', type:'Keyword'},
            {value: 'civilians ', type:'Keyword'},
            {value: 'Allies ', type:'Keyword'},
            {value: 'proxy war ', type:'Keyword'},
            {value: 'suicide ', type:'Keyword'},
            {value: 'suicide bombing ', type:'Keyword'},
            {value: 'resolution ', type:'Keyword'},
            {value: 'rebels ', type:'Keyword'},
            {value: 'geneva ', type:'Keyword'},
            {value: 'troops ', type:'Keyword'},
            {value: 'humanitarian crisis ', type:'Keyword'},
            {value: 'foreign policy ', type:'Keyword'},
            {value: 'terror ', type:'Keyword'},
            {value: 'terrorism ', type:'Keyword'},
            {value: 'forces ', type:'Keyword'},
            {value: 'instability ', type:'Keyword'},
            {value: 'Invade', type:'Keyword'},
            {value: 'Middle East ', type:'Keyword'},
            {value: 'Political Dialogue', type:'Keyword'},
            {value: 'Public uprising', type:'Keyword'},
            {value: 'Arab League ', type:'Keyword'},
            {value: 'Economic downfall ', type:'Keyword'},
            {value: 'Suicide Attack ', type:'Keyword'},
            {value: 'illegal detention ', type:'Keyword'},
            {value: 'hostages', type:'Keyword'},
            {value: 'dialogue ', type:'Keyword'},
            {value: 'Third World War', type:'Keyword'},
            {value: 'opponent ', type:'Keyword'},
            {value: 'emergency ', type:'Keyword'},
            {value: 'death sentence ', type:'Keyword'},
            {value: 'press conference ', type:'Keyword'},
            {value: 'neo-colonial ', type:'Keyword'},
            {value: 'show trials ', type:'Keyword'},
            {value: 'shipwreck ', type:'Keyword'},
            {value: 'non-food items', type:'Keyword'},
            {value: 'vector control', type:'Keyword'},
            {value: 'Water Sanitation', type:'Keyword'},
            {value: 'expatriate', type:'Keyword'},
            {value: 'coordinator', type:'Keyword'},
            {value: 'jerrycan', type:'Keyword'},
            {value: 'patrol', type:'Keyword'},
            {value: 'intervention', type:'Keyword'},
            {value: 'Water, Sanitation and Hygiene', type:'Keyword'},
            {value: 'empowerment', type:'Keyword'},
            {value: 'gender', type:'Keyword'},
            {value: 'emergency response', type:'Keyword'},
            {value: 'peacekeeping', type:'Keyword'},
            {value: 'awareness', type:'Keyword'},
            {value: 'mission', type:'Keyword'},
            {value: 'call sign', type:'Keyword'},
            {value: 'camp', type:'Keyword'},
            {value: 'mesh tank', type:'Keyword'},
            {value: 'logistics', type:'Keyword'},
            {value: 'evacuation', type:'Keyword'},
            {value: 'demilitarized zone', type:'Keyword'},
            {value: 'camouflage netting', type:'Keyword'},
            {value: 'bladder tank', type:'Keyword'},
            {value: 'charter', type:'Keyword'},
            {value: 'survey mission', type:'Keyword'},
            {value: 'logistics base', type:'Keyword'},
            {value: 'radio operator', type:'Keyword'},
            {value: 'Non-Governmental Organization', type:'Keyword'},
            {value: 'main supply route', type:'Keyword'},
            {value: 'Missing people ', type:'Keyword'},
            {value: 'Detention', type:'Keyword'},
            {value: 'Refugees', type:'Keyword'},
            {value: 'Displaced populations', type:'Keyword'},
            {value: 'NGOs', type:'Keyword'},
            {value: 'United Nations ', type:'Keyword'},
            {value: 'Human Rights ', type:'Keyword'},
            {value: 'Women', type:'Keyword'},
            {value: 'Legal violations ', type:'Keyword'},
            {value: 'International Law', type:'Keyword'},
            {value: 'Colonization ', type:'Keyword'},
            {value: 'Collective Security', type:'Keyword'},
            {value: 'Children', type:'Keyword'}]];
            
          return Rx.Observable.from(testData);
  },
  
  getSentimentDisperityDataSet(fromDate, toDate, dataType){
      let response = [[{dataType: 'Keyword', dataValue: '#refugees', a: 6, h: 2, occurences: 450},
                       {dataType: 'Keyword', dataValue: '#women', a: 3, h: 7, occurences: 150},
                       {dataType: 'Keyword', dataValue: '#ISIS', a: 1, h: 3, occurences: 1250},
                       {dataType: 'Keyword', dataValue: '#famine', a: 2, h: 7, occurences: 4350},
                       {dataType: 'Keyword', dataValue: '#benghazi', a: 4, h: 8, occurences: 2150},]]

      return Rx.Observable.from(response);
  },
  
  getSentimentTreeData(type, filteredValue, fromDate, toDate){
      let testData = [[{
          sentimentText: "Early Recovery",
          eventCount: 3000,
          nodes: [
              {
                sentimentText: "Infrastructure",
                eventCount: 1200,
                nodes: [
                        {
                            sentimentText: "damaged",
                            eventCount: 700,
                            nodes: [{
                                sentimentText: "destroyed",
                                eventCount: 500
                            }]
                        },
               ]
             },
             {
                sentimentText: "Markets",
                eventCount: 800,
                nodes: [
                        {
                            sentimentText: "functional",
                            eventCount: 500,
                            nodes: [{
                                sentimentText: "non-functional",
                                eventCount: 300
                            }]
                        },
               ]
             },
             {
                sentimentText: "Jobs",
                eventCount: 1000,
                nodes: [
                        {
                            sentimentText: "unemployment",
                            eventCount: 500,
                            nodes: [{
                                sentimentText: "youth",
                                eventCount: 300
                            }]
                        },
               ]
             }
          ]
      },
      {
          sentimentText: "Education",
          eventCount: 500,
          nodes: [
              {
                sentimentText: "Schools",
                eventCount: 100,
                nodes: [
                        {
                            sentimentText: "destroyed",
                            eventCount: 70,
                            nodes: [{
                                sentimentText: "damaged",
                                eventCount: 20
                            }]
                        },
               ]
             },
             {
                sentimentText: "Children",
                eventCount: 200,
                nodes: [
                        {
                            sentimentText: "classes",
                            eventCount: 100,
                            nodes: [{
                                sentimentText: "teachers",
                                eventCount: 0
                            }]
                        },
               ]
             },
             {
                sentimentText: "Books",
                eventCount: 1000,
                nodes: [
                        {
                            sentimentText: "materials",
                            eventCount: 500,
                            nodes: [{
                                sentimentText: "training",
                                eventCount: 100
                            }]
                        },
               ]
             }
          ]
      }]];
      
      return Rx.Observable.from(testData);
  },
  
  getTrendingKeywords: function(){
      let testData =[[{
        "id": 1,
        "trendingType": "Status",
        "trendingValue": "#women",
        "trendingTimespan": "for 5 mins",
        "trendingVolume": 33,
        "source": "twitter"
        }, {
        "id": 2,
        "trendingType": "Group",
        "trendingValue": "#women",
        "trendingTimespan": "the last hour",
        "trendingVolume": 11,
        "source": "facebook"
        }, {
        "id": 3,
        "trendingType": "Keyword",
        "trendingValue": "#refugees",
        "trendingTimespan": "for 2 hours",
        "trendingVolume": 29,
        "source": "facebook"
        }, {
        "id": 4,
        "trendingType": "Status",
        "trendingValue": "#hunger",
        "trendingTimespan": "for 4 hours",
        "trendingVolume": 16,
        "source": "twitter"
        }, {
        "id": 5,
        "trendingType": "Keyword",
        "trendingValue": "#ISIS",
        "trendingTimespan": "since 8/27/2015",
        "trendingVolume": 19,
        "source": "twitter"
        }, {
        "id": 6,
        "trendingType": "Status",
        "trendingValue": "#hunger",
        "trendingTimespan": "since 2/10/2016",
        "trendingVolume": 29,
        "source": "twitter"
        }, {
        "id": 7,
        "trendingType": "Group",
        "trendingValue": "#hunger",
        "trendingTimespan": "since 5/5/2015",
        "trendingVolume": 24,
        "source": "facebook"
        }, {
        "id": 8,
        "trendingType": "Group",
        "trendingValue": "#refugees",
        "trendingTimespan": "since 9/10/2015",
        "trendingVolume": 2,
        "source": "twitter"
        }, {
        "id": 9,
        "trendingType": "Keyword",
        "trendingValue": "#women",
        "trendingTimespan": "7/9/2015",
        "trendingVolume": 19,
        "source": "facebook"
        }, {
        "id": 10,
        "trendingType": "Group",
        "trendingValue": "#refugees",
        "trendingTimespan": "7/1/2015",
        "trendingVolume": 9,
        "source": "twitter"
        }, {
        "id": 11,
        "trendingType": "Keyword",
        "trendingValue": "#ISIS",
        "trendingTimespan": "12/22/2015",
        "trendingVolume": 19,
        "source": "twitter"
        }, {
        "id": 12,
        "trendingType": "Status",
        "trendingValue": "#hunger",
        "trendingTimespan": "9/14/2015",
        "trendingVolume": 47,
        "source": "facebook"
        }, {
        "id": 13,
        "trendingType": "Keyword",
        "trendingValue": "#refugees",
        "trendingTimespan": "8/25/2015",
        "trendingVolume": 1,
        "source": "twitter"
        }, {
        "id": 14,
        "trendingType": "Group",
        "trendingValue": "#hunger",
        "trendingTimespan": "3/26/2015",
        "trendingVolume": 41,
        "source": "facebook"
        }, {
        "id": 15,
        "trendingType": "Group",
        "trendingValue": "#displacement",
        "trendingTimespan": "9/13/2015",
        "trendingVolume": 44,
        "source": "twitter"
        }, {
        "id": 16,
        "trendingType": "Group",
        "trendingValue": "#refugees",
        "trendingTimespan": "1/5/2016",
        "trendingVolume": 14,
        "source": "twitter"
        }, {
        "id": 17,
        "trendingType": "Group",
        "trendingValue": "#refugees",
        "trendingTimespan": "10/2/2015",
        "trendingVolume": 16,
        "source": "facebook"
        }, {
        "id": 18,
        "trendingType": "Status",
        "trendingValue": "#women",
        "trendingTimespan": "1/30/2016",
        "trendingVolume": 40,
        "source": "facebook"
        }, {
        "id": 19,
        "trendingType": "Group",
        "trendingValue": "#displacement",
        "trendingTimespan": "11/28/2015",
        "trendingVolume": 50,
        "source": "facebook"
        }, {
        "id": 20,
        "trendingType": "Group",
        "trendingValue": "#displacement",
        "trendingTimespan": "6/12/2015",
        "trendingVolume": 37,
        "source": "facebook"
        }]];
      
      return Rx.Observable.from(testData);
  },
  
  getActivityEvents: function(categoryValue, categoryType, fromDate, toDate){
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
  
  getHeatmapTiles: function(url){
    var testData = [[{"11_688_1103":{"a":0,"c":0,"d":0,"f":0,"h":7,"sp":6,"n":7,"s":0, "timestamp": "10/11/2015 12:32", occurences: 50}},{"10_345_546":{"a":0, "timestamp": "10/11/2015 10:32", occurences: 6,"c":0,"d":0,"f":0,"h":0,"sp":0,"n":0,"s":7}},{"11_685_1102":{"a":7,"c":0,"d":1,"f":8,"h":6,"sp":3,"n":5,"s":3, "timestamp": "10/11/2015 09:32", occurences: 500}},{"10_351_546":{"a":0, "timestamp": "10/11/2015 12:12", occurences: 12,"c":0,"d":0,"f":1,"h":0,"sp":6,"n":0,"s":5}},{"11_680_1093":{"a":1, "timestamp": "10/11/2015 12:22", occurences: 35,"c":0,"d":0,"f":0,"h":0,"sp":0,"n":9,"s":0}},{"10_345_551":{"a":0, "timestamp": "10/11/2015 12:32", occurences: 50,"c":0,"d":0,"f":0,"h":2,"sp":6,"n":0,"s":0}},{"10_338_547":{"a":0, "timestamp": "10/11/2015 12:30", occurences: 1000,"c":0,"d":0,"f":0,"h":0,"sp":0,"n":3,"s":0}},{"10_351_544":{"a":0,"timestamp": "10/11/2015 10:32", occurences: 23,"c":0,"d":5,"f":0,"h":0,"sp":0,"n":0,"s":0}},{"11_679_1103":{"a":0,"timestamp": "10/11/2015 10:32", occurences: 7,"c":0,"d":0,"f":0,"h":1,"sp":1,"n":0,"s":5}},{"11_673_1100":{"a":7,"timestamp": "10/11/2015 10:32", occurences: 9,"c":0,"d":3,"f":0,"h":6,"sp":4,"n":2,"s":3}},{"11_684_1090":{"a":0,"timestamp": "10/11/2015 10:32", occurences: 23,"c":0,"d":0,"f":0,"h":5,"sp":0,"n":0,"s":0}},{"10_342_551":{"a":5,"timestamp": "10/11/2015 10:32", occurences: 12,"c":0,"d":1,"f":0,"h":3,"sp":7,"n":4,"s":2}},{"10_342_552":{"a":0,"timestamp": "10/11/2015 10:32", occurences: 8,"c":0,"d":0,"f":0,"h":1,"sp":0,"n":2,"s":0}},{"11_672_1098":{"a":4,"timestamp": "10/11/2015 10:32", occurences: 13,"c":0,"d":4,"f":4,"h":5,"sp":4,"n":4,"s":4}},{"11_683_1094":{"a":9,"timestamp": "10/11/2015 10:32", occurences: 15,"c":0,"d":0,"f":0,"h":0,"sp":0,"n":0,"s":0}},{"11_672_1099":{"a":6,"timestamp": "10/11/2015 10:32", occurences: 14,"c":0,"d":4,"f":4,"h":5,"sp":5,"n":3,"s":8}},{"10_341_547":{"a":3,"timestamp": "10/11/2015 10:32", occurences: 16,"c":0,"d":4,"f":0,"h":4,"sp":0,"n":3,"s":0}},{"10_336_549":{"a":4,"timestamp": "10/11/2015 10:32", occurences: 54,"c":0,"d":5,"f":4,"h":5,"sp":5,"n":4,"s":4}},{"11_702_1088":{"a":0,"timestamp": "10/11/2015 10:32", occurences: 12,"c":0,"d":5,"f":0,"h":0,"sp":0,"n":0,"s":0}},{"10_340_545":{"a":0,"timestamp": "10/11/2015 10:32", occurences: 43,"c":0,"d":0,"f":0,"h":0,"sp":0,"n":0,"s":0}},{"11_682_1095":{"a":0,"timestamp": "10/11/2015 10:32", occurences: 65,"c":0,"d":0,"f":0,"h":6,"sp":0,"n":0,"s":0}},{"11_682_1094":{"a":8,"timestamp": "10/11/2015 10:32", occurences: 65,"c":0,"d":1,"f":0,"h":6,"sp":0,"n":5,"s":0}},{"10_340_546":{"a":1,"timestamp": "10/11/2015 10:32", occurences: 23,"c":0,"d":1,"f":0,"h":0,"sp":0,"n":4,"s":0}},{"11_691_1102":{"a":0,"timestamp": "10/11/2015 10:32", occurences: 52,"c":0,"d":0,"f":0,"h":4,"sp":5,"n":0,"s":0}},{"11_681_1092":{"a":0,"timestamp": "10/11/2015 10:32", occurences: 25,"c":0,"d":5,"f":0,"h":0,"sp":0,"n":0,"s":0}},{"10_336_550":{"a":6,"timestamp": "10/11/2015 10:32", occurences: 15,"c":0,"d":3,"f":5,"h":4,"sp":5,"n":4,"s":5}},{"11_681_1091":{"a":0,"timestamp": "10/11/2015 10:32", occurences: 45,"c":0,"d":0,"f":0,"h":0,"sp":6,"n":0,"s":0}},{"10_342_545":{"a":0,"timestamp": "10/11/2015 10:32", occurences: 75,"c":0,"d":0,"f":0,"h":5,"sp":0,"n":0,"s":0}},{"10_344_551":{"a":0,"timestamp": "10/11/2015 10:32", occurences: 21,"c":0,"d":0,"f":0,"h":8,"sp":1,"n":6,"s":0}},{"11_690_1093":{"a":0,"timestamp": "10/11/2015 10:32", occurences: 11,"c":0,"d":0,"f":0,"h":0,"sp":0,"n":0,"s":0}},{"10_339_551":{"a":0,"timestamp": "10/11/2015 10:32", occurences: 12,"c":0,"d":0,"f":0,"h":4,"sp":4,"n":0,"s":5}},{"11_677_1094":{"a":0,"timestamp": "10/11/2015 10:32", occurences: 15,"c":0,"d":0,"f":0,"h":0,"sp":0,"n":8,"s":0}},{"11_672_1100":{"a":2,"timestamp": "10/11/2015 10:32", occurences: 25,"c":0,"d":6,"f":7,"h":4,"sp":7,"n":4,"s":5}},{"11_672_1101":{"a":5,"timestamp": "10/11/2015 10:32", occurences: 9,"c":0,"d":6,"f":3,"h":6,"sp":5,"n":5,"s":5}},{"11_684_1105":{"a":0,"timestamp": "10/11/2015 10:32", occurences: 3,"c":0,"d":0,"f":0,"h":2,"sp":0,"n":8,"s":0}},{"11_703_1092":{"a":0,"timestamp": "10/11/2015 10:32", occurences: 10,"c":0,"d":0,"f":5,"h":0,"sp":4,"n":0,"s":8}}]];
    
    return Rx.Observable.from(testData);
  },
}
