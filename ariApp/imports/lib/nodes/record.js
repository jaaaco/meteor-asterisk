import {Base} from './base.js';
import { paramTypes } from './_types.js';

export class Record extends Base {
  get params() {
    return _.extend(super.params, {
      name: {
        type: paramTypes.string
      }
    });
  }

  job() {
    this.channel.record({format: 'wav', beep: true, name: this.node.params.name}).then(()=>{
      this.resolve('success');
    }).catch(err => {
      console.log('Record err', err);
      this.resolve('error');
    });
  }
}

export class RecordStop extends Base {
  get params() {
    return _.extend(super.params, {
      name: {
        type: paramTypes.string
      }
    });
  }

  job() {
    this.ari.recordings.stop({recordingName: this.node.params.name}).then(()=>{
      this.resolve('success');
    }).catch(err => {
      console.log('RecordStop err', err);
      this.resolve('error');
    });
  }
}
