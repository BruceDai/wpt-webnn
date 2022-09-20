self.GLOBAL = {
  isWindow: function() { return false; },
  isWorker: function() { return true; },
  isShadowRealm: function() { return false; },
};
importScripts("../resources/testharness.js");
importScripts("../resources/webidl2/lib/webidl2.js")
importScripts("../resources/idlharness.js")
importScripts("./resources/utils.js")
importScripts("./idlharness.https.any.js");
done();