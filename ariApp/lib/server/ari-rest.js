var colors =  Meteor.npmRequire('colors');
var rest = Meteor.npmRequire('restler');

function ariDebug() {
    if (Meteor.settings.debug.ariRest) {
        console.log.apply(this,arguments);
    }
}

ARI = {
   post: function (url, data, callback) {
       ariDebug('ARI POST'.green, url, data);
       rest.post('http://' + Meteor.settings.ari.host + ':' + Meteor.settings.ari.port + '/ari/' + url, {
           username: Meteor.settings.ari.username,
           password: Meteor.settings.ari.password,
           data: data
       }).on('complete', function(data, response) {
           console.log(data);
           if (response && response.code == 200) {
               ariDebug('ARI RESPONSE'.green,data);
               //console.log('rest response', data);
               // you can get at the raw response like this...
               callback.call(this,data);
           } else {
               if (response && response.code) {
                   ariDebug('ARI ERROR'.red, code.code, data)
               }
           }
       });
   },
   get: function (url, callback) {
       ariDebug('ARI GET'.green, url);

       rest.get('http://' + Meteor.settings.ari.host + ':' + Meteor.settings.ari.port + '/ari/' + url, {
           username: Meteor.settings.ari.username,
           password: Meteor.settings.ari.password,
       }).on('complete', function(data, response) {
           //console.log('REST response code', response.rawEncoded);
           if (response && response.statusCode == 200) {
               ariDebug('ARI RESPONSE'.green,data);
               // you can get at the raw response like this...
               callback.call(this,data);
           } else {
               if (response && response.code) {
                   ariDebug('ARI ERROR'.red, response.code, data)
               }
           }
       });
   },
   del: function (url, callback) {
       ariDebug('ARI DEL'.green, url);

       rest.del('http://' + Meteor.settings.ari.host + ':' + Meteor.settings.ari.port + '/ari/' + url, {
           username: Meteor.settings.ari.username,
           password: Meteor.settings.ari.password,
       }).on('complete', function(data, response) {
           //console.log('REST response code', response.rawEncoded);
           if (response && response.statusCode == 200) {
               ariDebug('ARI RESPONSE'.green,data);
               // you can get at the raw response like this...
               callback.call(this,data);
           } else {
               if (response && response.code) {
                   ariDebug('ARI ERROR'.red, response.code, data)
               }
           }
       });
   }
};