// META: title=test WebNN API hardSigmoid operation
// META: global=window
// META: variant=?cpu
// META: variant=?gpu
// META: variant=?npu
// META: script=./resources/utils-new.js
// META: timeout=long

'use strict';

// https://www.w3.org/TR/webnn/#api-mlgraphbuilder-hard-sigmoid
// Calculate the non-smooth hard sigmoid function on the input tensor, used
// instead of the sigmoid function for faster computation.
//
// dictionary MLHardSigmoidOptions {
//   double alpha = 0.2;
//   double beta = 0.5;
// };
//
// MLOperand hardSigmoid(
//     MLOperand input, optional MLHardSigmoidOptions options = {});

const hardSigmoidTests = [
  {
    'name': 'hardSigmoid float16 positive 1D constant tensor default options',
    'graph': {
      'inputs': {
        'hardSigmoidInput': {
          'data': [
            0.05908203125,    0.70751953125,       0.52294921875,
            0.423095703125,   0.66455078125,       0.9501953125,
            0.10919189453125, 0.01297760009765625, 0.4755859375,
            0.5322265625,     0.68408203125,       0.46630859375,
            0.304931640625,   0.802734375,         0.2486572265625,
            0.66357421875,    0.5546875,           0.55419921875,
            0.73095703125,    0.488037109375,      0.77685546875,
            0.845703125,      0.55517578125,       0.560546875
          ],
          'descriptor': {shape: [24], dataType: 'float16'}
        }
      },
      'operators': [{
        'name': 'hardSigmoid',
        'arguments': [{'input': 'hardSigmoidInput'}],
        'outputs': 'hardSigmoidOutput'
      }],
      'expectedOutputs': {
        'hardSigmoidOutput': {
          'data': [
            0.51171875,    0.6416015625,  0.6044921875,  0.58447265625,
            0.6328125,     0.68994140625, 0.52197265625, 0.50244140625,
            0.59521484375, 0.6064453125,  0.63671875,    0.59326171875,
            0.56103515625, 0.66064453125, 0.5498046875,  0.6328125,
            0.61083984375, 0.61083984375, 0.64599609375, 0.59765625,
            0.6552734375,  0.6689453125,  0.61083984375, 0.6123046875
          ],
          'descriptor': {shape: [24], dataType: 'float16'}
        }
      }
    }
  }
];

if (navigator.ml) {
  hardSigmoidTests.forEach((test) => {
    webnn_conformance_test(buildAndExecuteGraph, getPrecisionTolerance, test);
  });
} else {
  test(() => assert_implements(navigator.ml, 'missing navigator.ml'));
}
