import {Base} from './base.js';

export class StopRing extends Base {
  job() {
    this.channel.ringStop().then(()=>{
      this.resolve('success');
    }).catch(err => {
      this.resolve('error');
    });
  }
}
