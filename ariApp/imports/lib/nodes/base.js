
export class Base {
    static paramTypes = {
        uint: {

        },
        workflowId: {

        },
        string: {

        }
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
        return ['in'];
    }

    get outputs() {
        return ['success', 'error'];
    }

    get params () {
        return {};
    }
}