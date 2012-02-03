var setupCoverList = function() {
  var coverList = $('#covers'),
      covers = coverList.children('.cover');
      listWidth = 0;

  covers.each(function(idx, el) {
    //listWidth += $(el).width();
    if (idx !== 0) {
      skewCover(el, idx);
    }
  });
},

skewCover = function(el, idx) {
  var $el = $(el),
      img = $el.children('img'),
      newX,
      zindex = 100;

  newX = 640 + 200*(idx-1);
  zindex -= idx;
  $el.css({ '-moz-perspective': '1200px',
            '-webkit-perspective': '1200px',
            'perspective': '1200px',
            'left': newX + 'px',
            'z-index': zindex });
  img.css({ '-moz-transform': 'rotateY(-45deg)',
            '-webkit-transform': 'rotateY(-45deg)',
            'transform': 'rotateY(-45deg)' });
},

init = function() {
  setupCoverList();
};

$(function() {
  init();
});
