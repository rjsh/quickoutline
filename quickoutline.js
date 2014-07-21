function escRe(string){
  return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
  // return string.replace( /[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&" );
}

function tr(e, pattern){
  var span = $('<span>').addClass("qoSpan");
  var d = $('<td>').append(span);
  var r = $('<tr>').attr('data-tt-id', e['data-tt-id']).append(d);
  if ('data-tt-parent-id' in e){
    r.attr('data-tt-parent-id', e['data-tt-parent-id']);
  }

  if (pattern == "") {
    span.html(e.name);
  } else if (!pattern) {
    span.text(e.name);
  } else {
    $.each(e.name.split(pattern), function(i, s){
      s = _.escape(s).split("\n").join("<br/>");
      // s = $(document.createTextNode(s)).text().replace('\n','<br/>');
      span.append(i%2 == 0? s : $("<span>").addClass("qoMatch").html(s));
    });
  }

  var that = this;
  r.mouseenter(function(){ focus($(this).parent().find('.selected'), $(this)); });
  r.mousedown(function(ev){ clicky = $(ev.target); })
  r.mouseup(function(ev){ clicky = $(null); })
  span.mousedown(function(ev){
    if (ev.which != 1) {
      return true;
    }
    that.qoSel();
  });

  return r;
}

function mkPar(e){
  return e.attr('data-tt-parent-id')? this.tr(this.sources[parseInt(e.attr('data-tt-parent-id'))]) : false;
}

function findBrToFold(){
  var sel = $('#quickoutline .selected');
  if (!sel.size()){
     return;
  }
  if (sel.hasClass('branch') && sel.hasClass('expanded')){
    $('#treetable_').treetable("collapseNode", sel.attr('data-tt-id'));
    return;
  }
  if (!sel.attr('data-tt-parent-id')){
     return;
  }
  sel.removeClass('selected');
  var p = $(sprintf('#quickoutline tr[data-tt-id=%s]', sel.attr('data-tt-parent-id')));
  p.addClass('selected');
}

function focus(from, to) {
  if (!to.size()) {
    return;
  }
  from.removeClass('selected');
  to.addClass('selected');
  to[0].scrollIntoViewIfNeeded();
}

function nextVisible(next, down){
  while (next.size() && !next.is(':visible')) {
    next = down? next.next() : next.prev();
  }
  return next;
}

function focusNext(down){
  var sel = $('#quickoutline .selected');
  var next = nextVisible(down? sel.next() : sel.prev(), down);

  if (next.size()) {
    focus(sel, next);
  } else {
    var end = nextVisible(down? $('#quickoutline tr:first') : $('#quickoutline tr:last'), down);
    focus(sel, end);
  }
}

function focusEnd(top_){
  var sel = $('#quickoutline .selected');
  var up = false;
  var down = true;
  var end = nextVisible(top_? $('#quickoutline tr:first') : $('#quickoutline tr:last'), top_? down : up);
  focus(sel, end);
}

function focusFirst(){
  var top_ = true;
  focusEnd(top_ );
}

function focusLast(){
  var bottom = false;
  focusEnd(bottom);
}

function focusUp(){
  var up = false;
  focusNext(up); 
}

function focusDown(){
  var down = true;
  focusNext(down); 
}

function expSel(){
  var sel = $('#quickoutline .selected');
  if (!sel.size()) {
    return;
  }
  $('#treetable_').treetable('expandNode', sel.attr('data-tt-id'));
}

function filter(){
  var term = $("#filter").val();
  if (!term) {
    this.qoTb($("#treetable_"));
    return;
  }

  var tb = $("<table>");
  var show = {};
  var that = this;
  $.each(this.sources, function(i, e){
    var chars = term.split('');
    var matcher = new RegExp(["(",")"].join(chars.map(escRe).join(".*")), "i");

    if (matcher.test(e.name)) {
      var prev = that.tr(e, matcher).appendTo(tb);
      var cur = that.mkPar(prev);
      if ($.isEmptyObject(show)) {
        prev.addClass('selected');
      }
      show[prev.attr('data-tt-id')] = true;

      while(cur && !(cur.attr('data-tt-id') in show)){
        show[cur.attr('data-tt-id')] = true;
        cur.insertBefore(prev);
        prev = cur;
        cur = that.mkPar(cur);
      }
    }
  })

  $("#treetable_").replaceWith(tb);
  tb.treetable({ expandable: true, initialState: "expanded" })
  tb.attr("id", "treetable_");
}

