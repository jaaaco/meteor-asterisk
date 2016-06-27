import {Base} from './base.js';

export class Start extends Base {
  constructor() {
    super();
  }

  get outputs() {
    return [
      {
        name: 'out',
        type: Base.connectorTypes.generic
      }
    ];
  }

  get inputs() {
    return [];
  }
}
