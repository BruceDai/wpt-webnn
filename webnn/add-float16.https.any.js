// META: title=test WebNN API element-wise binary operations
// META: global=window,dedicatedworker
// META: script=./resources/utils.js
// META: timeout=long

'use strict';

// https://webmachinelearning.github.io/webnn/#api-mlgraphbuilder-binary

let context;
let builder;

async function testBinary(syncFlag, op, inputA, inputB, isInputBConstant, expected) {
  const x = builder.input('x', {type: 'float16', dimensions: inputA.shape});
  let y;
  let inputs;

  if (isInputBConstant) {
    y = builder.constant(
      {type: 'float16', dimensions: inputB.shape}, new Uint16Array(inputB.data));
    inputs = {'x': new Uint16Array(inputA.data)};
  } else {
    y = builder.input('y', {type: 'float16', dimensions: inputB.shape});
    inputs = {'x': new Uint16Array(inputA.data), 'y': new Uint16Array(inputB.data)};
  }

  const z = builder[op](x, y);
  const outputs = {'z': new Uint16Array(sizeOfShape(expected.shape))};
  let graph;

  if (syncFlag) {
    graph = builder.build({z});
    context.compute(graph, inputs, outputs);
  } else {
    graph = await builder.buildAsync({z});
    await context.compute(graph, inputs, outputs);
  }

  console.log(`11111 ouput ${outputs.z}`);
  console.log(`22222 expect ${expected.data}`);
}

ExecutionArray.forEach(executionType => {
  const isSync = executionType === 'sync';
  if (self.GLOBAL.isWindow() && isSync) {
    return;
  }

  let deviceType = 'gpu';
  promise_setup(async () => {
    await navigator.ml.createContext({type: 'webnn', devicePreference: deviceType}, ).then((ret) => context = ret);
    builder = new MLGraphBuilder(context);
  });

  // [0.7741741271937419, 0.9211952785649888, 0.7848431938480163, 0.10768475786815812]
  // [14898, 15199, 14919, 12004]
  // [0.6825516809505883, 0.0014471660615764659, 0.02932031890075626, 0.7649483401564392]
  // [14710, 5613, 10114, 14879]

  // data for testing add op
  const a = {
    shape: [2, 2],
    data: [ // array([0.7744 , 0.9214 , 0.7847 , 0.10767], dtype=float16)
      14898, 15199, 14919, 12004
    ],
  };
  const b = {
    shape: [2, 2],
    data: [ // array([0.6826  , 0.001447, 0.02933 , 0.765   ], dtype=float16)
      14710, 5613, 10114, 14879
    ],
  };
  const expected = {
    shape: [2, 2],
    data: [ // array([1.457, 0.923, 0.814, 0.873], dtype=float16)
      15828, 15202, 14979, 15100
    ],
  };

  promise_test(async () => {
    await testBinary(isSync, 'add', a, b, false, expected);
  }, `add two float16 inputs  / ${deviceType} / ${executionType}`);

  promise_test(async () => {
    await testBinary(isSync, 'add', a, b, true, expected);
  }, `add float16 input and constant  / ${deviceType} / ${executionType}`);

});