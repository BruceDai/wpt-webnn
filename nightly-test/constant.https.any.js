// META: title=test WebNN API constant (fill sequence) operation
// META: global=window,dedicatedworker
// META: script=./resources/utils-dt.js
// META: timeout=long

'use strict';

// https://webmachinelearning.github.io/webnn/#api-mlgraphbuilder-constant

testWebNNOperation('constant', buildConstantRange);