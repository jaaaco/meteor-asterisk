import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

import '../ui';

FlowRouter.route('/', {
    name: 'home',
    action() {
        BlazeLayout.render('layout', { main: 'workflows' });
    }
});


FlowRouter.route('/workflows/:_id', {
    name: 'workflows.show',
    action(params) {
        BlazeLayout.render('layout', { main: 'workflows', data: { _id: params._id } });
    },
});