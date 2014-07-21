var hosts = {
  "e.pub/": epub,
  "eloquentjavascript.net": eloquentjavascript,
  "developer.apple.com/library/mac/documentation/quicktime/qtff": qtff,
  "book.realworldhaskell.org/read": realworldhaskell
}

var matchFunctions = {
  "goog": function(matches) {
    matches.items.forEach(function(m) {
      m.href = m.link;
      m.snip = m.htmlSnippet;
    });
    return matches.items;
  }
}

chrome.runtime.onMessage.addListener(
  function(request, _, return_) {
    var info = {toc: [],pages: [], searchUrl: ""};
    for (var host in hosts) {
      if (request.href.indexOf(host) >= 0){
        info = hosts[host];
      }
    }

    if (request.ini) {
      var ini = {pages: info.pages, toc: info.toc, searchUrl: info.searchUrl};
      if (!ini.toc) {
        ini.toc = ini.pages;
      }
      if (typeof ini.searchUrl == "function") {
        ini.searchUrl = ini.searchUrl(request.href);
      }
      return_(ini);

    } else if (request.matches) {
      var matchFmt = {pattern: "\0", matches: request.matches};
      if (info.matches) {
        var matches;
        if (typeof info.matches == "function") {
          matches = info.matches;
        } else if (typeof info.matches == "string") {
          matches = matchFunctions[info.matches];
        }
        matchFmt.matches = matches(request.matches);
      }
      if ("pattern" in info) {
        matchFmt.pattern = info.pattern;
      }
      return_(matchFmt);

    }
  }
);
