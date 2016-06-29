import {Base} from './base.js';
import { paramTypes } from './_types.js';
import {_} from 'meteor/underscore';

export class Workflow extends Base {
  get params() {
    return _.extend(super.params, {
      workflow: {
        type: paramTypes.workflow
      }
    });
  }
}
