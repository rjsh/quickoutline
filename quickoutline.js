function escRe(string){
  return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

function tr(e, pattern){
  var span = $('<span>').addClass("qoSpan");
  var d = $('<td>').append(span);
  var r = $('<tr>').attr('data-tt-id', e['data-tt-id']).append(d);
  if ('data-tt-parent-id' in e){
    r.attr('data-tt-parent-id', e['data-tt-parent-id']);
  }

  if (!pattern) {
    span.text(e.name);
  } else {
    $.each(e.name.split(pattern), function(i, s){
      span.append(i%2 == 0? s : $("<span>").addClass("qoMatch").text(s));
    });
  }

  r.mouseenter(function(){ focus($(this).parent().find('.selected'), $(this)); });
  r.mousedown(function(ev){ clicky = $(ev.target); })
  r.mouseup(function(ev){ clicky = $(null); })
  span.mousedown(function(ev){
    if (ev.which != 1) {
      return true;
    }
    qoSel();
  });

  return r;
}

function mkPar(e){
  return e.attr('data-tt-parent-id')? tr(headers[parseInt(e.attr('data-tt-parent-id'))]) : false;
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

function focusAuto(){
  var sel = $('#quickoutline .selected');
  var cur = _.min(headers, function(h){ return Math.abs($(h.elem).offset().top - $(document).scrollTop()); });
  cur = $(sprintf('#quickoutline tr[data-tt-id=%s]', cur['data-tt-id']));
  focus(sel, cur);
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
    qoTb($("#treetable_"));
    return;
  }

  var tb = $("<table>");
  var show = {};
  $.each(headers, function(i, e){
    var chars = term.split('');
    var matcher = new RegExp(["(",")"].join(chars.map(escRe).join(".*")), "i");

    if (matcher.test(e.name)) {
      var prev = tr(e, matcher).appendTo(tb);
      var cur = mkPar(prev);
      if ($.isEmptyObject(show)) {
        prev.addClass('selected');
      }
      show[prev.attr('data-tt-id')] = true;

      while(cur && !(cur.attr('data-tt-id') in show)){
        show[cur.attr('data-tt-id')] = true;
        cur.insertBefore(prev);
        prev = cur;
        cur = mkPar(cur);
      }
    }
  })

  $("#treetable_").replaceWith(tb);
  tb.treetable({ expandable: true, initialState: "expanded" })
  tb.attr("id", "treetable_");
}

function qoTb(anchor){
  var replace = anchor.prop("tagName").toLowerCase() == 'table';
  var tb = $("<table>").attr("id", "treetable_");
  if (replace) {
    anchor.replaceWith(tb);
  } else {
    tb.appendTo(anchor);
  }
  $.each(headers, function(i, e){ tr(e).appendTo(tb); });
  tb.treetable({ expandable: true, initialState: "expanded" });
  return tb;
}

function qoHide(){
  $("#quickoutline").hide();
}

function qoBlur(){
  if (clicky.is("span.indenter a")) {
    $("#quickoutline #filter").focus();
    return;
  }
  qoHide();
}

function qoShow(){
  var qo = $("#quickoutline");
  if (qo.is(':visible')){
    return true;
  }

  var in_ = $("#quickoutline #filter");
  in_.val("");
  qoTb($("#treetable_"));
  qo.show();
  in_.focus();
  focusAuto();
}

function qoSel(){
  var sel = $("#quickoutline .selected");
  if (!sel.size()){
     return;
  }

  // console.log(sel.text());
  var ix = Number(sel.attr("data-tt-id"));
  var state = {scrollTop: $(document).scrollTop()};
  var title = $('title').text();
  var path = window.location.pathname + window.location.search;
  window.history.pushState(state, title, path);
  headers[ix].elem.scrollIntoView();

  qoHide();
}

function qoInit(){
  headers = qoTree();

  var qo = $("<div>").attr("id", "quickoutline").css("display", "none").appendTo('body');
  var qoRelative = $("<div>").appendTo(qo).addClass("relative");
  var in_= $("<input>").attr("id", "filter").appendTo(qoRelative);
  var div= $("<div>").attr("id", "menu").appendTo(qoRelative);
  var tb = qoTb(div);

  var input = in_[0];
  var listener = new window.keypress.Listener(input);
  var bindings = {
      "ctrl l":expSel,
      "ctrl i":focusUp,
      "ctrl k":focusDown,
      "ctrl j":findBrToFold,
      "enter":qoSel,
      "alt up":focusFirst,
      "alt down":focusLast,
      "ctrl c":qoHide,
      "ctrl g":qoHide,
  }
  $.each(bindings, function(k, v){ listener.simple_combo(k, v); });

  in_.bind('input', filter);
  in_.focusout(qoBlur);

  Mousetrap.bind("ctrl+o", qoShow)
}

function qoTree(){
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

var headers;
var clicky = $(null);
$(qoInit);
