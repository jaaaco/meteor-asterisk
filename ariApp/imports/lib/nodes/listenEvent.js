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

  job () {
    console.log('Running node ListenEvent STUB');
    this.resolve('continue');
  }
}
