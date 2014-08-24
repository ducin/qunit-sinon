// enable sinon log function
sinon.log = function(){ console.log.apply(console, arguments); };

function add(a, b) {
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
});

test("test should call function spy", function () {
	var functionSpy = this.spy(add);
	var result = functionSpy(1, 2);
	// access to original QUnit assertions
	equal(3, result);
	// sinon.js assertions
	ok(functionSpy.called, "function spy was called");
});

test("test should call method spy", function () {
	var methodSpy = this.spy(Calculator, "add");
	var result = methodSpy(1, 2);
	// access to original QUnit assertions
	equal(3, result);
	// sinon.js assertions
	ok(methodSpy.called, "method spy was called");
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
