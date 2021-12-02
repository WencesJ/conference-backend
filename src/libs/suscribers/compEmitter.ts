import EventEmitter from 'events';

class CompEmitter extends EventEmitter {
    emitEvent(event: string, data: object) {
        this.emit(event, data);
    }
}

const compEmitter = new CompEmitter();

export default compEmitter;
