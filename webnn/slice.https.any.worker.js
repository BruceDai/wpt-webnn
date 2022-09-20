self.GLOBAL = {
  isWindow: function() { return false; },
  isWorker: function() { return true; },
  isShadowRealm: function() { return false; },
};
importScripts("../resources/testharness.js");
self.META_TITLE = "test WebNN API slice operation";
importScripts("./resources/utils.js")
importScripts("./slice.https.any.js");
done();