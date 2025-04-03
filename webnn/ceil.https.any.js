// META: title=test WebNN API element-wise ceil operation
// META: global=window
// META: variant=?cpu
// META: variant=?gpu
// META: variant=?npu
// META: script=./resources/utils-new.js
// META: timeout=long

'use strict';

// https://www.w3.org/TR/webnn/#api-mlgraphbuilder-unary
// Compute the ceiling of the input tensor, element-wise.
//
// MLOperand ceil(MLOperand input);


const getCeilPrecisionTolerance = (graphResources) => {
  const toleranceValueDict = {float32: 0, float16: 0};
  const expectedDataType =
      getExpectedDataTypeOfSingleOutput(graphResources.expectedOutputs);
  return {metricType: 'ULP', value: toleranceValueDict[expectedDataType]};
};

const ceilTests = [
  {
    'name': 'ceil float32 0D scalar',
    'graph': {
      'inputs': {
        'ceilInput': {
          'data': [67.38941955566406],
          'descriptor': {shape: [], dataType: 'float32'},
          'constant': true
        }
      },
      'operators': [{
        'name': 'ceil',
        'arguments': [{'input': 'ceilInput'}],
        'outputs': 'ceilOutput'
      }],
      'expectedOutputs': {
        'ceilOutput':
            {'data': [68], 'descriptor': {shape: [], dataType: 'float32'}}
      }
    }
  }
];

if (navigator.ml) {
  ceilTests.forEach((test) => {
    webnn_conformance_test(
        buildAndExecuteGraph, getCeilPrecisionTolerance, test);
  });
} else {
  test(() => assert_implements(navigator.ml, 'missing navigator.ml'));
}
