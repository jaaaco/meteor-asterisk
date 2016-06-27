import {Base} from './base.js';

export class Originate extends Base {
  constructor() {
    super();
  }
  get params() {
    return _.extend(super.params, {
      timeout: {
        type: Base.paramTypes.uint
      },
      timeout: {
        type: Base.paramTypes.uint
      }
    });
  }
}
