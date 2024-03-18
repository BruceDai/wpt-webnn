// META: title=validation tests for WebNN API element-wise logical operations
// META: global=window,dedicatedworker
// META: script=../resources/utils_validation.js
// META: timeout=long

'use strict';

[
  'equal',
  'greater',
  'greaterOrEqual',
  'lesser',
  'lesserOrEqual',
].forEach((operationName) => {
  validateTwoInputsOfSameDataType(operationName);
  validateTwoInputsBroadcastable(operationName);
  // validateOutput(operationName);
});

promise_test(async t => {
  const unsupportedDataTypeByIf = allWebNNOperandDataTypes.filter(type => type !== 'uint8');
  for (let dataType of unsupportedDataTypeByIf) {
    for (let dimensions of allWebNNDimensionsArray) {
      const inputA = builder.input(`input${++inputIndex}`, {dataType, dimensions});
      const inputB = builder.input(`input${++inputIndex}`, {dataType, dimensions});
      assert_throws_dom('DataError', () => builder.logicalNot(inputA, inputB))
    }
  }
}, "[logicalNot] DataError is expected if input's dataType is not uint8");

promise_test(async t => {
  for (let dimensions of allWebNNDimensionsArray) {
    const input = builder.input(`input${++inputIndex}`, {dataType: 'uint8', dimensions});
    const output = builder.logicalNot(input);
    assert_true(output.dataType() === 'uint8', "[logicalNot] The output's dataType is uint8");
  }
}, "[logicalNot] The output's dataType is uint8");
