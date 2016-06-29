import {Base} from './base.js';
import { paramTypes } from './_types.js';

export class Playback extends Base {
  get params() {
    return _.extend(super.params, {
      file: {
        type: paramTypes.string
      }
    });
  }
}
