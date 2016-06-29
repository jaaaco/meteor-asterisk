import {Base} from './base.js';
import { paramTypes, connectorTypes } from './_types.js';
import {_} from 'meteor/underscore';

export class ListenEvent extends Base {
  get params() {
    return _.extend(super.params, {
      event: {
        type: paramTypes.event
      }
    });
  }

  get outputs() {
    return [
      {
        name: 'triggered',
        type: connectorTypes.success
      },
      {
        name: 'continue',
        type: connectorTypes.generic
      }
    ];
  }

  run () {
    return new Promise((resolve, reject) => {
      console.log('Running node ListenEvent STUB');
      resolve({next: _.keys(this.node.connectors.continue)[0]});
    });
  }
}
