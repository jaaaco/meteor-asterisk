function ariDebug() {
    if (Meteor.settings.debug.ariClient) {
        console.log.apply(this,arguments);
    }
}

class Channel {
    constructor(id) {
        this.id = id;
    }

    ring(timeSeconds) {
        ARI.post('channels/' + this.id + '/ring');

        return new Promise((resolve, reject) => {
            _.delay(resolve,1000 * timeSeconds,this);
        });
    }

    wait(timeSeconds) {
        return new Promise((resolve, reject) => {
            _.delay(resolve,1000 * timeSeconds,this);
        });
    }

    answer() {
        ARI.post('channels/' + this.id + '/answer');
        return new Promise((resolve, reject) => {
            resolve();
        });
    }

    hangup() {
        ARI.del('channels/' + this.id);
        return new Promise((resolve, reject) => {
            resolve();
        });
    }
}

class Room {
    constructor(channelId) {
        this.channels = [];

        var channel = new Channel(channelId);

        channel.ring(4).then(() => channel.answer()).then(() => channel.wait(3)).then(() => channel.hangup());

        //ARI.post('bridges',{type: 'mixing,proxy_media'}, (bridge) => {
        //    console.log('cb', this);
        //    this.id = bridge.id;
        //    //ARI.post('bridges/' + bridge.id + '/moh');
        //    //this.addChannel(channel);
        //
        //    ARI.post('channels/' + channel.id + '/answer');
        //    ARI.post('channels/' + channel.id + '/moh');
        //});
    }

    addChannel(channel) {
        this.channels.push(channel);
        ARI.post('bridges/'+this.id+'/addChannel', { channel: channel.id});
    }

    dial(number,options = {}) {

    }
}

AriMessages.find().observe({
    added: function (m) {
        ariDebug('Message received'.red, m.type.grey);
        AriMessages.remove(m._id);

        switch (m.type) {
            case 'ChannelStateChange':
                break;
            case 'StasisStart':
                // połączenie pochodzi od centralki z wewnątrz
                if (m.channel.dialplan.context == 'from-internal') {





                    if (m.channel.dialplan.exten != 'h') {
                        ariDebug('Internal call'.green, m.channel.caller.number.green, m.channel.id.grey);
                        ariDebug('to number'.green, m.channel.dialplan.exten.green, m.channel.id.grey);

                        ariDebug(m.channel);

                        var room = new Room(m.channel.id);
                    }

                    //room.dial(m.channel.dialplan.exten);


                        //var messageData = {
                        //    date: +(moment().toDate()),
                        //    type: 'call',
                        //    subType: channel.dialplan.exten.length == 3 ? 'internal' : 'internal',
                        //    status: 'waiting',
                        //    to: [channel.dialplan.exten],
                        //    from: channel.caller.number
                        //};
                        //
                        //var messageUser = Meteor.users.findOne({'profile.extension': channel.caller.number});
                        //
                        //if (messageUser) {
                        //    messageData = _.extend(messageData, {users: {_id: messageUser._id}});
                        //}
                        //
                        //var _id = Messages.insert(messageData);
                        //
                        //var _id = Channels.insert({
                        //    type: 'source',
                        //    Messages: {_id: _id},
                        //    id: channel.id,
                        //    name: channel.name,
                        //    dialplan: channel.dialplan,
                        //    ring: true
                        //});


                }
                break;
        }
    }
});