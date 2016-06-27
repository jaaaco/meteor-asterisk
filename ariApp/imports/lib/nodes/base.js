export class Base {
  // TODO: move to separate file and import
  static paramTypes = {
    uint: {},
    workflowId: {},
    string: {}
  };

  // TODO: move to separate file and import
  static connectorTypes = {
    generic: {},
    success: {},
    error: {}
  };

  constructor() {
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
        type: Base.connectorTypes.generic
      }
    ];
  }

  get outputs() {
    return [
      {
        name: 'success',
        type: Base.connectorTypes.success
      },
      {
        name: 'error',
        type: Base.connectorTypes.error
      }
    ];
  }

  get params() {
    return {};
  }
}
