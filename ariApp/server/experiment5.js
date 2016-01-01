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

                                Actions.channelAdd(channel.id,'ring');
                                Actions.channelAdd(channel.id,'wait', {time: 2});
                                Actions.channelAdd(channel.id,'moh');

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
            //Actions.remove(action._id);
            break;
    }

}

let queues = {};

class Queue {
    constructor(id) {
        this.actions = [];
        this.id = id;
        this.started = false;
    }

    add(action) {
        this.actions.push(action);
        //console.log('Queue add', this.id, action.type);
        this.start();
    }

    start() {
        if (this.started) {
            return;
        }
        this.started = true;

        console.log('Queue', this.id, 'started');

        let action = false;
        while (action = _.first(this.actions)) {
            this.actions = this.actions.slice(1);
            console.log('doing action', action.type);
        }

        this.started = false;
    }
}

// TODO: kolejka na kolekcjach nie działa!!!
Actions.find().observe({
    added: function (action) {
        if (!queues[action.Channels.id]) {
            queues[action.Channels.id] = new Queue(action.Channels.id);
        }
        queues[action.Channels.id].add(action);
    }
});

_.extend(Actions,{
    channelAdd(channelId, type, params) {
        Actions.insert(_.extend({
            Channels: {id: channelId},
            type,
            sequence: Actions.find({'Channels.id': channelId}).count()
        },params));
    }
});

// https://github.com/CollectionFS/Meteor-power-queue