import { Meteor } from 'meteor/meteor';
import { Nodes } from '../nodes.js';

Meteor.publish('NodesByWorkflow', function(workflowId){
    if (1 || this.userId) { // TODO: security
        return Nodes.find({'Workflows._id': workflowId});
    }
    return this.ready();
});
