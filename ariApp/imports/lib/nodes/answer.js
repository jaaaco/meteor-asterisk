import {Base} from './base.js';
import {_} from 'meteor/underscore';

export class Answer extends Base {
  run () {
    return new Promise(resolve => {
      console.log('Running node Answer');
      this.channel.answer().then(() => {
        resolve({next: _.keys(this.node.connectors.success)[0]});
      }).catch(err => {
        resolve({next: _.keys(this.node.connectors.error)[0]});
      });

    });
  }
}
