import { connectorTypes } from './_types.js';

export class Base {
  constructor(ari, node, vars, options = {}) {
    this.vars = vars;
    this.ari = ari;
    this.node = node;
    this.channel = options.channel || false;
  }

  get label() {
    return this.type + '.label';
  }

  get type() {
    return this.constructor.name;
  }

  get inputs() {
    return [
      {
        name: 'in',
        type: connectorTypes.generic
      }
    ];
  }

  get outputs() {
    return [
      {
        name: 'success',
        type: connectorTypes.success
      },
      {
        name: 'error',
        type: connectorTypes.error
      }
    ];
  }

  get params() {
    return {};
  }

  run () {
    return new Promise((resolve, reject) => {
      this._resolve = resolve;
      this._reject = reject;
      this.job();
    });
  }
  
  job() {
    this._reject('Run method in class ' + this.constructor.name + ' not implemented');
  }
  
  resolve(output, message) {
    let next;
    if (this.node.connectors && this.node.connectors[output]) {
      next = _.keys(this.node.connectors[output])[0];
    }
    this._resolve({next, message});
  }
}
