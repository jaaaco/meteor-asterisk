import {default as client} from 'ari-client';
import {Meteor} from 'meteor/meteor';

import {Nodes} from '../api/nodes/nodes.js';
import {Nodes as NodeTypes} from '../lib/nodes';
import {Workflows} from '../api/workflows/workflows.js';

import {default as Fiber} from 'fibers';
import {EJSON} from 'meteor/ejson';

function injectParams(appArgs, vars) {
  console.log('ip', appArgs, vars);
  _.forEach(appArgs.params, (param, key) => {
    console.log('keyp', key, param);
    if (param.split(':')[0] === 'var' && param.split(':')[1]) {
      appArgs.params[key] = vars[param.split(':')[1]];
    }
  });
  return appArgs;
}

client.connect(
  'http://' + Meteor.settings.ari.host + ':' + Meteor.settings.ari.port,
  Meteor.settings.ari.username,
  Meteor.settings.ari.password
).then(ari => {

  ari.on('StasisStart', (event, channel) => {
    // checking intent


    if (channel.dialplan.exten === 'h') {
      console.log('Channel hangup');
      return;
    }

    console.log('new channel', event);


    Fiber(function () {

      // find matching workflow
      let workflow;
      let workflowVars = {};

      let appArgs = event.args[0] ? EJSON.parse(new Buffer(event.args[0], 'base64').toString()) : {};
      console.log('appArgs', appArgs);

      if (appArgs.workflow) {
        workflow = Workflows.findOne({name: appArgs.workflow});
      } else {
        workflow = Workflows.findOne({trigger: 'channel'});
      }

      if (!workflow) {
        console.log('No workflow found', channel);
        return;
      }

      console.log('Running workflow', workflow.name);

      if (appArgs.params) {
        _.extend(workflowVars, appArgs.params);
        console.log('workflowVars', workflowVars);
      }


      // find first node
      const node = Nodes.findOne({type: 'Start', 'Workflows._id': workflow._id});

      if (!node) {
        console.log('No starting node found', {type: 'Start', 'Workflows._id': workflow._id});
        return;
      }

      function runNode(nodeId) {
        Fiber(function (params) {
          let node = Nodes.findOne(params.nodeId);
          let event = params.event;
          let channel = params.channel;

          console.log('NODE', node);
          console.log('vars', workflowVars);

          const nodeClass = new NodeTypes[node.type](ari, node, workflowVars, {channel});

          nodeClass.run().then(result => {
            console.log('next', result.next, result.message);

            if (result.message && result.message.saveVar) {
              _.extend(workflowVars, result.message.saveVar);
              console.log('savedWorkflowVar', workflowVars);
            }
            runNode(result.next);
          }).catch(err => {
            console.log('Node run error', err);
          });

          
          // switch (node.type) {
          //   case 'answer':
          //     incoming.answer().then(() => {
          //       console.log('Channel answered');
          //       return runNode(node);
          //     }).catch(err => {
          //       console.log('Error answering channel', err);
          //     });
          //     break;
          //   case 'ring':
          //     incoming.ring().then(() => {
          //       console.log('Channel rang');
          //       return runNode(node);
          //     }).catch(err => {
          //       console.log('Error ringing channel', err);
          //     });
          //     break;
          //   case 'timeout':
          //     setTimeout(node => {
          //       return runNode(node);
          //     }, node.params.time, node);
          //     break;
          //   case 'hangup':
          //     incoming.hangup().then(() => {
          //       console.log('Channel hangup !');
          //       return runNode(node);
          //     }).catch(err => {
          //       console.log('Error hangup channel', err);
          //     });
          //     break;
          //   case 'bridge':
          //     ari.Bridge().create({type: node.params.type}).then(bridge => {
          //       console.log('Bridge created', bridge.id);
          //       if (node.params.var) {
          //         workflowVars[node.params.var] = bridge.id;
          //       }
          //       return runNode(node);
          //     }).catch(err => {
          //       console.log('Error hangup channel', err);
          //     });
          //     break;
          //   case 'addToBridge':
          //     ari.bridges.addChannel({
          //       bridgeId: injectParams(node, workflowVars).params.bridge,
          //       channel: incoming.id
          //     }).then(() => {
          //       console.log('addToBridge success!');
          //       return runNode(node);
          //     }).catch(err => {
          //       console.log('addToBridge error', err);
          //     });
          //     break;
          //   case 'originate':
          //     var channel = ari.Channel();
          //     channel.originate({
          //       endpoint: (node.params.endpoint || 'SIP') + '/' + node.params.destination,
          //       app: 'hello-world',
          //       appArgs: new Buffer(EJSON.stringify(injectParams(node.params.appArgs, workflowVars))).toString('base64')
          //     })
          //       .then(function (channel) {
          //         console.log('outgoing channell created', channel.id);
          //         //mixingBridge.addChannel({channel: channel.id});
          //         return runNode(node);
          //       })
          //       .catch(function (err) {
          //         console.log('outgoing channell add to bridge error', err);
          //       });
          //     break;
          //
          // }

        }).run({nodeId, event, channel})


      }

      runNode(node, false);

      // // connection from internal
      // if (incoming.dialplan.exten != 'h' && incoming.dialplan.context === 'from-internal' && incoming.state == 'Ring') {
      //     console.log('new incoming channel', incoming.dialplan, incoming.id, incoming.state);
      //     incoming.answer()
      //         .then(function () {
      //             incoming.ring();
      //         })
      //         .catch(function (err) {
      //             console.log('ERROR answer', err);
      //         });
      // } else {
      //     console.log('other channel',incoming.dialplan, incoming.id, incoming.state);
      // }
    }).run();

  });

  // can also use ari.start(['app-name'...]) to start multiple applications
  ari.start('hello-world');
}).catch(err => {
  console.log('connect error', err);
})
  .done();

