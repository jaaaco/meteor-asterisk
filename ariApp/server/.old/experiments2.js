class Participant {
    constructor(id) {
        this.id = id;
    }

    // start ringing on participant channel
    ring(turnOn = true) {

    }

    // hangup participant's channel
    hangup() {

    }

    // answer participant's channel
    answer(cb) {

    }

    // music on hold
    moh(turnOn = true) {

    }

    // hold channel
    hold(turnOn = true) {

    }

    wait(timeSeconds = 5, done) {
        _.delay(done,timeSeconds * 1000);
    }

}

class Room {
    // play sound for all participants
    play() {

    }

    waitForCommands(cb) {

    }

    // mute all participants
    muteAll(turnOn = true) {

    }

    // play music on hold for all participants
    mohAll(turnOn = true) {

    }

    addParticipant(Participant) {

    }

    removeParticipant(Participant) {

    }
}


p = new Participant(id);
p.ring();
p.wait(4,() => {p})



