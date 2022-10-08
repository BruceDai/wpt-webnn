self.GLOBAL = {
  isWindow: function() { return false; },
  isWorker: function() { return true; },
  isShadowRealm: function() { return false; },
};
importScripts("../resources/testharness.js");
self.META_TITLE = "test WebNN API element-wise binary operations";
importScripts("./resources/utils.js")
importScripts("./binary.https.any.js");
done();