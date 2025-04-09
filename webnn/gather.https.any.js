// META: title=test WebNN API gather operation
// META: global=window
// META: variant=?cpu
// META: variant=?gpu
// META: variant=?npu
// META: script=./resources/utils-new.js
// META: timeout=long

'use strict';

// https://www.w3.org/TR/webnn/#api-mlgraphbuilder-gather
// Gather values of the input tensor along an axis according to the indices.
//
// dictionary MLGatherOptions {
//   [EnforceRange] unsigned long axis = 0;
// };
//
// MLOperand gather(
//     MLOperand input, MLOperand indices,
//     optional MLGatherOptions options = {});


const getGatherPrecisionTolerance = (graphResources) => {
  const toleranceValueDict = {float32: 0, float16: 0};
  const expectedDataType =
      getExpectedDataTypeOfSingleOutput(graphResources.expectedOutputs);
  return {metricType: 'ULP', value: toleranceValueDict[expectedDataType]};
};

const gatherTests = [
  {
    'name':
        'gather input and indices both constant default options',
    'graph': {
      'inputs': {
        'gatherInput': {
          'data': [
            -66.05901336669922,  -68.9197006225586,   -77.02045440673828,
            -26.158037185668945, 89.0337142944336,    -45.89653396606445,
            43.84803771972656,   48.81806945800781,   51.79948425292969,
            41.94132614135742,   -1.1303654909133911, -50.42131042480469,
            90.2870101928711,    55.620765686035156,  44.92119598388672,
            56.828636169433594,  10.829925537109375,  -19.693084716796875,
            -37.696800231933594, 43.11057662963867,   0.9129875898361206,
            -7.699817180633545,  25.76774024963379,   73.60064697265625
          ],
          'descriptor': {shape: [24], dataType: 'float32'},
          'constant': true
        },
        'gatherIndices': {
          'data': [4],
          'descriptor': {shape: [], dataType: 'uint32'},
        }
      },
      'operators': [{
        'name': 'gather',
        'arguments': [{'input': 'gatherInput'}, {'indices': 'gatherIndices'}],
        'outputs': 'gatherOutput'
      }],
      'expectedOutputs': {
        'gatherOutput': {
          'data': [89.0337142944336],
          'descriptor': {shape: [], dataType: 'float32'}
        }
      }
    }
  },
  {
    'name':
        'gather constant input and indices default options',
    'graph': {
      'inputs': {
        'gatherInput': {
          'data': [
            -66.05901336669922,  -68.9197006225586,   -77.02045440673828,
            -26.158037185668945, 89.0337142944336,    -45.89653396606445,
            43.84803771972656,   48.81806945800781,   51.79948425292969,
            41.94132614135742,   -1.1303654909133911, -50.42131042480469,
            90.2870101928711,    55.620765686035156,  44.92119598388672,
            56.828636169433594,  10.829925537109375,  -19.693084716796875,
            -37.696800231933594, 43.11057662963867,   0.9129875898361206,
            -7.699817180633545,  25.76774024963379,   73.60064697265625
          ],
          'descriptor': {shape: [24], dataType: 'float32'},
          'constant': true
        },
        'gatherIndices': {
          'data': [4],
          'descriptor': {shape: [], dataType: 'uint32'}
        }
      },
      'operators': [{
        'name': 'gather',
        'arguments': [{'input': 'gatherInput'}, {'indices': 'gatherIndices'}],
        'outputs': 'gatherOutput'
      }],
      'expectedOutputs': {
        'gatherOutput': {
          'data': [89.0337142944336],
          'descriptor': {shape: [], dataType: 'float32'}
        }
      }
    }
  },
  {
    'name':
        'gather input and constant indices default options',
    'graph': {
      'inputs': {
        'gatherInput': {
          'data': [
            -66.05901336669922,  -68.9197006225586,   -77.02045440673828,
            -26.158037185668945, 89.0337142944336,    -45.89653396606445,
            43.84803771972656,   48.81806945800781,   51.79948425292969,
            41.94132614135742,   -1.1303654909133911, -50.42131042480469,
            90.2870101928711,    55.620765686035156,  44.92119598388672,
            56.828636169433594,  10.829925537109375,  -19.693084716796875,
            -37.696800231933594, 43.11057662963867,   0.9129875898361206,
            -7.699817180633545,  25.76774024963379,   73.60064697265625
          ],
          'descriptor': {shape: [24], dataType: 'float32'}
        },
        'gatherIndices': {
          'data': [4],
          'descriptor': {shape: [], dataType: 'uint32'},
          'constant': true
        }
      },
      'operators': [{
        'name': 'gather',
        'arguments': [{'input': 'gatherInput'}, {'indices': 'gatherIndices'}],
        'outputs': 'gatherOutput'
      }],
      'expectedOutputs': {
        'gatherOutput': {
          'data': [89.0337142944336],
          'descriptor': {shape: [], dataType: 'float32'}
        }
      }
    }
  }
];

if (navigator.ml) {
  gatherTests.forEach((test) => {
    webnn_conformance_test(
        buildAndExecuteGraph, getGatherPrecisionTolerance, test);
  });
} else {
  test(() => assert_implements(navigator.ml, 'missing navigator.ml'));
}
