// META: title=validation tests for WebNN API lstm operation
// META: global=window,dedicatedworker
// META: script=../resources/utils_validation.js
// META: timeout=long

'use strict';

// validate parameters

validateNoArgument('lstm');

promise_test(async t => {
  for (let input of notMLOperandArray) {
    assert_throws_js(TypeError, () => builder.lstm(input));
  }
}, "[lstm] TypeError is expected if first required argument is not an MLOperand");

promise_test(async t => {
  // The input tensor should be 3-D tenor.
  for (let dataType of allWebNNOperandDataTypes) {
    for (let dimensions of allWebNNDimensionsArray) {
      if (dimensions.length !== 3) {
        const input = builder.input(`input${++inputIndex}`, {dataType, dimensions});
        assert_throws_dom('DataError', () => builder.lstm(input));
      }
    }
  }
}, "[lstm] DataError is expected if input's rank is not 3");


