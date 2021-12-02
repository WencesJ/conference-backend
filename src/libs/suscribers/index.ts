import compEmitter from './compEmitter';

let eventBucket = compEmitter;

const Events: Function[] = [];

export const registerEvents = (events: Function) => {
    Events.push(events);
}

const compose =
    (fn1: Function, ...fns: Function[]) =>
    (emitter: typeof compEmitter) =>
        fn1(
            fns.reduce(
                (returnedData, currentFn) => currentFn(returnedData),
                emitter
            )
        );

const [firstEvent, ...restEvents] = Events;

eventBucket = compose(
    firstEvent,
    ...restEvents
)(eventBucket);

export default eventBucket;
