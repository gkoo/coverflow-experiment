var Cover = function(el, idx) {
  var $el = $(el);

  $el.css({ '-moz-perspective': '1200px',
            '-webkit-perspective': '1200px',
            'perspective': '1200px' });

  return {
    el: $(el),

    imgEl: $(el).children('img'),

    idx: idx,

    skew: function(direction, selectedIdx) {
      var newX, zindex, angle=45;

      zindex = 100 - Math.abs(selectedIdx - this.idx)

      if (typeof direction === 'undefined') {
        direction = -1;
      }
      angle *= direction;
      newX = 100 + 200*(this.idx);
      zindex -= this.idx;

      this.el.css({ 'left': newX + 'px',
                    'z-index': zindex });
      this.imgEl.css({ '-moz-transform': 'rotateY(' + angle + 'deg)',
                                    '-webkit-transform': 'rotateY(' + angle + 'deg)',
                                    'transform': 'rotateY(' + angle + 'deg)' });
    },

    straighten: function() {
      this.el.css({ 'z-index': 100 });
      this.imgEl.css({ '-moz-transform': 'none',
                       '-webkit-transform': 'none',
                       'transform': 'none' });
    }
  };
},

CoverFlow = function() {
  var cf = {
    el: $('#covers'),

    coverChildren: [],

    selectedIdx: 0,

    setupKeyListeners: function() {
      var _this = this;
      $('body').keypress(function(evt) {
        var KEY_LEFT = 37,
            KEY_RIGHT = 39;
        if (evt.keyCode === KEY_LEFT || evt.keyCode === KEY_RIGHT) {
          _this.switchPicture(evt.keyCode - 38);
          evt.preventDefault();
        }
      });
    },

    switchPicture: function(direction) {
      var i, len, cover, newSelectedIdx = this.selectedIdx + direction;
      if (newSelectedIdx < 0) {
        newSelectedIdx = 0;
      }
      else if (newSelectedIdx > this.coverChildren.length-1) {
        newSelectedIdx = this.coverChildren.length-1;
      }
      if (newSelectedIdx === this.selectedIdx) {
        // reached a bound
        return;
      }

      for (i=0; i<newSelectedIdx; ++i) {
        // all the covers left of the selected cover
        cover = this.coverChildren[i];
        cover.skew(1, newSelectedIdx);
      }
      for (i=newSelectedIdx; i<this.coverChildren.length; ++i) {
        // all the covers right of the selected cover
        cover = this.coverChildren[i];
        cover.skew(-1, newSelectedIdx);
      }
      // straighten selected
      cover = this.coverChildren[newSelectedIdx];
      cover.straighten();

      this.selectedIdx = newSelectedIdx;
    },

    init: function() {
      var coverChildren = this.el.children('.cover'),
          i, len, coverChild;

      for (i=0,len=coverChildren.length; i<len; ++i) {
        coverChild = new Cover(coverChildren[i], i);
        this.coverChildren.push(coverChild);
        coverChild.skew();
      }

      return this;
    }
  };

  return cf.init();
},

init = function() {
  var cf = new CoverFlow();
  cf.setupKeyListeners();
};

$(function() {
  init();
});
