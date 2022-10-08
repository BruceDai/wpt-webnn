self.GLOBAL = {
  isWindow: function() { return false; },
  isWorker: function() { return true; },
  isShadowRealm: function() { return false; },
};
importScripts("../resources/testharness.js");
self.META_TITLE = "test WebNN API pooling operations";
importScripts("./resources/utils.js")
importScripts("./pool2d.https.any.js");
done();