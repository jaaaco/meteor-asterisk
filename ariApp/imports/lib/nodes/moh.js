import {Base} from './base.js';

export class Moh extends Base {
  job() {
    this.channel.startMoh().then(()=>{
      this.resolve('success');
    }).catch(err => {
      this.resolve('error');
    });
  }
}

export class StopMoh extends Base {
  job() {
    this.channel.stopMoh().then(()=>{
      this.resolve('success');
    }).catch(err => {
      this.resolve('error');
    });
  }
}
