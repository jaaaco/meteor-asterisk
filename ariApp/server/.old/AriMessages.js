function ariDebug() {
  if (Meteor.settings.debug.ariClient) {
    console.log.apply(this, arguments);
  }
}

class Channel {
  constructor(id) {
    this.id = id;

    var types = [
      'ChannelDtmfReceived',
      'ChannelDestroyed',
      'ChannelEnteredBridge',
      'ChannelHangupRequest',
      'ChannelStateChange'
    ];

    this.observer = AriMessages.find({id: this.id, type: {$in: types}}).observe({
      added: (m) => {
        switch (m.type) {
          case 'ChannelStateChange':
            this.onAnswer.call(this);
            break;
          case 'ChannelDestroyed':
            this.onHangup.call(this);
            break;
          case 'ChannelDtmfReceived':
            this.onDtmf(this); // TODO: pass digit
            break;
        }
      }
    });
  }

  ring(timeSeconds) {
    ARI.post('channels/' + this.id + '/ring');

    return new Promise((resolve, reject) => {
      _.delay(resolve, 1000 * timeSeconds, this);
    });
  }

  wait(timeSeconds) {
    return new Promise((resolve, reject) => {
      _.delay(resolve, 1000 * timeSeconds, this);
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

    channel.onHangup = () => {

    };

    channel.onAnswer = () => {

    };

    channel.ring(4).then(() => channel.answer());


    var destinationChannel1 = new Channel();
    var destinationChannel2 = new Channel();
    var destinationChannel3 = new Channel();

    var c1p = destinationChannel1.originate('301');
    var c2p = destinationChannel2.originate('302');
    var c3p = destinationChannel3.originate('303');

    Promise.race([c1p, c2p, c3p]).then(
      (c) => {
        // close other channels
        this.addChannel(c);

      }
    );


    //.then(
    //        // success
    //        () => {
    //            this.addChannel(channel);
    //            this.addChannel(destinationChannel);
    //            this.startNormalOperation();
    //        },
    //
    //        // fail
    //        () => {
    //            channel.busy();
    //            channel.wait(3);
    //            channel.hangup();
    //        }
    //    );


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

  startNormalOperation() {

  }

  addChannel(channel) {
    this.channels.push(channel);
    ARI.post('bridges/' + this.id + '/addChannel', {channel: channel.id});
  }

  dial(number, options = {}) {

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

            Channels.insert(_.extend(_.pick(m.channel, 'id'), {intent: 'internalConnection'}));


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
