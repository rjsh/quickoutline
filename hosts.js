var hosts = {
  "eloquentjavascript.net/1st_edition/": db["eljs1"],
  "book.realworldhaskell.org/read": db["rwhs"],
  "developer.apple.com/library/mac/documentation/quicktime/qtff": db["qtff"],
  "www-cs-students.stanford.edu/~blynn/gitmagic/": db["gitmagic"],
  "gitmagic.lordofbikes.de/book-de/": db["gitmagic_de"],
  "www.catb.org/esr/writings/taoup/html/": db["unix"],
  "mein-deutschbuch.de": db["deutschbuch"],
  "deutschegrammatik20.de": db["grammatik20"],
  "zh.wikisource.org/wiki/%E7%B4%85%E6%A8%93%E5%A4%A2": db["stone"],
  "gameprogrammingpatterns.com": db["gameprogrammingpatterns"],
  "github.com/getify/You-Dont-Know-JS": db["you-dont-know-js"],
  "/Users/rshih/Google%20Drive/e/progit_de/": db["progit_de"],
  "/Users/rshih/Google%20Drive/e/ggd/": db["ggd"],
  "/Users/rshih/Google%20Drive/e/progit/": db["progit"],
  "/Users/rshih/Google%20Drive/e/1984/": db["1984"],
  "/Users/rshih/Google%20Drive/e/poe/": db["poe"],
  "/Users/rshih/Google%20Drive/e/c22/": db["c22"],
  "/Users/rshih/Google%20Drive/e/eljs/": db["eljs"],
  "/Users/rshih/Google%20Drive/e/efjs/": db["efjs"],
  "/Users/rshih/Google%20Drive/e/dict/": db["dict"],
  "/Users/rshih/Google%20Drive/e/keynes/": db["keynes"],
  "/Users/rshih/Google%20Drive/e/poe_de/": db["poe_de"],
  "/Users/rshih/Google%20Drive/e/won/": db["won"],
  "/Users/rshih/Google%20Drive/e/bgb/": db["bgb"],
  "/Users/rshih/Google%20Drive/e/goog/": db["goog"],
  "/Users/rshih/Google%20Drive/e/things/": db["things"],
  "/Users/rshih/Google%20Drive/e/primer/": db["primer"],
  "/Users/rshih/Google%20Drive/e/traum/": db["traum"],
  "/Users/rshih/Google%20Drive/e/bc/": db["bc"],
  "/Users/rshih/Google%20Drive/e/republic/": db["republic"],
  "/Users/rshih/Google%20Drive/e/lb/": db["lb"],
  "/Users/rshih/Google%20Drive/e/lb_de/": db["lb_de"],
  "/Users/rshih/Google%20Drive/e/style/": db["style"],
  "/Users/rshih/Google%20Drive/e/carnegie/": db["carnegie"],
  "/Users/rshih/Google%20Drive/e/org/": db["org"],
  "/Users/rshih/Google%20Drive/e/think/": db["think"],
  "/Users/rshih/Google%20Drive/e/orphan/": db["orphan"],
  "/Users/rshih/Google%20Drive/e/aosa/": db["aosa"],
  "/Users/rshih/Google%20Drive/e/posa/": db["posa"],
  "/Users/rshih/Google%20Drive/e/excpp/": db["excpp"],
  "/Users/rshih/Google%20Drive/e/aosa2/": db["aosa2"],
  "/Users/rshih/Google%20Drive/e/gov/": db["gov"],
  "/Users/rshih/Google%20Drive/e/kiss/": db["kiss"],
  "/Users/rshih/Google%20Drive/e/py-de/": db["py-de"],
  "/Users/rshih/Google%20Drive/e/py/": db["py"],
  "/Users/rshih/Google%20Drive/e/webattack/": db["webattack"],
  "/Users/rshih/Google%20Drive/e/efcpp/": db["efcpp"],
  "/Users/rshih/Google%20Drive/e/android-prog/": db["android-prog"],
  "/Users/rshih/Google%20Drive/e/momofuku/": db["momofuku"],
  "/Users/rshih/Google%20Drive/e/binder/": db["binder"],
  "/Users/rshih/Google%20Drive/e/effcpp2/": db["effcpp2"],
  "end.of.hosts": {}
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
        break;
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
