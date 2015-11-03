Meteor.publish('Status', function (selector, options) {
    if (this.userId) {
        return Status.find(selector, options);
    }
});

var colors =  Meteor.npmRequire('colors');

Meteor.startup(function(){
    Status.remove({});


    Status.find({status: 'down'}).observe({
        added: function(status) {
            _.delay(function(status){
                Fiber(function (status) {
                    Status.update({_id: status._id},{$set: {status: 'restart'}})
                }).run(status);

            },1000,status);
        }
    });

    Status.find({status: 'error'}).observe({
        added: function(status) {
            _.delay(function(status){
                Fiber(function (status) {
                    Status.update({_id: status._id},{$set: {status: 'restart'}})
                }).run(status);

            },3000,status);
        }
    });

    Status.insert({type: 'ariClient',status: 'down'});

    Status.find({}).observe({
        changed: function(status) {
            console.log('STATUS'.red,status.type.grey,status.status.yellow);
        }
    });
});

