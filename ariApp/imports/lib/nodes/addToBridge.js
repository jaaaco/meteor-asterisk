import {Base} from './base.js';
import { paramTypes } from './_types.js';

export class AddToBridge extends Base {
  get params() {
    return _.extend(super.params, {
      bridge: {
        type: paramTypes.readVar
      }
    });
  }

  run () {
    return new Promise(resolve => {
      console.log('Running AddToBridge Node');
      this.ari.bridges.addChannel({
        bridgeId: this.vars[this.node.params.bridge],
        channel: this.channel.id
      }).then(() => {
        console.log('addToBridge success!');
        resolve({
          next:_.keys(this.node.connectors.success)[0]
        });
      }).catch(err => {
        console.log('addToBridge error', err);
        resolve({next: _.keys(this.node.connectors.error)[0]});
      });
    });
  }
}
