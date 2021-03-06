import {Base} from './base.js';
import { paramTypes } from './_types.js';

export class Speech extends Base {
  get params() {
    return _.extend(super.params, {
      text: {
        type: paramTypes.string
      }
    });
  }
}
