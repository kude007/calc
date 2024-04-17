// JS Code mostly from https://gist.github.com/grayrest/284468

var expr = $('.display');

var operations = {
  '\u221A'   : Math.sqrt,
  'x\u00B2'  : function(x){return x * x;},
  '\u00B1'   : function(x){return x * -1;},
  'cos'      : Math.cos,
  'sin'      : Math.sin,
  'tan'      : Math.tan,
  'ln'       : Math.log,
  'exp'      : Math.exp,
  'AC'       : function(){ expr.val('0'); },
  'Del': function(){ expr.val(expr.val().slice(0,-1)); },
  '='        : function(){
    try{
      expr.val(eval(expr.val() || 0))
    } catch (e) {
      operations['AC']();
    }
  }
};

var key_literal = function(which){
  expr.val(expr.val() + String.fromCharCode(which))
}

var key_ops = {
  '13'  : '=',         // Enter
  '107' : '=',         // =
  '8'   : 'Del',       // BS
  '27'  : 'AC'         // Esc
};
$.each(key_ops, function(k,fn){
  key_ops[k] = operations[fn];
});

var key_map = $.extend(key_map,{
  '43'  : key_literal, // +
  '45'  : key_literal, // -
  '42'  : key_literal, // *
  '47'  : key_literal, // /
  '40'  : key_literal, // (
  '41'  : key_literal, // )
  '46'  : key_literal  // .
});

for(var i = 48; i < 58; i++){
  key_map[''+i] = key_literal;
}

$(document).keypress(function(e){
  if(!e.ctrlKey && !e.altKey && !e.metaKey){
    if(e.which in key_map) key_map[e.which](e.which);
  }
});

$(document).keydown(function(e){
  if(!e.ctrlKey && !e.altKey && !e.metaKey){
    if(e.keyCode in key_ops) key_ops[e.keyCode]();
  }
});

expr.keypress(function(e){
  if(!e.ctrlKey && !e.altKey && !e.metaKey){
    if(!(e.which in key_map)){
      e.preventDefault();
    } else {
      e.stopPropagation();
    }
  }
});

var calculator_layout = [
  ['AC'     , '('       , ')'      , 'Del'],
  ['cos'    , 'sin'     , 'tan'          ],
  ['\u221A' , 'x\u00B2' , 'exp'    , 'ln'],
  ['7'      , '8'       , '9'      , '/' ],
  ['4'      , '5'       , '6'      , '*' ],
  ['1'      , '2'       , '3'      , '-' ],
  ['0'      , '.'       , '\u00B1' , '+' ],
  ['=']];

$.each(calculator_layout, function(i, row){
  var el_row = $('<div class="calc_row"></div>');
  $.each(row, function(j, key){
    el_row.append('<input type="button" class="calckey" value="'+key+'" />');
  });
  $('.calculator').append(el_row);
});

$('.calckey')
  .click(function(e){
  var self = $(this),
      val  = self.val();
  if(val in operations){
    if(operations[val].length == 1){
      operations['=']();
      expr.val(operations[val](parseFloat(expr.val())));
    } else {
      operations[val]();
    }
  } else {
    expr.val(expr.val() + val)
  }
});