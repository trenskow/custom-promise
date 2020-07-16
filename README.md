custom-promise
----

A small JavaScript library for creating custom promises.

# Reason

The promise specifications in JavaScript makes it hard to subclass `Promise` as the specifications does not allow for constructors that takes anything else but a function as a callback.

> [See the ECMA specifications for promises here](https://tc39.es/ecma262/#sec-newpromisecapability)

# Solution

I've created this small class that follows the specifications for what *is* a promise. All promises needs to have a `then` method that takes two parameters – `catch` is syntactic sugar added by the JavaScript engine.

# How to Use

It's dead simple!

You subclass `CustomPromise` and then you call either `this._resolve(value)` or `this._reject(error)` when the promise is done.

State and callback handling is handled under the hood.

The constructor for `CustomPromise` takes no parameters, so you can customize your subclasses to whatever needs, you might have. You do, though, need to call `super()` doing construction.

# Example

````JavaScript
import CustomPromise from '@trenskow/custom-promise';
import readline from 'readline';

class AskQuestion extends CustomPromise {

	constructor(question) {

		super()

		this._rl = readline.createInterface({
			input: process.stdin,
			terminal: true
		});

		this._rl.question(question, (answer) => {
			if (answer === '!') this._reject(new Error('User refused to answer!'))
			else this._resolve(answer);
		});

	}

}
````

Now you can use it like this.

````JavaScript
await new AskQuestion('What is your name?');
````

# Another example

The above use case for this might be a little impractical, as you might as well just implement it using regular promises or an asynchronous function.

But a useful use case is when you want to provide promise capability on daisy chained APIs.

````JavaScript
import CustomPromise from '@trenskow/custom-promise';

class DaisyChain extends CustomPromise {

	constructor () {

		super()

		setImmediate(() => {
			this._exec();
		});

	}

	take() { return this; }

	your() { return this; }

	mamma() { return this; }

	out() { return this; }

	all() { return this; }

	night() { return this; }
	
	_exec() {
		this._resolve('Baby, you\'re a full grown man!');
	}

}
````

This can be used like this.

````JavaScript

const doit = new DaisyChain();

	await doit
		.take()
		.your()
		.mamma()
		.out()
		.all()
		.night(); // Returns 'Baby, you\'re a full grown man!'

````

This is not really possible with promises as they are implemented in ECMAScript, and therefore you cannot really create APIs like this – but with `CustomPromise` you can..! 😉

# License

See LICENSE.
