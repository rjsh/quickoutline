var clicky = $(null);

function escRe(string){
  return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

function tr(e, pattern){
  var span = $('<span>').addClass("qoSpan");
  var d = $('<td>').append(span);
  var r = $('<tr>').attr(e).append(d);;

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
  return e.attr('data-tt-parent-id')? tr(elements[parseInt(e.attr('data-tt-parent-id'))]) : false;
}

function findBrToFold(){
  var sel = $('#ebml .selected');
  if (!sel.size()){
     return;
  }
  if (sel.hasClass('branch') && sel.hasClass('expanded')){
    $('#ebml').treetable("collapseNode", sel.attr('data-tt-id'));
    return;
  }
  if (!sel.attr('data-tt-parent-id')){
     return;
  }
  sel.removeClass('selected');
  p = $(sprintf('#ebml tr[data-tt-id=%s]', sel.attr('data-tt-parent-id')));
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
  var sel = $('#ebml .selected');
  var next = nextVisible(down? sel.next() : sel.prev(), down);

  if (next.size()) {
    focus(sel, next);
  } else {
    var end = nextVisible(down? $('#ebml tr:first') : $('#ebml tr:last'), down);
    focus(sel, end);
  }
}

function focusEnd(top_){
  var sel = $('#ebml .selected');
  var up = false;
  var down = true;
  var end = nextVisible(top_? $('#ebml tr:first') : $('#ebml tr:last'), top_? down : up);
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
  var sel = $('#ebml .selected');
  var down = true;
  var first = nextVisible($('#ebml tr:first'), down);
  focus(sel, first); 
}

function expSel(){
  var sel = $('#ebml .selected');
  if (!sel.size()) {
    return;
  }
  $('#ebml').treetable('expandNode', sel.attr('data-tt-id'));
}

function filter(){
  var term = $("#filter").val();
  if (!term) {
    qoTb($("#ebml"));
    return;
  }

  var tb = $("<table>");
  var show = {};
  $.each(elements, function(i, e){
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

  $("#ebml").replaceWith(tb);
  tb.treetable({ expandable: true, initialState: "expanded" })
  tb.attr("id", "ebml");
}

function qoTb(anchor){
  var replace = anchor.prop("tagName").toLowerCase() == 'table';
  var tb = $("<table>").attr("id", "ebml");
  if (replace) {
    anchor.replaceWith(tb);
  } else {
    tb.appendTo(anchor);
  }
  $.each(elements, function(i, e){ tr(e).appendTo(tb); });
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
  qoTb($("#ebml"));
  qo.show();
  in_.focus();
  focusAuto();
}

function qoSel(){
  var sel = $("#quickoutline .selected");
  if (!sel.size()){
     return;
  }

  console.log(sel.text());
  qoHide();
}

function qoInit(){
  var qo = $("<div>").attr("id", "quickoutline").css("display", "none").appendTo('body');
  var in_= $("<input>").attr("id", "filter").appendTo(qo);
  var div= $("<div>").attr("id", "menu").appendTo(qo);
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

  var globHk = new window.keypress.Listener();
  globHk.simple_combo("ctrl o", qoShow);
}

$(document).ready(qoInit);
