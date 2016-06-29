import {Base} from './base.js';

export class Ring extends Base {
  run () {
    return new Promise(resolve => {
      console.log('Running node Ring');
      this.channel.ring().then(() => {
        resolve({next: _.keys(this.node.connectors.success)[0]});
      }).catch(err => {
        console.log('Ring Error', err);
        resolve({next: _.keys(this.node.connectors.error)[0]});
      });
    });
  }
}
