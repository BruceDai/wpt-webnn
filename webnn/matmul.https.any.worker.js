self.GLOBAL = {
  isWindow: function() { return false; },
  isWorker: function() { return true; },
  isShadowRealm: function() { return false; },
};
importScripts("../resources/testharness.js");
self.META_TITLE = "test WebNN API matmul operation";
importScripts("./resources/utils.js")
importScripts("./matmul.https.any.js");
done();