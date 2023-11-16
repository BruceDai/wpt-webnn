// META: title=test WebNN API element-wise unary exp operations
// META: global=window,dedicatedworker
// META: script=./resources/utils.js
// META: timeout=long

'use strict';

// https://webmachinelearning.github.io/webnn/#api-mlgraphbuilder-unary

testWebNNOperation(
  ['exp'],
  buildOperationWithSingleInput
);