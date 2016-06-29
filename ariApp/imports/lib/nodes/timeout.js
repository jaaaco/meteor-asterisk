import {Base} from './base.js';
import { paramTypes } from './_types.js';
import {_} from 'meteor/underscore';

export class Timeout extends Base {
  get params() {
    return _.extend(super.params, {
      timeout: {
        type: paramTypes.uint
      }
    });
  }

  job() {
    setTimeout(() => {
      this.resolve('success');
    }, this.node.params.timeout || 1000);
  }
}