function qoTb(anchor, pattern){
  var replace = anchor.prop("tagName").toLowerCase() == 'table';
  var tb = $("<table>").attr("id", "treetable_");
  if (replace) {
    anchor.replaceWith(tb);
  } else {
    tb.appendTo(anchor);
  }
  var that = this;
  $.each(this.sources, function(i, e){ that.tr(e, pattern).appendTo(tb); });
  tb.treetable({ expandable: true, initialState: "expanded" });
  return tb;
}

function qoHide(){
  $("#quickoutline").remove();
}

function qoBlur(){
  if (clicky.is("span.indenter a")) {
    $("#quickoutline #filter").focus();
    return;
  }
  qoHide();
}

function qoShow(source){
  var qo = $("<div>").attr("id", "quickoutline").css("z-index", 999999).appendTo('body');
  var qoRelative = $("<div>").appendTo(qo).addClass("relative");
  var in_ = $("<input>").attr("id", "filter").appendTo(qoRelative);
  var spinner = $("<div>").attr("id", "spinner").hide().appendTo(qoRelative);
  var div = $("<div>").attr("id", "menu").appendTo(qoRelative);
  var tb = source.qoTb(div);

  var input = in_[0];
  var listener = new window.keypress.Listener(input);
  var bindings = {
      "ctrl l":expSel,
      "ctrl i":focusUp,
      "ctrl k":focusDown,
      "ctrl j":findBrToFold,
      "alt up":focusFirst,
      "alt down":focusLast,
      "ctrl c":qoHide,
      "ctrl g":qoHide,
  }
  $.each(bindings, function(k, v){
    listener.simple_combo(k, v);
  });

  var in_ = $("#quickoutline #filter");
  in_.off();
  in_.val("");
  in_.focusout(qoBlur);
  in_.bind('input', function(){ source.filter.call(source); });

  var bindings = {
    "enter":"qoSel",
    "ctrl enter":"qoSend",
  };
  $.each(bindings, function(k, v){
    listener.simple_combo(k, function(){ source[v].call(source); });
  });

  source.init();
  source.qoTb($("#treetable_"));
  in_.focus();
  source.focusAuto();
}

function qoInit(){
  var headers = new HeaderSource();

  Mousetrap.bind("ctrl+o", function (){ qoShow(headers); });
  Mousetrap.bind("ctrl+e", function (){ qoShow(new PageSource("pages")); });
  Mousetrap.bind("ctrl+t", function (){ qoShow(new TocSource("toc")); });
  Mousetrap.bind("ctrl+f", function (){ qoShow(new FtsSource()); });

  chrome.runtime.sendMessage({href: window.location.href, ini: true}, function(info) {
    qoHostInfo = info;
  });
}

function headerTree(){
  var hs = [];
  $('h1, h2, h3, h4, h5, h6').map(function(){
    if (!$(this).is(':visible')) {
      return;
    }

    var i = hs.length;
    var h = {name: this.innerText, 'data-tt-id': i, elem: this};
    var level = Number(this.tagName[1]);

    for (var j = i-1; j>=0; j--){
      var levelj = Number(hs[j].elem.tagName[1]);
      if (levelj >= level) {
        continue;
      }
      h["data-tt-parent-id"] = j;
      break;
    }
    hs.push(h);
  });
  return hs;
}

function pageTree(prop) {
  var idx = qoHostInfo[prop];
  if (typeof idx == "string") {
    idx = $(idx);
    if (idx.size()) {
      idx = JSON.parse(idx.text());
    } else {
      idx = [];
    }
  }

  idx.forEach(function(p, i){
    p.name = p.title;
    p["data-tt-id"] = i;
    for (var j = i-1; j>=0; j--){
      var depthj = idx[j].depth;
      if (depthj >= p.depth) {
        continue;
      }
      p["data-tt-parent-id"] = j;
      break;
    }
  });
  return idx;
}

function ftsTree(matches) {
  var i = 0;
  var cur = "";
  var par;
  var sources = [];
  $.each(matches, function(j, m){
    if (m.title != cur) {
      var h = {};
      h.name = cur = m.title + " (" + m.href + ")";
      h["data-tt-id"] = par = i++;
      h.href = m.href;
      h.off = 0;
      sources.push(h);
      cur = m.title;
    }
    m.name = m.snip;
    m["data-tt-id"] = i++;
    m["data-tt-parent-id"] = par;
    sources.push(m);
  });
  return sources;
}

