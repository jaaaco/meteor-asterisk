import { Mongo } from 'meteor/mongo';
import { Nodes } from '../nodes/nodes.js';

class WorkflowsCollection extends Mongo.Collection {
    remove(selector) {
        if (selector._id) {
            Nodes.remove({'Workflows._id': selector._id});
        }
        return super.remove(selector);
    }
}

export const Workflows = new WorkflowsCollection('Workflows');

Workflows.allow({
    insert() { return true; },
    update() { return true; },
    remove() { return true; }
});
