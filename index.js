class CustomPromise {

	constructor() {
		this._state = 'pending';
		this._result = undefined;
		this._finalizers = [];
		this._onFulfilled = [];
		this._onRejected = [];
	}

	_resolve(result) {
		if (this._state !== 'pending') return;
		this._state = 'fulfilled';
		this._result = result;
		this._onFulfilled
			.filter((onFulfilled) => typeof onFulfilled === 'function')
			.forEach((onFulfilled) => onFulfilled(result));
		this._finalizers.splice(0).forEach((onFinally) => onFinally());
	}

	_reject(error) {
		if (this._state !== 'pending') return;
		this._state = 'rejected';
		this._error = error;
		this._onRejected
			.filter((onRejected) => typeof onRejected === 'function')
			.forEach((onRejected) => onRejected(error));
		this._finalizers.splice(0).forEach((onFinally) => onFinally());
	}

	then(onFulfilled, onRejected) {

		if (this._state === 'fulfilled') {
			onFulfilled?.(this._result);
		} else if (this._state === 'rejected') {
			onRejected?.(this._error);
		} else {
			this._onFulfilled.push(onFulfilled);
			this._onRejected.push(onRejected);
		}

		return this;

	}

	finally(onFinally) {
		if (this._state !== 'pending') onFinally();
		else {
			this._finalizers.push(onFinally);
		}
		return this;
	}

}

export default CustomPromise;
