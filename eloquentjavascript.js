var eloquentjavascript = {
  pages: [
    {
      "depth": 1,
      "href": "index.html",
      "title": "Cover page"
    },
    {
      "depth": 1,
      "href": "contents.html",
      "title": "Contents"
    },
    {
      "depth": 1,
      "href": "chapter1.html",
      "title": "1. Introduction"
    },
    {
      "depth": 1,
      "href": "chapter2.html",
      "title": "2. Basic JavaScript: values, variables, and control flow"
    },
    {
      "depth": 1,
      "href": "chapter3.html",
      "title": "3. Functions"
    },
    {
      "depth": 1,
      "href": "chapter4.html",
      "title": "4. Data structures: Objects and Arrays"
    },
    {
      "depth": 1,
      "href": "chapter5.html",
      "title": "5. Error Handling"
    },
    {
      "depth": 1,
      "href": "chapter6.html",
      "title": "6. Functional Programming"
    },
    {
      "depth": 1,
      "href": "chapter7.html",
      "title": "7. Searching"
    },
    {
      "depth": 1,
      "href": "chapter8.html",
      "title": "8. Object-oriented Programming"
    },
    {
      "depth": 1,
      "href": "chapter9.html",
      "title": "9. Modularity"
    },
    {
      "depth": 1,
      "href": "chapter10.html",
      "title": "10. Regular Expressions"
    },
    {
      "depth": 1,
      "href": "chapter11.html",
      "title": "11. Web programming: A crash course"
    },
    {
      "depth": 1,
      "href": "chapter12.html",
      "title": "12. The Document-Object Model"
    },
    {
      "depth": 1,
      "href": "chapter13.html",
      "title": "13. Browser Events"
    },
    {
      "depth": 1,
      "href": "chapter14.html",
      "title": "14. HTTP requests"
    },
    {
      "depth": 1,
      "href": "appendix1.html",
      "title": "A1. More (obscure) control structures"
    },
    {
      "depth": 1,
      "href": "appendix2.html",
      "title": "A2. Binary Heaps"
    },
    {
      "depth": 1,
      "href": "terms.html",
      "title": "Alphabetic index of terms"
    }
  ],

  searchUrl: (function() {
    var goog = "https://www.googleapis.com/customsearch/v1";
    var ps = $.param({
      key: "AIzaSyC-mnUNGwiL-QtZoSGtgNE4T261K7PoUPs",
        cx: "004210125729156466297:ic6nv-e3hgi",
        siteSearch: "eloquentjavascript.net",
        fileType: "html",
        q: "-inurl:https -inurl:fr -inurl:2nd_edition -inurl:print "
    });
    return goog + "?" + ps;
  })(),

  matches: "goog",
  pattern: ""
}