var common = {
  init: function(){},
  filter: filter,
  mkPar: mkPar,
  qoTb: qoTb,
  tr: tr,
  qoSend: function(){},
};

function HeaderSource() {
  this.sources = headerTree();
}

HeaderSource.prototype = $.extend({
  focusAuto: function () {
    var sel = $('#quickoutline .selected');
    var cur = _.min(this.sources, function(h){ return Math.abs($(h.elem).offset().top - $(document).scrollTop()); });
    cur = $(sprintf('#quickoutline tr[data-tt-id=%s]', cur['data-tt-id']));
    focus(sel, cur);
  },

  qoSel: function () {
    var sel = $("#quickoutline .selected");
    if (!sel.size()){
      return;
    }

    var ix = Number(sel.attr("data-tt-id"));
    var state = {scrollTop: $(document).scrollTop()};
    var title = $('title').text();
    var path = window.location.pathname + window.location.search;
    window.history.pushState(state, title, path);

    this.sources[ix].elem.scrollIntoView();
    qoHide();
  }
}, common);

function PageSource(id) {
  this.sources = pageTree(id);
}

PageSource.prototype = $.extend({
  focusAuto: function() {
    var cur;
    var sel = $('#quickoutline .selected');
    var ix = $("html").attr("order");
    if (ix) {
      ix = Number(ix);
      cur = this.sources[ix];
    } else {
      cur = window.location.href;
      cur = this.sources.filter(function(p){ return cur.indexOf(p.href.split('#')[0]) >= 0; });
      cur = _.max(cur, function(p){ return p.href.length; });
    }

    cur = $(sprintf('#quickoutline tr[data-tt-id=%s]', cur['data-tt-id']));
    focus(sel, cur);
  },

  qoSel: function() {
    var sel = $("#quickoutline .selected");
    if (!sel.size()){
       return;
    }

    var ix = Number(sel.attr("data-tt-id"));
    window.location = this.sources[ix].href;
    qoHide();
  }
}, common);

function TocSource(prop) {
  this.sources = pageTree(prop);
}

TocSource.prototype = $.extend({
  focusAuto: function() {
    var sel = $('#quickoutline .selected');
    var order = Number($("html").attr("order"));
    var cur; // this.sources.filter(function(p){ return p.order <= ix; });
    for (var i = 0; i<this.sources.length; i++){
      var p = this.sources[i];
      if (p.order < order ) {
        cur = this.sources[i];
      } else if (p.order == order ) {
        cur = this.sources[i];
        break;
      } else {
        break;
      }
    }
    // cur = cur[cur.length - 1];
    cur = cur? $(sprintf('#quickoutline tr[data-tt-id=%s]', cur['data-tt-id'])) : $('#quickoutline tr:first');
    focus(sel, cur);
  },

  qoSel: PageSource.prototype.qoSel
}, common);

function FtsSource() {
  this.sources = [];
  this.url = qoHostInfo.searchUrl;
}

FtsSource.prototype = $.extend({
  focusAuto: function() {
    var tb = $("<table>");
    tb.attr("id", "treetable_");
    $("#treetable_").replaceWith(tb);
  },

  qoSel: PageSource.prototype.qoSel
}, common, {
  filter: function (){},

  qoSend: function (){
    if (!this.url) {
      return;
    }

    var term = $("#filter").val();
    if (term.length < 3) {
      this.sources = [];
      this.qoTb($("#treetable_"));
      return;
    }

    var tb = $("<table>");
    var that = this;
    var spinner = $("#quickoutline #spinner").toggle();
    $.ajax({
      url: that.url + $.param({q: term}).substr(2)
    }).done(function(matches){
      spinner.toggle();
      chrome.runtime.sendMessage({href:window.location.href, matches: matches}, function(response) {
        that.sources = ftsTree(response.matches);
        that.qoTb($("#treetable_"), response.pattern);

        var sel = $();
        var first = $('#quickoutline tr:first');
        focus(sel, first);
      });
    });
  },

  init: function (){
    this.sources = [];
  }
});


var clicky = $(null);
var qoHostInfo = {toc: [],pages: [], searchUrl: ""};
$(qoInit);
