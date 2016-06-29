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

  job () {
    console.log('Running AddToBridge Node');
    this.ari.bridges.addChannel({
      bridgeId: this.vars[this.node.params.bridge],
      channel: this.channel.id
    }).then(() => {
      console.log('addToBridge success!');
      this.resolve('success');
    }).catch(err => {
      console.log('addToBridge error', err);
      this.resolve('error');
    });
  }
}
