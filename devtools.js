chrome.devtools.panels.create("CF", null, "panel.html", function(panel) {});

chrome.devtools.network.onRequestFinished.addListener(request => {
  const cfStatus = request.response.headers.find(header => header.name.toLowerCase() === 'cf-cache-status');
  if (cfStatus) {
    chrome.devtools.inspectedWindow.eval(
      'console.log("CF Cache Status for URL:", "' + request.request.url + '", "is", "' + cfStatus.value + '")'
    );
  }
});