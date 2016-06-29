import {Base} from './base.js';

export class Ring extends Base {
  job () {
    console.log('Running node Ring');
    this.channel.ring().then(() => {
      this.resolve('success');
    }).catch(err => {
      console.log('Ring Error', err);
      this.resolve('error');
    });
  }
}
