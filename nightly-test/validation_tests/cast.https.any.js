// META: title=validation tests for WebNN API cast operation
// META: global=window,dedicatedworker
// META: script=../resources/utils.js
// META: script=../resources/utils_validation.js
// META: timeout=long

'use strict';

promise_test(async t => {
  for (let dataType of allWebNNOperandDataTypes) {
    assert_throws_js(TypeError, () => builder.cast('not an MLOperand', dataType));
  }
}, "[cast] TypeError is expected if first input argument is not an MLOperand");

promise_test(async t => {
  for (let dataType of allWebNNOperandDataTypes) {
    for (let dimensions of allWebNNDimensionsArray) {
      const input = builder.input(`input${++inputIndex}`, {dataType, dimensions});
      assert_throws_js(TypeError, () => builder.cast(input, 'not an MLOperandDataType'));
    }
  }
}, "[cast] TypeError is expected if second type argument is not of MLOperandDataType");

// Overflowing casts
const overflowingCastsTests = [
  // The value range of int32: [-2147483648, 2147483647] 
  // {
  //   "name": "Overflowing cast int64 ['-2147483649', '2147483648'] by int32 is expected to [2147483647, -2147483648]",
  //   "input": {
  //     "shape": [2],
  //     "data": [
  //       '-2147483649', '2147483648',
  //     ],
  //     "dataType": "int64"
  //   },
  //   "type": "int32",
  //   "expected": {
  //     "shape": [2],
  //     "data": [
  //       2147483647, -2147483648,
  //     ],
  //     "dataType": "int32"
  //   }
  // },
  // {
  //   "name": "Overflowing cast uint32 [2147483648] by int32 is expected to [-2147483648]",
  //   "input": {
  //     "shape": [1],
  //     "data": [
  //       2147483648,
  //     ],
  //     "dataType": "uint32"
  //   },
  //   "type": "int32",
  //   "expected": {
  //     "shape": [1],
  //     "data": [
  //       -2147483648,
  //     ],
  //     "dataType": "int32"
  //   },  
  // },
  // // The value range of uint32: [0, 4294967295]
  // {
  //   "name": "Overflowing cast int64 ['-1', '4294967296'] by uint32 is expected to [4294967295, 0]",
  //   "input": {
  //     "shape": [2],
  //     "data": [
  //       '-1', '4294967296',
  //     ],
  //     "dataType": "int64"
  //   },
  //   "type": "uint32",
  //   "expected": {
  //     "shape": [2],
  //     "data": [
  //       4294967295, 0,
  //     ],
  //     "dataType": "uint32"
  //   }
  // },
  // {
  //   "name": "Overflowing cast int32 [-1] by uint32 is expected to [4294967295]",
  //   "input": {
  //     "shape": [1],
  //     "data": [
  //       -1,
  //     ],
  //     "dataType": "int32"
  //   },
  //   "type": "uint32",
  //   "expected": {
  //     "shape": [1],
  //     "data": [
  //       4294967295,
  //     ],
  //     "dataType": "uint32"
  //   }
  // },
  // {
  //   "name": "Overflowing cast int8 [-1] by uint32 is expected to [4294967295]",
  //   "input": {
  //     "shape": [1],
  //     "data": [
  //       -1,
  //     ],
  //     "dataType": "int8"
  //   },
  //   "type": "uint32",
  //   "expected": {
  //     "shape": [1],
  //     "data": [
  //       4294967295,
  //     ],
  //     "dataType": "uint32"
  //   }
  // },
  // // The value range of int8: [-128, 127]
  // {
  //   "name": "Overflowing cast int64 ['-129', '128'] by int8 is expected to [127, -128]",
  //   "input": {
  //     "shape": [2],
  //     "data": [
  //       '-129', '128',
  //     ],
  //     "dataType": "int64"
  //   },
  //   "type": "int8",
  //   "expected": { // actual output [-128, 127]
  //     "shape": [2],
  //     "data": [
  //       127, -128,
  //     ],
  //     "dataType": "int8"
  //   }
  // },
  // {
  //   "name": "Overflowing cast int32 [-129, 128] by int8 is expected to [127, -128]",
  //   "input": {
  //     "shape": [2],
  //     "data": [
  //       -129, 128,
  //     ],
  //     "dataType": "int32"
  //   },
  //   "type": "int8",
  //   "expected": { // actual output [-128, 127]
  //     "shape": [2],
  //     "data": [
  //       127, -128,
  //     ],
  //     "dataType": "int8"
  //   }
  // },
  // {
  //   "name": "Overflowing cast uint32 [128] by int8 is expected to [-128]",
  //   "input": {
  //     "shape": [1],
  //     "data": [
  //       128,
  //     ],
  //     "dataType": "uint32"
  //   },
  //   "type": "int8",
  //   "expected": { // actual output [127]
  //     "shape": [1],
  //     "data": [
  //       -128,
  //     ],
  //     "dataType": "int8"
  //   }
  // },
  // {
  //   "name": "Overflowing cast uint8 [128] by int8 is expected to [-128]",
  //   "input": {
  //     "shape": [1],
  //     "data": [
  //       128,
  //     ],
  //     "dataType": "uint8"
  //   },
  //   "type": "int8",
  //   "expected": { // actual output [127]
  //     "shape": [1],
  //     "data": [
  //       -128,
  //     ],
  //     "dataType": "int8"
  //   }
  // },
  // The value range of uint8: [0, 255]
  {
    "name": "Overflowing cast int64 ['-2', '-1', '256', '257'] by uint8 is expected to [255, 0, 1]",
    "input": {
      "shape": [4],
      "data": [
        '-2', '-1', '256', '257',
      ],
      "dataType": "int64"
    },
    "type": "uint8",
    "expected": { // actual output [255, 255, 255]
      "shape": [4],
      "data": [
        254, 255, 0, 1
      ],
      "dataType": "uint8"
    }
  },
  {
    "name": "Overflowing cast int32 [-129, 128] by uint8 is expected to [127, -128]",
    "input": {
      "shape": [2],
      "data": [
        -129, 128,
      ],
      "dataType": "int32"
    },
    "type": "int8",
    "expected": { // actual output [-128, 127]
      "shape": [2],
      "data": [
        127, -128,
      ],
      "dataType": "int8"
    }
  },
  {
    "name": "Overflowing cast uint32 [128] by int8 is expected to [-128]",
    "input": {
      "shape": [1],
      "data": [
        128,
      ],
      "dataType": "uint32"
    },
    "type": "int8",
    "expected": { // actual output [127]
      "shape": [1],
      "data": [
        -128,
      ],
      "dataType": "int8"
    }
  },
  {
    "name": "Overflowing cast uint8 [128] by int8 is expected to [-128]",
    "input": {
      "shape": [1],
      "data": [
        128,
      ],
      "dataType": "uint8"
    },
    "type": "int8",
    "expected": { // actual output [127]
      "shape": [1],
      "data": [
        -128,
      ],
      "dataType": "int8"
    }
  },
];

overflowingCastsTests.forEach(
  test => promise_test(async t => {
    const inputDataType = test.input.dataType;
    const input = builder.constant(
      {dataType: inputDataType, dimensions: test.input.shape}, new TypedArrayDict[inputDataType](test.input.data));
    const output = builder.cast(input, test.type);
    const graph = await builder.build({output});
    const result = await context.compute(graph, input, {output: new TypedArrayDict[test.type](sizeOfShape(test.expected.shape))});
    assert_array_equals(result.outputs.output, test.expected.data, test.name);
  }, `[cast] ${test.name}`));