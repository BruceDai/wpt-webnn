// META: title=test WebNN API reduceLogSumExp operation
// META: global=window,dedicatedworker
// META: script=./resources/utils.js
// META: timeout=long

'use strict';

// https://webmachinelearning.github.io/webnn/#api-mlgraphbuilder-reduce

testWebNNOperation(
  [
    'reduceLogSumExp',
  ],
  buildOperationWithSingleInput
);