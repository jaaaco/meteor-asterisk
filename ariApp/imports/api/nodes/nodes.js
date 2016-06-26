import { Mongo } from 'meteor/mongo'

class NodesCollection extends Mongo.Collection {
    insert(data) {
        data.pos = {
            x: 0,
            y: 0
        };
        return super.insert(data);
    }
}

export const Nodes = new NodesCollection('Nodes');

Nodes.allow({
    insert() { return true; },
    update() { return true; },
    remove() { return true; }
});
