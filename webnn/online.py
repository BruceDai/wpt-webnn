import glob

# Template for <op>.https.any.html
TemplateHTML = """<!doctype html>
<meta charset=utf-8>
<title>%s</title>
<meta name="timeout" content="long">
<script>
self.GLOBAL = {
  isWindow: function() { return true; },
  isWorker: function() { return false; },
  isShadowRealm: function() { return false; },
};
</script>
<script src="../resources/testharness.js"></script>
<script src="../resources/testharnessreport.js"></script>
<script src="./resources/utils.js"></script>
<div id=log></div>
<script src="./%s.js"></script>"""

# Template for <op>.https.any.worker.html
TemplateWorkerHTML = """<!doctype html>
<meta charset=utf-8>
<title>%s</title>
<meta name="timeout" content="long">
<script src="../resources/testharness.js"></script>
<script src="../resources/testharnessreport.js"></script>
<div id=log></div>
<script>
fetch_tests_from_worker(new Worker("./%s.worker.js"));
</script>"""

# Template for <op>.https.any.worker.js
TemplateWorkerJS = """self.GLOBAL = {
  isWindow: function() { return false; },
  isWorker: function() { return true; },
  isShadowRealm: function() { return false; },
};
importScripts("../resources/testharness.js");
self.META_TITLE = "%s";
importScripts("./resources/utils.js")
importScripts("./%s.js");
done();"""

TemplateDict = {
    'html': TemplateHTML,
    'worker.html': TemplateWorkerHTML,
    'worker.js': TemplateWorkerJS 
}

def genForOnline():
    anyJSFileList = glob.glob('*.any.js')
    for jsFile in anyJSFileList:
        if jsFile == 'idlharness.https.any.js':
          continue 
        fileName = jsFile[:-3]
        with open(jsFile) as rf:
            testPurpose = rf.readline()[15:].strip()
        for suffix in ['html', 'worker.html', 'worker.js']:
            fo = open('%s.%s' % (fileName, suffix), 'w')
            fo.write(TemplateDict[suffix] % (testPurpose,fileName))
            fo.close()

if __name__ == '__main__':
    genForOnline()