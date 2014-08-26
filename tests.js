// enable sinon log function
sinon.log = function(){ console.log.apply(console, arguments); };

function add(a, b) {
	if (arguments.length !== 2) {
		throw new Error("Invalid number of arguments");
	}
	return a + b;
}

var Calculator = {
	add: add
};

/*
test("pseudo-test in qunit-sinon environment", function () {
	var anonymousSpy = this.spy();
	var functionSpy = this.spy(add);
	var methodSpy = this.spy(Calculator, "add");
	// available QUnit assertions
	ok(true);
	equal(1, 1);
});
*/

module("Sinon spies");

test("test should call anonymous spy", function () {
	var anonymousSpy = this.spy();
	anonymousSpy();
	ok(anonymousSpy.called, "anonymous spy was called");
	ok(!anonymousSpy.calledTwice, "anonymous spy was not called twice");
	equal(anonymousSpy.callCount, 1, "anonymous spy was called exactly once");
});

test("test should call function spy", function () {
	var functionSpy = this.spy(add);
	var result = functionSpy(1, 2);
	// access to original QUnit assertions
	equal(3, result);
	// sinon.js assertions
	ok(functionSpy.called, "function spy was called");
});

test("test should check spy returned values", function () {
	var functionSpy = this.spy(add);
	functionSpy(1, 2);
	functionSpy(3, 4);
	ok(functionSpy.calledTwice, "spy was called exactly twice");
	ok(functionSpy.returned(3), "spy returned 3 at least once");
	ok(functionSpy.returned(7), "spy returned 7 at least once");
	ok(!functionSpy.alwaysReturned(7), "spy returned something else than 7");
});

test("test should call method spy", function () {
	var methodSpy = this.spy(Calculator, "add");
	var result = methodSpy(1, 2);
	// access to original QUnit assertions
	equal(3, result);
	// sinon.js assertions
	ok(methodSpy.called, "method spy was called");
});

test("test should throw an error", function () {
	var spy = this.spy(add);
	throws(function() {
		spy(); // will throw Error
	}, "an error has been thrown");
	ok(spy.threw(), "spy has thrown an error");
	ok(spy.threw("Error"), "spy has thrown Error");
});

test("test should call only subscribed channels", function () {
	var callback = this.spy(function(arg) { return arg; });
	radio('myChannel').subscribe(callback);
	var otherCallback = this.spy();
	radio('otherChannel').subscribe(otherCallback);

	radio('myChannel').broadcast('important message');
	ok(callback.called, "callback was called");
	ok(callback.returned('important message'));
	ok(!otherCallback.called, "otherCallback was not yed called");

	radio('otherChannel').broadcast('aargh');
	ok(callback.called, "otherCallback was called as well");

	radio('myChannel').unsubscribe(callback);
	radio('myChannel').broadcast('another message');
	ok(!callback.calledTwice, "callback was not called again");
});

test("test should check specific spy call", function () {
	var callback = this.spy(function(arg) {
		return "broadcasting " + arg; }
	);
	radio('myChannel').subscribe(callback);
	radio('myChannel').broadcast('message');
	ok(callback.called, "callback was called");
	var call = callback.getCall(0);
	ok(call.calledWith('message'));
	equal('broadcasting message', call.returnValue);
});

module("Sinon stubs");

test("test should call anonymous stub", function () {
	var stubFunction = this.stub();
	stubFunction.onCall(0).returns("abc");
	var result = stubFunction();
	equal("abc", result);
	sinon.assert.called(stubFunction, "anonymous stub was called");
});

module("Sinon mocks");

test("test should call mock", function () {
	var myObject = { myMethod: function () {} };
	var mock = this.mock(myObject);
	mock.expects("myMethod").once();
	myObject.myMethod();
	mock.verify();
});
