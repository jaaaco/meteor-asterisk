import {Base} from './base.js';
import { connectorTypes, paramTypes } from './_types.js';

export class TimeCondition extends Base {
  get params() {
    return _.extend(super.params, {
      timeGte: {
        type: paramTypes.string
      }
    });
  }

  get outputs() {
    return [
      {
        name: 'true',
        type: connectorTypes.success
      },
      {
        name: 'false',
        type: connectorTypes.generic
      }
    ];
  }
}
