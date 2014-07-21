var epub = {
  toc: "#__toc__",
  pages: "#__pages__",
  searchUrl: function(href) {
    var host = "e.pub";
    var book = href.split("/")[3];
    var search = ["", book, "search"].join("/");
    return search + "?q=";
  }
};
