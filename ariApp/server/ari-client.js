var client = Meteor.npmRequire('ari-client');
Fiber = Meteor.npmRequire("fibers");
var colors =  Meteor.npmRequire('colors');

Status.find({type: 'ariClient', status: 'restart'}).observe({
    added: function(status) {
        startWS();
    }
});

function ariDebug() {
    if (Meteor.settings.debug.ariClient) {
        console.log.apply(this,arguments);
    }
}

function startWS() {
    var WebSocket = Meteor.npmRequire('ws');
    var ws = new WebSocket(
        'ws://' + Meteor.settings.ari.host + ':'
        + Meteor.settings.ari.port + '/ari/events?api_key='
        + Meteor.settings.ari.username
        + ':' + Meteor.settings.ari.password+'&app=hello-world');

    ws.on('error', function(err){
        Fiber(function (err) {
            Status.update({type: 'ariClient'},{$set: {status: 'error', lastError: err}});
        }).run(err);
    });

    ws.on('close', function (e) { // something went wrong
        Fiber(function () {
            Status.update({type: 'ariClient'},{$set: {status: 'down'}});
        }).run();
    });

    ws.on('open', function() {
        ariDebug('WS Connected'.green);
        Fiber(function () {
            Status.update({type: 'ariClient'},{$unset: {lastError: ''}, $set: {status: 'up'}});
        }).run();
    });

    ws.on('message', function(data, flags) {
        var data = {};
        try {
            data = EJSON.parse(data);
        } catch (e) {
            ariDebug('JSON Parse failed');
        }

        ariDebug('Message received'.red, data.type.grey);

        switch (data.type) {
            case 'ChannelDtmfReceived':
            case 'PlaybackFinished':
            case 'StasisStart':
            case 'StasisEnd':
            case 'ChannelDestroyed':
            case 'ChannelEnteredBridge':

                Fiber(function (data) {
                    AriMessages.insert(data);
                }).run(data);

                break;
        }


    });
}