// META: title=test WebNN API tan operation
// META: global=window,dedicatedworker
// META: script=./resources/utils.js
// META: timeout=long

'use strict';

// https://webmachinelearning.github.io/webnn/#api-mlgraphbuilder-unary

testWebNNOperation('tan', buildOperationWithSingleInput);