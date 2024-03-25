'use strict';

class CustomPromise {

	constructor() {
		this._state = 'pending';
		this._result = undefined;
		this._resolveCallback = undefined;
		this._rejectCallback = undefined;
		this._finalizers = [];
	}

	_resolve(result) {
		if (this._state !== 'pending') return;
		this._state = 'fulfilled';
		this._result = result;
		this._resolveCallback?.(result);
		this._finalizers.splice(0).forEach((onFinally) => onFinally());
	}

	_reject(error) {
		if (this._state !== 'pending') return;
		this._state = 'rejected';
		this._error = error;
		this._rejectCallback?.(error);
		this._finalizers.splice(0).forEach((onFinally) => onFinally());
	}

	then(onFulfilled, onRejected) {
		return new Promise((resolve, reject) => {

			const resolveWrapper = (value) => {
				try {

					if (typeof onFulfilled !== 'function') {
						return resolve(value);
					}

					const result = onFulfilled(value);

					if (typeof result?.then === 'function') {
						return result.then(resolve, reject);
					}

					resolve(result);

				} catch (error) {
					reject(error);
				}
			};

			const rejectedWrapper = (error) => {
				try {

					if (typeof onRejected !== 'function') {
						return reject(error);
					}

					const result = onRejected(error);

					if (typeof result?.then === 'function') {
						return result.then(resolve, reject);
					}

					reject(result);

				} catch (error) {
					reject(error);
				}
			};

			if (this._state === 'fulfilled') {
				resolveWrapper(this._result);
			} else if (this._state === 'rejected') {
				rejectedWrapper(this._error);
			} else {
				this._resolveCallback = resolveWrapper;
				this._rejectCallback = rejectedWrapper;
			}

		});
	}

	finally(onFinally) {
		if (this._state !== 'pending') onFinally();
		else {
			this._finalizers.push(onFinally);
		}
		return this;
	}

}

exports = module.exports = CustomPromise;
