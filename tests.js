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
	ok(!spy.threw({ myError: 123 }), "spy hasn't thrown that");
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

	radio('otherChannel').unsubscribe(otherCallback);
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

	radio('myChannel').unsubscribe(callback);
});

module("Sinon stubs");

test("test should call anonymous stub", function () {
	var stubFunction = this.stub();
	stubFunction.onCall(0).returns("abc");
	var result = stubFunction();

	equal("abc", result);
	ok(stubFunction.called, "anonymous stub was called");
});

test("test stub returns constant value", function () {
	var pi = this.stub();
	pi.returns(3.14);

	equal(3.14, pi(), "stub returns the same value");
	ok(pi.called, "stub was called");
});

test("test stub return values for specific args", function () {
	var guessWho = this.stub();
	guessWho.withArgs("Monty").returns("Python");
	guessWho.withArgs("John").returns("Doe");
	guessWho.throws();

	equal("Python", guessWho("Monty"), "stub returns predefined value");
	throws(function() {
		guessWho(); // will throw Error
	}, "stub throws error for call with no arguments");
	equal("Doe", guessWho("John"), "stub returns predefined value");
});

var myModelInstance = {
	fetch: function() {
		// let's assume it fetches data through AJAX
		this.data = [];
	}
};

test("test object method stubbing and restoring", function () {
	var fetchStub = this.stub(myModelInstance, "fetch", function() {
		this.data = [1, 3, 5];
	});

	myModelInstance.fetch();
	deepEqual([1, 3, 5], myModelInstance.data, "model's .fetch() is stubbed");

	fetchStub.restore();
	myModelInstance.fetch();
	deepEqual([], myModelInstance.data, "model's .fetch() is restored");

	equal(1, fetchStub.callCount, "stub was called only once");
});

test("test subscribing stubs", function () {
	var fallback = sinon.stub().throws();
	radio('badChannel').subscribe(fallback);

	throws(function() {
		radio('badChannel').broadcast('a bad message');
	}, "stub throws error for call with no arguments");
	ok(fallback.calledOnce, 'fallback was called once');

	radio('myChannel').unsubscribe(fallback);
});

module("Sinon mocks");

var StatusModel = Backbone.Model.extend({
	// [...]
	defaults: {
		status: 'ACTIVE',
		items: []
	},
	isActive: function() {
		return this.get('status') === 'ACTIVE';
	},
	getSummary: function() {
		if (this.isActive()) {
			var sum = _.reduce(this.get('items'), function(a, b) {
				return a + b;
			}, 0);
			return "Sum of items is: " + sum;
		} else {
			return "The object is inactive";
		}
	}
});

test("test model method returns undefined", function () {
	var sm = new StatusModel();
	var mock = this.mock(sm);
	mock.expects("isActive").exactly(1);
	equal(sm.isActive(), undefined);
	mock.verify();
	mock.restore();
});

test("test model method returns value", function () {
	var sm = new StatusModel();
	var mock = this.mock(sm);
	mock.expects("isActive").exactly(1).returns(true);
	equal(sm.getSummary(), "Sum of items is: 0");
	mock.verify();
	mock.restore();
});

test("test model method returns value", function () {
	var sm = new StatusModel();
	var mock = this.mock(sm);
	mock.expects("get").withExactArgs("status").once().returns("ACTIVE");
	mock.expects("get").withExactArgs("items").once().returns([3, 4, 5]);
	equal(sm.getSummary(), "Sum of items is: 12");
	mock.verify();
	mock.restore();
});

var StatusView = Backbone.View.extend({
	// [...]
	template: _.template("some template..."),
    initialize: function() {
        this.listenTo(this.model, "change", this.render);
    },
	render: function() {
		this.$el.html(this.template({
			summary: this.model.getSummary(),
			cssClass: this.model.isActive() ? 'active' : 'inactive'
		}));
		this.rendered = true;
		return this;
	}
});

test("test view uses model method via events", function () {
	var sm = new StatusModel(),
		sv = new StatusView({ model: sm }),
		mock = this.mock(sm);
	mock.expects("get").withExactArgs("status").twice().returns("ACTIVE");
	mock.expects("get").withExactArgs("items").once();
	sm.set('items', [1, 2, 3]);
	mock.verify();
	mock.restore();
	ok(sv.rendered);
});
