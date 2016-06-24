import { Meteor } from 'meteor/meteor';
import { Workflows } from '../workflows.js';

Meteor.publish('Workflows', function(selector, options){
    if (1 || this.userId) { // TODO: security
        return Workflows.find(selector || {}, options || {});
    }
    return this.ready();
});
