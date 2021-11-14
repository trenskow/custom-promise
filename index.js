'use strict';

class CustomPromise {

	constructor() {
		this._state = 'pending';
		this._awaiters = [];
		this._finalizers = [];
	}

	_reset() {
		this._state = 'pending';
	}

	_resolve(result) {
		if (this._state !== 'pending') return;
		this._state = 'fulfilled';
		this._result = result;
		this._awaiters.splice(0).forEach(([onFulfilled]) => onFulfilled(result));
		this._finalizers.splice(0).forEach((onFinally) => onFinally());
	}

	_reject(error) {
		if (this._state !== 'pending') return;
		this._state = 'rejected';
		this._error = error;
		this._awaiters.splice(0).forEach(([, onRejected]) => onRejected(error));
		this._finalizers.splice(0).forEach((onFinally) => onFinally());
	}

	then(onFulfilled, onRejected) {

		if (onFulfilled && typeof onFulfilled !== 'function') throw new TypeError('fulfilled must be a function.');
		if (onRejected && typeof onRejected !== 'function') throw new TypeError('rejected must be a function.');

		if (this._state === 'fulfilled') {
			if (onFulfilled) onFulfilled(this._result);
		}
		else if (this._state === 'rejected') {
			if (onRejected) onRejected(this._error);
		}
		else {
			this._awaiters.push([onFulfilled, onRejected]);
		}
		
	}

	finally(onFinally) {
		if (this._state !== 'pending') onFinally();
		else {
			this._finalizers.push(onFinally);
		}
	}

}

exports = module.exports = CustomPromise;
