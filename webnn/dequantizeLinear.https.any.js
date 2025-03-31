// META: title=test WebNN API dequantizeLinear operation
// META: global=window
// META: variant=?cpu
// META: variant=?gpu
// META: variant=?npu
// META: script=./resources/utils-new.js
// META: timeout=long

'use strict';

// Calculate a low precision integer operand
// (typically uint8 with a zero-point bias) to floating point:
//   output = (input - zeroPoint) * scale.
//
// MLOperand dequantizeLinear(
//     MLOperand input, MLOperand scale, MLOperand zeroPoint,
//     optional MLOperatorOptions options = {});


const getDequantizeLinearPrecisionTolerance = (graphResources) => {
  const toleranceValueDict = {float32: 1};
  const expectedDataType =
      getExpectedDataTypeOfSingleOutput(graphResources.expectedOutputs);
  return {metricType: 'ULP', value: toleranceValueDict[expectedDataType]};
};

const dequantizeLinearTests = [
  {
    'name': 'dequantizeLinear uint4 4D constant tensor broadcasting zeroPoint',
    'graph': {
      'inputs': {
        'dequantizeLinearInput': {
          'data': [0, 1, 10, 15],
          'descriptor': {shape: [1, 1, 2, 2], dataType: 'uint4'},
          'constant': true
        },
        'dequantizeLinearScale': {
          'data': [
            9.343092918395996,
            -4.617084980010986,
          ],
          'descriptor': {shape: [2, 1], dataType: 'float32'},
          'constant': true
        },
        'dequantizeLinearZeroPoint': {
          'data': [2, 3],
          'descriptor': {shape: [2, 1], dataType: 'uint4'},
          'constant': true
        }
      },
      'operators': [{
        'name': 'dequantizeLinear',
        'arguments': [
          {'input': 'dequantizeLinearInput'},
          {'scale': 'dequantizeLinearScale'},
          {'zeroPoint': 'dequantizeLinearZeroPoint'}
        ],
        'outputs': 'dequantizeLinearOutput'
      }],
      'expectedOutputs': {
        'dequantizeLinearOutput': {
          'data': [
            -18.686185836791992, -9.343092918395996, -32.31959533691406,
            -55.40502166748047
          ],
          'descriptor': {shape: [1, 1, 2, 2], dataType: 'float32'}
        }
      }
    }
  },
  {
    'name': 'dequantizeLinear uint8 4D constant tensor broadcasting zeroPoint',
    'graph': {
      'inputs': {
        'dequantizeLinearInput': {
          'data': [0, 1, 10, 15],
          'descriptor': {shape: [1, 1, 2, 2], dataType: 'uint8'},
          'constant': true
        },
        'dequantizeLinearScale': {
          'data': [
            9.343092918395996,
            -4.617084980010986,
          ],
          'descriptor': {shape: [2, 1], dataType: 'float32'},
          'constant': true
        },
        'dequantizeLinearZeroPoint': {
          'data': [2, 3],
          'descriptor': {shape: [2, 1], dataType: 'uint8'},
          'constant': true
        }
      },
      'operators': [{
        'name': 'dequantizeLinear',
        'arguments': [
          {'input': 'dequantizeLinearInput'},
          {'scale': 'dequantizeLinearScale'},
          {'zeroPoint': 'dequantizeLinearZeroPoint'}
        ],
        'outputs': 'dequantizeLinearOutput'
      }],
      'expectedOutputs': {
        'dequantizeLinearOutput': {
          'data': [
            -18.686185836791992, -9.343092918395996, -32.31959533691406,
            -55.40502166748047
          ],
          'descriptor': {shape: [1, 1, 2, 2], dataType: 'float32'}
        }
      }
    }
  },
];

if (navigator.ml) {
  dequantizeLinearTests.forEach((test) => {
    webnn_conformance_test(
        buildAndExecuteGraph, getDequantizeLinearPrecisionTolerance, test,
        /*cast_to_supported_type=*/ true);
  });
} else {
  test(() => assert_implements(navigator.ml, 'missing navigator.ml'));
}
