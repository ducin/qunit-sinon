// enable sinon log function
sinon.log = function(){ console.log.apply(console, arguments) };

QUnit.module("Sinon spies");

QUnit.test("test should call anonymous spy", function (assert) {
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
