import { Mongo } from 'meteor/mongo';
import { Nodes } from '../nodes/nodes.js';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

class WorkflowsCollection extends Mongo.Collection {
    remove(selector) {
        Workflows.find(selector).forEach(workflow => {
          Nodes.remove({'Workflows._id': workflow._id});
        });
        return super.remove(selector);
    }
}

export const Workflows = new WorkflowsCollection('Workflows');

Workflows.allow({
    insert() { return true; },
    update() { return true; },
    remove() { return true; }
});

Workflows.schema = new SimpleSchema({
  name: {
      type: String,
      max: 100
  },
  description: {
    optional: true,
    type: String,
    autoform: {
      rows: 5
    }
  },
  trigger: {
    optional: true,
    type: String,
    allowedValues: ['channel','workflow']
  }
});

Workflows.attachSchema(Workflows.schema);
