import {Base} from './base.js';
import { paramTypes } from './_types.js';

export class Record extends Base {
  get params() {
    return _.extend(super.params, {
      to: {
        type: paramTypes.string
      }
    });
  }
}
