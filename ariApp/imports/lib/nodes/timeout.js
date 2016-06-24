import { Base } from './base.js';
import { _ } from 'meteor/underscore';

export class Timeout extends Base {
    get params () {
        return _.extend(super.params, {
            timeout: {
                type: Base.paramTypes.uint
            }
        });
    }
}
