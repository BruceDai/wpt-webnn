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
    'name': 'dequantizeLinear uint4 1D tensor with even input size',
    'graph': {
      'inputs': {
        'dequantizeLinearInput': {
          'data': [15, 0],
          'descriptor': {shape: [2], dataType: 'uint4'},
        },
        'dequantizeLinearScale': {
          'data': [1.1202747821807861, 1.1202747821807861],
          'descriptor': {shape: [2], dataType: 'float32'},
        },
        'dequantizeLinearZeroPoint': {
          'data': [0, 1],
          'descriptor': {shape: [2], dataType: 'uint4'},
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
          'data': [16.804121017456055, -1.1202747821807861],
          'descriptor': {shape: [2], dataType: 'float32'}
        }
      }
    }
  },
  {
    'name': 'dequantizeLinear uint4 1D tensor with odd input size',
    'graph': {
      'inputs': {
        'dequantizeLinearInput': {
          'data': [10, 12, 14],
          'descriptor': {shape: [3], dataType: 'uint4'},
        },
        'dequantizeLinearScale': {
          'data': [1.1202747821807861],
          'descriptor': {shape: [1], dataType: 'float32'},
        },
        'dequantizeLinearZeroPoint': {
          'data': [2],
          'descriptor': {shape: [1], dataType: 'uint4'},
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
          'data': [8.962198257446289, 11.202747344970703, 13.443297386169434],
          'descriptor': {shape: [3], dataType: 'float32'}
        }
      }
    }
  },
  {
    'name': 'dequantizeLinear uint4 4D constant tensor broadcasting zeroPoint',
    'graph': {
      'inputs': {
        'dequantizeLinearInput': {
          'data': [0, 1, 10, 15],
          'descriptor': {shape: [1, 1, 2, 2], dataType: 'uint4'},
        },
        'dequantizeLinearScale': {
          'data': [
            9.343092918395996,
            -4.617084980010986,
          ],
          'descriptor': {shape: [2, 1], dataType: 'float32'},
        },
        'dequantizeLinearZeroPoint': {
          'data': [2, 3],
          'descriptor': {shape: [2, 1], dataType: 'uint4'},
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
    'name': 'dequantizeLinear uint4 3D input with block_size = [1, 1, 2]',
    'graph': {
      'inputs': {
        'dequantizeLinearInput': {
          'data': [0, 1, 10, 15],
          'descriptor': {shape: [1, 1, 4], dataType: 'uint4'},
        },
        'dequantizeLinearScale': {
          'data': [
            9.343092918395996,
            -4.617084980010986,
          ],
          'descriptor': {shape: [1, 2], dataType: 'float32'},
        },
        'dequantizeLinearZeroPoint': {
          'data': [2, 3],
          'descriptor': {shape: [1, 2], dataType: 'uint4'},
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
          'descriptor': {shape: [1, 1, 4], dataType: 'float32'}
        }
      }
    }
  },
  {
    'name': 'dequantizeLinear int4 1D constant tensor with even size',
    'graph': {
      'inputs': {
        'dequantizeLinearInput': {
          'data': [-8, -3],
          'descriptor': {shape: [2], dataType: 'int4'},
          'constant': true
        },
        'dequantizeLinearScale': {
          'data': [1.1202747821807861, 1.1202747821807861],
          'descriptor': {shape: [2], dataType: 'float32'},
          'constant': true
        },
        'dequantizeLinearZeroPoint': {
          'data': [0, -2],
          'descriptor': {shape: [2], dataType: 'int4'},
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
          'data': [-8.962198257446289, -1.1202747821807861],
          'descriptor': {shape: [2], dataType: 'float32'}
        }
      }
    }
  },
  {
    'name': 'dequantizeLinear int4 1D tensor with even size',
    'graph': {
      'inputs': {
        'dequantizeLinearInput': {
          'data': [-8, -3],
          'descriptor': {shape: [2], dataType: 'int4'},
        },
        'dequantizeLinearScale': {
          'data': [1.1202747821807861, 1.1202747821807861],
          'descriptor': {shape: [2], dataType: 'float32'},
        },
        'dequantizeLinearZeroPoint': {
          'data': [0, -2],
          'descriptor': {shape: [2], dataType: 'int4'},
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
          'data': [-8.962198257446289, -1.1202747821807861],
          'descriptor': {shape: [2], dataType: 'float32'}
        }
      }
    }
  },
  {
    'name': 'dequantizeLinear int4 constant 1D tensor with odd size',
    'graph': {
      'inputs': {
        'dequantizeLinearInput': {
          'data': [-1, 7, 0],
          'descriptor': {shape: [3], dataType: 'int4'},
          'constant': true
        },
        'dequantizeLinearScale': {
          'data': [1.1202747821807861],
          'descriptor': {shape: [1], dataType: 'float32'},
          'constant': true
        },
        'dequantizeLinearZeroPoint': {
          'data': [-3],
          'descriptor': {shape: [1], dataType: 'int4'},
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
          'data': [2.2405495643615723, 11.202747344970703, 3.3608243465423584],
          'descriptor': {shape: [3], dataType: 'float32'}
        }
      }
    }
  },
  {
    'name': 'dequantizeLinear int4 1D tensor with odd size',
    'graph': {
      'inputs': {
        'dequantizeLinearInput': {
          'data': [-1, 7, 0],
          'descriptor': {shape: [3], dataType: 'int4'},
        },
        'dequantizeLinearScale': {
          'data': [1.1202747821807861],
          'descriptor': {shape: [1], dataType: 'float32'},
        },
        'dequantizeLinearZeroPoint': {
          'data': [-3],
          'descriptor': {shape: [1], dataType: 'int4'},
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
          'data': [2.2405495643615723, 11.202747344970703, 3.3608243465423584],
          'descriptor': {shape: [3], dataType: 'float32'}
        }
      }
    }
  },
  {
    'name': 'per-tensor dequantizeLinear for int4 4D constant',
    'graph': {
      'inputs': {
        'dequantizeLinearInput': {
          'data': [0, -1, 10, -15],
          'descriptor': {shape: [1, 1, 2, 2], dataType: 'int4'},
          'constant': true
        },
        'dequantizeLinearScale': {
          'data': [
            1.1202747821807861, -4.617084980010986, 6.2405495643615723,
            3.841923713684082
          ],
          'descriptor': {shape: [2, 2], dataType: 'float32'},
          'constant': true
        },
        'dequantizeLinearZeroPoint': {
          'data': [2, -3, -5, 4],
          'descriptor': {shape: [2, 2], dataType: 'int4'},
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
            -2.2405495643615723, -9.234169960021973, -6.240549564361572,
            -11.525771141052246
          ],
          'descriptor': {shape: [1, 1, 2, 2], dataType: 'float32'}
        }
      }
    }
  }
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
