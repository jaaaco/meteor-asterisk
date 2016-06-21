import { Mongo } from 'meteor/mongo';

export const Nodes = new Mongo.Collection('Nodes');
export const Workflows = new Mongo.Collection('Workflows');