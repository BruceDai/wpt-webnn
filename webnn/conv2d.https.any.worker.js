self.GLOBAL = {
  isWindow: function() { return false; },
  isWorker: function() { return true; },
  isShadowRealm: function() { return false; },
};
importScripts("../resources/testharness.js");
self.META_TITLE = "test WebNN API conv2d operation";
importScripts("./resources/utils.js")
importScripts("./conv2d.https.any.js");
done();