export default class EventHandler<Keys extends string> {
    events: { [key: string]: Function[] } = {};

    registerEvent(event: Keys, callback: Function) {
        if (this.events[event] === undefined) {
            this.events[event] = [];
        }
        this.events[event].push(callback);
    }

    triggerEvent(event: Keys, ...args: any[]) {
        if (this.events[event] !== undefined) {
            for (let callback of this.events[event]) {
                callback(...args);
            }
        }
    }

    removeEvent(event: Keys) {
        delete this.events[event];
    }

    removeCallback(event: Keys, callback: Function) {
        if (this.events[event] !== undefined) {
            this.events[event] = this.events[event].filter((value) => {
                return value !== callback;
            });
        }
    }

    removeAllEvents() {
        this.events = {};
    }

}