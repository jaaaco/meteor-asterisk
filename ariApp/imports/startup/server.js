import { Nodes } from '../api/nodes/nodes.js';
import { Workflows } from '../api/workflows/workflows.js';

import '../api/workflows/server/publications.js';
import '../api/nodes/server/publications.js';

import { Meteor } from 'meteor/meteor';
import { EJSON } from 'meteor/ejson';

import '../pbx/server.js';

function createOutgoingWorkflows() {
    const workflowId = Workflows.insert({
        name: 'addToBridge'
    });

    let node1 = Nodes.insert({
        Workflows: {_id: workflowId},
        first: true,
        type: 'addToBridge',
        params: {
            bridge: 'var:bridge'
        }
    });
}

Meteor.startup(function(){
    return ;
    Nodes.remove({});
    Workflows.remove({});

    createOutgoingWorkflows();

    const workflowId = Workflows.insert({
        name: 'Incoming channel',
        trigger: 'channel'
    });

    let node1 = Nodes.insert({
        Workflows: {_id: workflowId},
        first: true,
        type: 'answer'
    });

    let node2 = Nodes.insert({
        Workflows: {_id: workflowId},
        type: 'ring'
    });

    Nodes.update(node1,{$set: {next: node2}});

    let node3 = Nodes.insert({
        Workflows: {_id: workflowId},
        type: 'timeout',
        params: {
            time: 4000
        }
    });

    Nodes.update(node2,{$set: {next: node3}});

    // let node4 = Nodes.insert({
    //     Workflows: {_id: workflowId},
    //     type: 'playback',
    //     params: {
    //         file: 'welcome'
    //     }
    // });

    // let node4 = Nodes.insert({
    //     Workflows: {_id: workflowId},
    //     type: 'hangup'
    // });
    //

    let node4 = Nodes.insert({
        Workflows: {_id: workflowId},
        type: 'bridge',
        params: {
            type: 'mixing',
            var: 'bridge',
            onLastChannelLeftBridge: false
        }
    });

    let onLastChannelLeftBridge = Nodes.insert({
        
    });
    
    Nodes.update(node3,{$set: {next: node4}});

    let node5 = Nodes.insert({
        Workflows: {_id: workflowId},
        type: 'addToBridge',
        params: {
            bridge: 'var:bridge'
        }
    });

    Nodes.update(node4,{$set: {next: node5}});
    
    
    let node6 = Nodes.insert({
        Workflows: {_id: workflowId},
        type: 'originate',
        params: {
            timeout: 30000,
            destination: '300',
            onAnswer: false,
            onBusy: false,
            onError: false,
            appArgs: {
                workflow: 'addToBridge',
                params: {
                    bridge: 'var:bridge'
                }
            }
        }
    });
    
    Nodes.update(node5,{$set: {next: node6}});

    let node7 = Nodes.insert({
        Workflows: {_id: workflowId},
        type: 'originate',
        params: {
            timeout: 30000,
            destination: '300',
            onAnswer: false,
            onBusy: false,
            onError: false,
            appArgs: {
                workflow: 'addToBridge',
                params: {
                    bridge: 'var:bridge'
                }
            }
        }
    });

    Nodes.update(node6,{$set: {next: node7}});
    
    // console.log(Workflows.findOne());

});
