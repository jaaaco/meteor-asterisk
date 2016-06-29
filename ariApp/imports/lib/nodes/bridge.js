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

  job () {
    console.log('Running Bridge Node');
    this.ari.Bridge().create({type: 'mixing'}).then(bridge => {
      console.log('Bridge created', bridge.id);
      this.resolve(
        'success',
        {saveVar: {
          [this.node.params.saveIn]: bridge.id
        }}
      );
    }).catch(err => {
      console.log('Bridge create error', err);
      this.resolve('error');
    });
  }
}
