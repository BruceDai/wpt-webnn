// META: title=test WebNN API squeeze operation
// META: global=window,dedicatedworker
// META: script=./resources/utils.js
// META: timeout=long

'use strict';

// https://webmachinelearning.github.io/webnn/#api-mlgraphbuilder-squeeze

let context;
let builder;

const testSqueeze = async (syncFlag, oldShape, axes, expectedShape) => {
  const x = builder.input('x', {type: 'float32', dimensions: oldShape});
  const y = builder.squeeze(x, {axes});
  const bufferSize = sizeOfShape(oldShape);
  const inputBuffer = new Float32Array(bufferSize);

  for (let i = 0; i < inputBuffer.length; ++i) {
    inputBuffer[i] = Math.random();
  }

  const inputs = {'x': inputBuffer};
  const outputs = {'y': new Float32Array(sizeOfShape(expectedShape))};
  let graph;

  if (syncFlag) {
    graph = builder.build({y});
    context.compute(graph, inputs, outputs);
  } else {
    graph = await builder.buildAsync({y});
    await context.computeAsync(graph, inputs, outputs);
  }

  assert_array_approx_equals_ulp(outputs.y, inputBuffer, ULPTolerance.float32.squeeze, 'float32');
};

ExecutionArray.forEach(executionType => {
  const isSync = executionType === 'sync';
  if (self.GLOBAL.isWindow() && isSync) {
    return;
  }

  const targetDeviceTypeArray = getTargetDeviceTypeArray();
  targetDeviceTypeArray.forEach(deviceType => {
    promise_setup(async () => {
      await navigator.ml.createContext({deviceType}).then((ret) => context = ret);
      builder = new MLGraphBuilder(context);
    });

    promise_test(async () => {
      // 2D
      await testSqueeze(isSync, [1, 3], undefined, [3]);
      await testSqueeze(isSync, [3, 1], undefined, [3]);
      // 3D
      await testSqueeze(isSync, [3, 1, 1], undefined, [3]);
      await testSqueeze(isSync, [1, 3, 1], undefined, [3]);
      await testSqueeze(isSync, [1, 1, 3], undefined, [3]);
      await testSqueeze(isSync, [1, 3, 4], undefined, [3, 4]);
      await testSqueeze(isSync, [3, 1, 4], undefined, [3, 4]);
      await testSqueeze(isSync, [3, 4, 1], undefined, [3, 4]);
      // 4D
      await testSqueeze(isSync, [1, 1, 3, 1], undefined, [3]);
      await testSqueeze(isSync, [1, 1, 3, 4], undefined, [3, 4]);
      await testSqueeze(isSync, [1, 3, 4, 5], undefined, [3, 4, 5]);
      await testSqueeze(isSync, [3, 1, 4, 5], undefined, [3, 4, 5]);
      await testSqueeze(isSync, [3, 4, 1, 5], undefined, [3, 4, 5]);
      await testSqueeze(isSync, [3, 4, 5, 1], undefined, [3, 4, 5]);
      // 5D
      await testSqueeze(isSync, [1, 3, 1, 1, 1], undefined, [3]);
      await testSqueeze(isSync, [1, 3, 1, 4, 1], undefined, [3, 4]);
      await testSqueeze(isSync, [1, 3, 1, 4, 5], undefined, [3, 4, 5]);
      await testSqueeze(isSync, [1, 3, 4, 5, 6], undefined, [3, 4, 5, 6]);
      await testSqueeze(isSync, [3, 1, 4, 5, 6], undefined, [3, 4, 5, 6]);
      await testSqueeze(isSync, [3, 4, 1, 5, 6], undefined, [3, 4, 5, 6]);
      await testSqueeze(isSync, [3, 4, 5, 1, 6], undefined, [3, 4, 5, 6]);
      await testSqueeze(isSync, [3, 4, 5, 6, 1], undefined, [3, 4, 5, 6]);
    }, `test squeeze with default axes options / ${deviceType} / ${executionType}`);

    promise_test(async () => {
      // 2D
      await testSqueeze(isSync, [1, 3], [0], [3]);
      await testSqueeze(isSync, [3, 1], [1], [3]);
      // 3D
      await testSqueeze(isSync, [3, 1, 1], [1, 2], [3]);
      await testSqueeze(isSync, [1, 3, 1], [0, 2], [3]);
      await testSqueeze(isSync, [1, 1, 3], [0, 1], [3]);
      await testSqueeze(isSync, [1, 3, 4], [0], [3, 4]);
      await testSqueeze(isSync, [3, 1, 4], [1], [3, 4]);
      await testSqueeze(isSync, [3, 4, 1], [2], [3, 4]);
      // 4D
      await testSqueeze(isSync, [1, 1, 3, 1], [0, 1, 3], [3]);
      await testSqueeze(isSync, [1, 1, 3, 4], [0, 1], [3, 4]);
      await testSqueeze(isSync, [1, 3, 4, 5], [0], [3, 4, 5]);
      await testSqueeze(isSync, [3, 1, 4, 5], [1], [3, 4, 5]);
      await testSqueeze(isSync, [3, 4, 1, 5], [2], [3, 4, 5]);
      await testSqueeze(isSync, [3, 4, 5, 1], [3], [3, 4, 5]);
      // 5D
      await testSqueeze(isSync, [1, 3, 1, 1, 1], [0, 2, 3, 4], [3]);
      await testSqueeze(isSync, [1, 3, 1, 4, 1], [0, 2, 4], [3, 4]);
      await testSqueeze(isSync, [1, 3, 1, 4, 5], [0, 2], [3, 4, 5]);
      await testSqueeze(isSync, [1, 3, 4, 5, 6], [0], [3, 4, 5, 6]);
      await testSqueeze(isSync, [3, 1, 4, 5, 6], [1], [3, 4, 5, 6]);
      await testSqueeze(isSync, [3, 4, 1, 5, 6], [2], [3, 4, 5, 6]);
      await testSqueeze(isSync, [3, 4, 5, 1, 6], [3], [3, 4, 5, 6]);
      await testSqueeze(isSync, [3, 4, 5, 6, 1], [4], [3, 4, 5, 6]);
    }, `test squeeze with specified  axes options / ${deviceType} / ${executionType}`);
  });
});
