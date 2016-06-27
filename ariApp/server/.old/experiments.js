Actions = new Mongo.Collection('Actions');

var channelObservers = {};

Channels.find({intent: 'internal'}).observe({
  added: function (c) {

    Actions.insert({type: 'ChannelsRing', time: 4, Channels: {_id: c._id}});
    Actions.insert({type: 'ChannelsAnswer', Channels: {_id: c._id}});
    Actions.insert({type: 'ChannelsPlayback', time: 4, Channels: {_id: c._id}, sound: 'welcome'});
    Actions.insert({type: 'ChannelsRing'});

    Channels.insert({intent: 'outgoing', phone: '....', 'Lines._id': ''});
  }
});

Channels.find({intent: 'outgoing'}).observe({
  added: function (c) {
    ARI.post('channels/originate/...');

  }
});

// odebrano słuchawkę
Channels.find({intent: 'outgoing', 'status': 'Up'}).observe({
  added: function (c) {
    // rozłączenie pozostałych kanałów
    // wyłączenie dzwonienia na internalu
    // złączenie kanałów na bridgeu
  }
});

// przerwano połączenie z jakiegoś powodu
Channels.find({intent: 'outgoing', 'status': 'Down'}).observe({
  added: function (c) {

  }
});


Channels.find().observe({
  added: function (c) {
    var types = [
      'ChannelDtmfReceived',
      'ChannelDestroyed',
      'ChannelEnteredBridge',
      'ChannelHangupRequest',
      'ChannelStateChange'
    ];

    channelObservers[c._id] = AriMessages.find({id: this.id, type: {$in: types}}).observe({
      added: (m) => {
        switch (m.type) {
          case 'ChannelLeftBridge':
            Channels.update({id: m.id}, {$unset: {'Bridges._id': '', bridged: true}});
            break;
          case 'ChannelEnteredBridge':
            Channels.update({id: m.id}, {$set: {bridged: true}});
            break;
          case 'ChannelStateChange':
            // TODO update state
            break;
          case 'ChannelDestroyed':
            channelObservers[c._id].stop();
            break;
          case 'ChannelDtmfReceived':
            // TODO save dtmf queue
            break;
        }
      }
    });
  },
  removed: function (c) {
    // ARI.del('channels/id);
  }
});
