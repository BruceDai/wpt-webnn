self.GLOBAL = {
  isWindow: function() { return false; },
  isWorker: function() { return true; },
  isShadowRealm: function() { return false; },
};
importScripts("../resources/testharness.js");
self.META_TITLE = "test WebNN API clamp operation";
importScripts("./resources/utils.js")
importScripts("./clamp.https.any.js");
done();