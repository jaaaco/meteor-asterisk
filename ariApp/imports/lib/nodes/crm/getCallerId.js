import { CrmBase } from './base.js';
import { connectorTypes, paramTypes } from '../_types.js';

export class GetCallerId extends CrmBase {
  get params() {
    return _.extend(super.params, {
      number: {
        type: paramTypes.readVar
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
