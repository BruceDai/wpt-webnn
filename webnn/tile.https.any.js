// META: title=test WebNN API tile operation
// META: global=window
// META: variant=?cpu
// META: variant=?gpu
// META: variant=?npu
// META: script=./resources/utils-new.js
// META: timeout=long

'use strict';

const getTilePrecisionTolerance = () => {
  return {metricType: 'ULP', value: 0};
};

const tileTests = [
  {
    'name': 'tile float32 0D scalar tensor by repetitions=[]',
    'graph': {
      'inputs': {
        'tileInput': {
          'data': [0.5],
          'descriptor': {shape: [], dataType: 'float32'}
        }
      },
      'operators': [{
        'name': 'tile',
        'arguments': [{'input': 'tileInput'}, {'repetitions': []}],
        'outputs': 'tileOutput'
      }],
      'expectedOutputs': {
        'tileOutput': {
          'data': [0.5],
          'descriptor': {shape: [], dataType: 'float32'}
        }
      }
    }
  }
];

if (navigator.ml) {
  tileTests.forEach((test) => {
    webnn_conformance_test(buildAndExecuteGraph, getTilePrecisionTolerance, test);
  });
} else {
  test(() => assert_implements(navigator.ml, 'missing navigator.ml'));
}
