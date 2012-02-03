var setupCoverList = function() {
  var coverList = $('#covers'),
      covers = coverList.children('.cover');
      listWidth = 0;

  covers.each(function(idx, el) {
    listWidth += $(el).width();
    if (idx !== 0) {
      skewCover(el);
    }
  });
  coverList.css('width', listWidth + 'px');
},

skewCover = function(el) {
  var $el = $(el),
      img = $el.children('img');
  $el.css({ '-moz-perspective': '1200px',
            '-webkit-perspective': '1200px',
            'perspective': '1200px' });
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