import _ from 'lodash';

export class Maestro {
  constructor() {
    this.listeners = {};
  }

  addListener(eventName, listener, callback) {
    if (_.isUndefined(this.listeners[eventName])) this.listeners[eventName] = {};

    if (!_.has(this.listeners[eventName], listener)) this.listeners[eventName][listener] = callback;
  }

  dataRefresh(eventName, ...freshData) {
    if (_.isUndefined(this.listeners[eventName])) return;

    _.forEach(this.listeners[eventName], (listenerCallback) => {
      listenerCallback(...freshData);
    });
  }

  removeListener(eventName, listener) {
    if (_.isUndefined(this.listeners[eventName])) return;

    if (_.has(this.listeners[eventName], listener)) delete this.listeners[eventName][listener];

    if (_.keys(this.listeners[eventName]).length === 0) delete this.listeners[eventName];
  }
}

export const maestro = new Maestro();
