import { Base } from './base.js';
import { connectorTypes, paramTypes } from './_types.js';

export class DtmfMenu extends Base {
  get params() {
    return _.extend(super.params, {
      saveIn: {
        type: paramTypes.saveVar
      },
      timeout: {
        type: paramTypes.uint
      }
    });
  }

  get outputs() {
    return [
      {
        name: '1',
        type: connectorTypes.success
      },
      {
        name: '1',
        type: connectorTypes.success
      },
      {
        name: '3',
        type: connectorTypes.success
      },
      {
        name: '4',
        type: connectorTypes.success
      },
      {
        name: '5',
        type: connectorTypes.success
      },
      {
        name: '6',
        type: connectorTypes.success
      },
      {
        name: '7',
        type: connectorTypes.success
      },
      {
        name: '8',
        type: connectorTypes.success
      },
      {
        name: '9',
        type: connectorTypes.success
      },
      {
        name: '0',
        type: connectorTypes.success
      },
      {
        name: '*',
        type: connectorTypes.success
      },
      {
        name: '#',
        type: connectorTypes.success
      },
      {
        name: 'error',
        type: connectorTypes.error
      }
    ];
  }
}
