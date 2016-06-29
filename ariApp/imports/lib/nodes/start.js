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

  run () {
    return new Promise((resolve, reject) => {
      console.log('Running node Start');
      resolve({next: _.keys(this.node.connectors.out)[0]});
    });
  }
}
