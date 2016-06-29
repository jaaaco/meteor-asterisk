import {Base} from './base.js';
import { connectorTypes } from './_types.js';

export class Start extends Base {
  get outputs() {
    return [
      {
        name: 'out',
        type: connectorTypes.generic
      }
    ];
  }

  get inputs() {
    return [];
  }

  job () {
    console.log('Running node Start');
    this.resolve('out');
  }
}
