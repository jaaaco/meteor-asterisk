import { Base } from './base.js';
import { paramTypes } from './_types.js';
import { EJSON } from 'meteor/ejson';

export class Originate extends Base {
  get params() {
    return _.extend(super.params, {
      timeout: {
        type: paramTypes.uint
      },
      destination: {
        type: paramTypes.string
      },
      endpoint: {
        type: paramTypes.string
      },
      workflow: {
        type: paramTypes.workflow
      },
      saveIn: {
        type: paramTypes.saveVar
      }
    });
  }

  run () {
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

    return new Promise(resolve => {
      this.ari.Channel().originate({
        timeout: this.node.params.timeout || 30000,
        endpoint: (this.node.params.endpoint || 'SIP') + '/' + this.node.params.destination,
        app: 'hello-world',
        appArgs: new Buffer(EJSON.stringify(_.extend(this.vars, {workflow: this.node.params.workflow}))).toString('base64')
      }).then(channel => {
        console.log('originate success');
        resolve({
          next:_.keys(this.node.connectors.success)[0],
          message: {saveVar: {
            [this.node.params.saveIn]: channel.id
          }}
        });
      }).catch(err => {
        console.log('originate error', err);
        resolve({next: _.keys(this.node.connectors.error)[0]});
      });
    });
  }
}
