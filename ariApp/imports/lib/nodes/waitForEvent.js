import {Base} from './base.js';
import { paramTypes } from './_types.js';
import {_} from 'meteor/underscore';

export class WaitForEvent extends Base {
  get params() {
    return _.extend(super.params, {
      listenedEvent: {
        type: paramTypes.event
      },
      timeout: {
        type: paramTypes.uint
      }
    });
  }
}
