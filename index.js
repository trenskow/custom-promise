'use strict';

class CustomPromise {

	constructor() {
		this._state = 'pending';
		this._awaiters = [];
	}

	_resolve(result) {
		if (this._state !== 'pending') return;
		this._state = 'fulfilled';
		this._result = result;
		this._awaiters.splice(0).forEach(([fulfilled]) => fulfilled(result));
	}

	_reject(error) {
		if (this._state !== 'pending') return;
		this._state = 'rejected';
		this._error = error;
		this._awaiters.splice(0).forEach(([, rejected]) => rejected(error));
	}

	then(fulfilled, rejected) {

		if (fulfilled && typeof fulfilled !== 'function') throw new TypeError('fulfilled must be a function.');
		if (rejected && typeof rejected !== 'function') throw new TypeError('rejected must be a function.');

		if (this._state === 'fulfilled') {
			if (fulfilled) fulfilled(this._result);
		}
		else if (this._state === 'rejected') {
			if (rejected) rejected(this._error);
		}
		else {
			this._awaiters.push([fulfilled, rejected]);
		}
		
	}

}

exports = module.exports = CustomPromise;
