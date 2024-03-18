// META: title=validation tests for WebNN API build interface
// META: global=window,dedicatedworker
// META: script=../resources/utils_validation.js
// META: timeout=long

'use strict';

// https://webmachinelearning.github.io/webnn/#api-mlgraphbuilder-build-outputs

promise_test(t => {
  return promise_rejects_js(t, TypeError, builder.build());
}, "[build] TypeError is expected if outputs argument is empty");

