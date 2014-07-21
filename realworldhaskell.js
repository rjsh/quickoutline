var realworldhaskell = {
  pages: [
    {
      "href": "/read/why-functional-programming-why-haskell.html",
      "title": "Why functional programming? Why Haskell?",
      "depth": 1
    },
    {
      "href": "/read/getting-started.html",
      "title": "1. Getting started",
      "depth": 1
    },
    {
      "href": "/read/types-and-functions.html",
      "title": "2. Types and functions",
      "depth": 1
    },
    {
      "href": "/read/defining-types-streamlining-functions.html",
      "title": "3. Defining types, streamlining functions",
      "depth": 1
    },
    {
      "href": "/read/functional-programming.html",
      "title": "4. Functional programming",
      "depth": 1
    },
    {
      "href": "/read/writing-a-library-working-with-json-data.html",
      "title": "5. Writing a library: working with JSON data",
      "depth": 1
    },
    {
      "href": "/read/using-typeclasses.html",
      "title": "6. Using typeclasses",
      "depth": 1
    },
    {
      "href": "/read/io.html",
      "title": "7. Input and output",
      "depth": 1
    },
    {
      "href": "/read/efficient-file-processing-regular-expressions-and-file-name-matching.html",
      "title": "8. Efficient file processing, regular expressions, and file name matching",
      "depth": 1
    },
    {
      "href": "/read/io-case-study-a-library-for-searching-the-filesystem.html",
      "title": "9. I/O case study: a library for searching the filesystem",
      "depth": 1
    },
    {
      "href": "/read/code-case-study-parsing-a-binary-data-format.html",
      "title": "10. Code case study: parsing a binary data format",
      "depth": 1
    },
    {
      "href": "/read/testing-and-quality-assurance.html",
      "title": "11. Testing and quality assurance",
      "depth": 1
    },
    {
      "href": "/read/barcode-recognition.html",
      "title": "12. Barcode recognition",
      "depth": 1
    },
    {
      "href": "/read/data-structures.html",
      "title": "13. Data structures",
      "depth": 1
    },
    {
      "href": "/read/monads.html",
      "title": "14. Monads",
      "depth": 1
    },
    {
      "href": "/read/programming-with-monads.html",
      "title": "15. Programming with monads",
      "depth": 1
    },
    {
      "href": "/read/using-parsec.html",
      "title": "16. The Parsec parsing library",
      "depth": 1
    },
    {
      "href": "/read/interfacing-with-c-the-ffi.html",
      "title": "17. The foreign function interface",
      "depth": 1
    },
    {
      "href": "/read/monad-transformers.html",
      "title": "18. Monad transformers",
      "depth": 1
    },
    {
      "href": "/read/error-handling.html",
      "title": "19. Error handling",
      "depth": 1
    },
    {
      "href": "/read/systems-programming-in-haskell.html",
      "title": "20. Systems programming",
      "depth": 1
    },
    {
      "href": "/read/using-databases.html",
      "title": "21. Working with databases",
      "depth": 1
    },
    {
      "href": "/read/extended-example-web-client-programming.html",
      "title": "22. Web client programming",
      "depth": 1
    },
    {
      "href": "/read/gui-programming-with-gtk-hs.html",
      "title": "23. GUI programming",
      "depth": 1
    },
    {
      "href": "/read/concurrent-and-multicore-programming.html",
      "title": "24. Basic concurrent and parallel programming",
      "depth": 1
    },
    {
      "href": "/read/profiling-and-optimization.html",
      "title": "25. Profiling and tuning for performance",
      "depth": 1
    },
    {
      "href": "/read/advanced-library-design-building-a-bloom-filter.html",
      "title": "26. Advanced library design: building a Bloom filter",
      "depth": 1
    },
    {
      "href": "/read/sockets-and-syslog.html",
      "title": "27. Network programming",
      "depth": 1
    },
    {
      "href": "/read/software-transactional-memory.html",
      "title": "28. Software transactional memory",
      "depth": 1
    },
    {
      "href": "/read/installing-ghc-and-haskell-libraries.html",
      "title": "B. Installing GHC and Haskell libraries",
      "depth": 1
    },
    {
      "href": "/read/characters-strings-and-escaping-rules.html",
      "title": "C. Characters, strings, and escaping rules",
      "depth": 1
    },
    {
      "href": "/read/web-site-and-comment-system-usage-and-policies.html",
      "title": "D. Web site and comment system usage and policies",
      "depth": 1
    }
  ],

  searchUrl: (function() {
    var goog = "https://www.googleapis.com/customsearch/v1";
    var ps = $.param({
      key: "AIzaSyC-mnUNGwiL-QtZoSGtgNE4T261K7PoUPs",
        cx: "004210125729156466297:ic6nv-e3hgi",
        siteSearch: "book.realworldhaskell.org/read",
        q: ""
    });
    return goog + "?" + ps;
  })(),

  matches: "goog",
  pattern: ""
}
