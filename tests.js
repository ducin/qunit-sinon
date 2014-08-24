// enable sinon log function
sinon.log = function(){ console.log.apply(console, arguments); };

QUnit.module("Sinon spies");

QUnit.test("test should call anonymous spy", function () {
    var spyFunction = sinon.spy();
    spyFunction();
    sinon.assert.called(spyFunction, "spy function was called");
});

QUnit.test("test should call function spy", function (assert) {
    function add(a, b) {
        return a + b;
    }
    var spyFunction = sinon.spy(add);
    var result = spyFunction(1, 2);
    // access to original QUnit assertions
    assert.equal(3, result);
    // sinon.js assertions
    sinon.assert.called(spyFunction, "spy function was called");
});

QUnit.test("test should call method spy", function (assert) {
    var Calculator = {
        add: function(a, b) {
            return a + b;
        }
    };
    var spyFunction = sinon.spy(Calculator, "add");
    var result = spyFunction(1, 2);
    // access to original QUnit assertions
    assert.equal(3, result);
    // sinon.js assertions
    sinon.assert.called(spyFunction, "spy function was called");
});

QUnit.module("Sinon stubs");

QUnit.test("test should call anonymous stub", function (assert) {
    var stubFunction = sinon.stub();
    stubFunction.onCall(0).returns("abc");
    var result = stubFunction();
    assert.equal("abc", result);
    sinon.assert.called(stubFunction, "stub function was called");
});

QUnit.module("Sinon mocks");

QUnit.test("test should call mock", function () {
    var myObject = { myMethod: function () {} };
    var mock = sinon.mock(myObject);
    mock.expects("myMethod").once();
    myObject.myMethod();
    mock.verify();
});
