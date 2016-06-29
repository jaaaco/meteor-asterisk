import {Base} from './base.js';

export class Hangup extends Base {
  job() {
    this.channel.hangup().then(()=>{
      this.resolve('success');
    }).catch(err => {
      this.resolve('error');
    });
  }
}
