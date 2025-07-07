const { EventEmitter } = require('events');

class MockSocket extends EventEmitter {
    constructor() {
        super();
        this.id = 'mock-socket-id';
        this.join = jest.fn();
        this.emit = jest.fn();
    }
}

class MockIO {
    constructor() {
        this.to = jest.fn().mockReturnThis();
        this.emit = jest.fn();
    }
}



module.exports = {
    createMockSocket: () => new MockSocket(),
    createMockIO: () => new MockIO()
};