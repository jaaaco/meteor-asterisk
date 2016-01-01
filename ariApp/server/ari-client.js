let client = Meteor.npmRequire('ari-client');

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

client.connect('http://' + Meteor.settings.ari.host + ':'
    + Meteor.settings.ari.port, Meteor.settings.ari.username, Meteor.settings.ari.password)
    .then(function (ari) {
        // use once to start the application

        var mixingBridge  = ari.Bridge();
        mixingBridge.create({type: 'mixing'});

        ari.on('StasisStart',
            function (event, incoming) {



                if (incoming.dialplan.exten != 'h' && incoming.dialplan.context === 'from-internal' && incoming.state == 'Ring') {
                    console.log('new incoming channel', incoming.dialplan, incoming.id, incoming.state);

                    incoming.answer()
                        .then(function () {
                            incoming.on('StasisEnd', function(event, channel){
                                if (channel.dialplan.exten != 'h') {
                                    console.log('StasisEnd', channel.dialplan, channel.id);
                                }
                            });

                            ringFor(incoming, 2).then(()=>{
                                mixingBridge.addChannel({channel: incoming.id});
                            });


                            console.log('channel answered');
                        })
                        .catch(function (err) {
                            console.log('ERROR answer', err);
                        });
                } else {
                    console.log('other channel',incoming.dialplan, incoming.id, incoming.state);
                }
            });


        function getOrCreateBridge (channel) {
            return ari.bridges.list()
                .then(function (bridges) {
                    var bridge = bridges.filter(function (candidate) {
                        return candidate['bridge_type'] === 'holding';
                    })[0];

                    if (!bridge) {
                        bridge = ari.Bridge();

                        return bridge.create({type: 'holding'});
                    } else {
                        // Add incoming channel to existing holding bridge and play
                        // music on hold
                        return bridge;
                    }
                });
        }

        /**
         *  Join holding bridge and play music on hold. An event listener is also
         *  setup to handle cleaning up the bridge once all channels have left it.
         *
         *  @function joinHoldingBridgeAndPlayMoh
         *  @memberof bridge-example
         *  @param {module:resources~Bridge} bridge -
         *    the holding bridge to add the channel to
         *  @param {module:resources~Channel} channel -
         *    the channel that entered Stasis
         *  @returns {Q} promise - a promise that will resolve once the channel
         *                         has been added to the bridge and moh has been
         *                         started
         */
        function joinHoldingBridgeAndPlayMoh (bridge, channel) {
            bridge.on('ChannelLeftBridge',
                /**
                 *  If no channel remains in the bridge, destroy it.
                 *
                 *  @callback channelLeftBridgeCallback
                 *  @memberof bridge-example
                 *  @param {Object} event - the full event object
                 *  @param {Object} instances - bridge and channel
                 *    instances tied to this channel left bridge event
                 */
                function (event, instances) {

                    var holdingBridge = instances.bridge;
                    if (holdingBridge.channels.length === 0 &&
                        holdingBridge.id === bridge.id) {

                        bridge.destroy()
                            .catch(function (err) {});
                    }
                });

            return bridge.addChannel({channel: channel.id})
                .then(function () {
                    return channel.startMoh();
                });
        }

        // can also use ari.start(['app-name'...]) to start multiple applications
        ari.start('hello-world');
    })
    .catch(function (err) {
        console.log('connect error', err);
    })
    .done();
