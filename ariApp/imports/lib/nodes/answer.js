import {Base} from './base.js';
import {_} from 'meteor/underscore';

export class Answer extends Base {
  job () {
    console.log('Running node Answer');
    this.channel.answer().then(() => {
      this.resolve('success');
    }).catch(err => {
      this.resolve('error');
    });
  }
}
