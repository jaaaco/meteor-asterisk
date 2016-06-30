import {Base} from './base.js';
import { paramTypes } from './_types.js';

export class WaitForDtmf extends Base {
  get params() {
    return _.extend(super.params, {
      digit: {
        type: paramTypes.string
      },
      saveIn: {
        type: paramTypes.saveVar
      },
      timeout: {
        type: paramTypes.uint
      }
    });
  }
}
