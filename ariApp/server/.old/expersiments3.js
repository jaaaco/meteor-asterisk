let client = require('ari-client');

client.connect(url, 'username', 'password')
  .then(function (ari) {

    // create mixing bridge
    var bridge = {};


    ari.on('StasisStart',
      function (event, incomingChannel) {
        incomingChannel.answer(function (err, channel) {
          bridge.addChannel({channel: incoming.id}, function (err) {
          });
        });
      });

    console.log('connect OK');
    var channel = ari.Channel();
    channel.on('StasisStart', function (event, channel) {


      // read channel intent

      if (channel.variables.bridge) {
        ari.bridges.addChannel({
          bridgeId: channel.variables.bridge,
          channel: channel
        })
          .then(function () {

          })
      }

      ari.bridges.addChannel({
        bridgeId: bridge.id,
        channel: channel
      })
        .then(function () {
          console.log('addChannel OK');
          ari.bridges.startMoh({
            bridgeId: bridge.id
          })
            .then(function () {
              console.log('startMoh OK');


              // intent - originate
              ari.channels.originate(
                {
                  endpoint: 'ENDPOINT',
                  variables: {bridge: bridge.id}
                },
                function (err, channel) {

                }
              );

            })
            .catch(function (err) {
              console.log('startMoh error', err);
            });
        })
        .catch(function (err) {
          console.log('addChannel error', err);
        });


      console.log('StasisStart OK');
      var bridge = ari.Bridge();
      bridge.create()
        .then(function (bridge) {
          console.log('bridge created OK', bridge);
          ari.bridges.addChannel({
            bridgeId: bridge.id,
            channel: channel
          })
            .then(function () {
              console.log('addChannel OK');
              ari.bridges.startMoh({
                bridgeId: bridge.id
              })
                .then(function () {
                  console.log('startMoh OK');


                  // intent - originate
                  ari.channels.originate(
                    {
                      endpoint: 'ENDPOINT',
                      variables: {bridge: bridge.id}
                    },
                    function (err, channel) {

                    }
                  );

                })
                .catch(function (err) {
                  console.log('startMoh error', err);
                });
            })
            .catch(function (err) {
              console.log('addChannel error', err);
            });
        })
        .catch(function (err) {
          console.log('bridge create error', err);
        });


    });
  })
  .catch(function (err) {
    console.log('connect error', err);
  })
;
