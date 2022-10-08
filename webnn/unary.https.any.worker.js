self.GLOBAL = {
  isWindow: function() { return false; },
  isWorker: function() { return true; },
  isShadowRealm: function() { return false; },
};
importScripts("../resources/testharness.js");
self.META_TITLE = "test WebNN API element-wise unary operations";
importScripts("./resources/utils.js")
importScripts("./unary.https.any.js");
done();