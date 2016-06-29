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
      },
      workflowParam: {
        type: paramTypes.readVar
      }
    });
  }

  job () {
    this.ari.Channel().originate({
      timeout: this.node.params.timeout || 30000,
      endpoint: (this.node.params.endpoint || 'SIP') + '/' + this.node.params.destination,
      app: 'hello-world',
      appArgs: new Buffer(EJSON.stringify({
        workflow: this.node.params.workflow,
        params: { [this.node.params.workflowParam]: this.vars[this.node.params.workflowParam]}
      })).toString('base64')
    }).then(channel => {
      console.log('originate success');
      this.resolve('success',{saveVar: {
        [this.node.params.saveIn]: channel.id
      }});
    }).catch(err => {
      console.log('originate error', err);
      this.resolve('error');
    });
  }
}
