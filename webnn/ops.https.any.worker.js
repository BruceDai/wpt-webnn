self.GLOBAL = {
  isWindow: function() { return false; },
  isWorker: function() { return true; },
  isShadowRealm: function() { return false; },
};
importScripts("../resources/testharness.js");
self.META_TITLE = "test WebNN API operations";
importScripts("./resources/utils.js")
importScripts("./ops.https.any.js");
done();