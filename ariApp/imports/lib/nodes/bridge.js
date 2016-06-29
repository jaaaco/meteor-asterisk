import {Base} from './base.js';
import { paramTypes } from './_types.js';

export class Bridge extends Base {
  get params() {
    return _.extend(super.params, {
      saveIn: {
        type: paramTypes.saveVar
      }
    });
  }

  run () {
    return new Promise(resolve => {
      console.log('Running Bridge Node');
      this.ari.Bridge().create({type: 'mixing'}).then(bridge => {
        console.log('Bridge created', bridge.id);
        resolve({
          next:_.keys(this.node.connectors.success)[0],
          message: {saveVar: {
            [this.node.params.saveIn]: bridge.id
          }}
        });
      }).catch(err => {
        console.log('Bridge create error', err);
        resolve({next: _.keys(this.node.connectors.error)[0]});
      });
    });
  }
}
