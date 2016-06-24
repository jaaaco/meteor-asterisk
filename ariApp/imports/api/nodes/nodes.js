import { Mongo } from 'meteor/mongo'

class NodesCollection extends Mongo.Collection {

}

export const Nodes = new NodesCollection('Nodes');

Nodes.allow({
    insert() { return true; },
    update() { return true; },
    remove() { return true; }
});
