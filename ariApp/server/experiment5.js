let client = Meteor.npmRequire('ari-client');
let Fiber = Meteor.npmRequire("fibers");
let Ari = null;

function waitFor(seconds) {
    return new Promise((resolve) => {
        console.log('wait started');
        setTimeout((resolve)=>{
            console.log('wait stopped');
            resolve();
        },seconds * 1000, resolve);
    });
}

function ringFor(channel, seconds) {
    return new Promise((resolve) => {
        channel.ring().then(()=>{
            waitFor(seconds).then(()=>{
                channel.ringStop().then(()=>{
                    resolve();
                });
            });
        });
    });

}

Meteor.startup(() => {
    Channels.remove({});
    Actions.remove({});
});

client.connect('http://' + Meteor.settings.ari.host + ':'
        + Meteor.settings.ari.port, Meteor.settings.ari.username, Meteor.settings.ari.password)
    .then(function (ari) {
        // use once to start the application
        Ari = ari;

        var mixingBridge  = ari.Bridge();
        mixingBridge.create({type: 'mixing'});

        ari.on('StasisStart',
            function (event, incoming) {
                // checking intent

                // connection from internal
                if (incoming.dialplan.exten != 'h' && incoming.dialplan.context === 'from-internal' && incoming.state == 'Ring') {
                    console.log('new incoming channel', incoming.dialplan, incoming.id, incoming.state);
                    incoming.answer()
                        .then(function () {
                            console.log('channel answered');

                            Fiber((channel)=>{
                                let channelId = Channels.insert({
                                    id: channel.id,
                                    exten: channel.dialplan.exten
                                });

                                Actions.insert({
                                    Channels: {_id: channelId, id: channel.id},
                                    type: 'ring'
                                });

                                Actions.insert({
                                    Channels: {_id: channelId, id: channel.id},
                                    type: 'wait',
                                    time: 2
                                });

                                Actions.insert({
                                    Channels: {_id: channelId, id: channel.id},
                                    type: 'moh'
                                });

                            }).run(incoming);

                            incoming.on('ChannelHangupRequest', function(event, channel){
                                console.log('Channel Hangup', event.cause);
                            });

                            incoming.on('ChannelDtmfReceived', function (event, channel){
                                console.log('ChannelDtmfReceived', event.digit, event.duration_ms);
                            });


                        })
                        .catch(function (err) {
                            console.log('ERROR answer', err);
                        });
                } else {
                    console.log('other channel',incoming.dialplan, incoming.id, incoming.state);
                }
            });

        // can also use ari.start(['app-name'...]) to start multiple applications
        ari.start('hello-world');
    })
    .catch(function (err) {
        console.log('connect error', err);
    })
    .done();

function processNextAction(action) {
    console.log('processingAction', action);

    Actions.update(action._id, {$set: {running: true}});

    switch (action.type) {
        case 'ring':
            Ari.channels.ring(
                {channelId: action.Channels.id},
                function (err) {
                    console.log('Ring action error', err);
                }
            );
            Actions.remove(action._id);
            break;
    }

}

// TODO: kolejka na kolekcjach nie działa!!!
Actions.find().observe({
    added: function (action) {
        console.log('action queued', Actions.find({'Channels._id': action.Channels._id}).count());
        if (!Actions.find({'Channels._id': action.Channels._id, running: true}).count()) {
            processNextAction(action);
        }
    },
    removed: function (action) {
        var action = Actions.findOne();
        if (action) {
            processNextAction(action);
        }
    }
});
