var Cover = function(o) {
  this.el = $(o.el).css({ '-moz-perspective': '1200px',
                        '-webkit-perspective': '1200px',
                        'perspective': '1200px' });

  this.imgEl = this.el.children('img');

  this.idx = o.idx;

  this.angledWidth = function() {
    return this.width/2*1.4142; /* 1.4142 == sqrt(2) */
  };

  // direction: 1 === left stack, -1 === right stack
  this.skew = function(direction) {
    var newX, zindex, relativeIdx, angle=45;

    relativeIdx = Math.abs(this.selectedIdx - this.idx);
    zindex = 100 - relativeIdx;

    if (typeof direction === 'undefined') {
      direction = -1;
    }

    angle *= direction;
    if (direction < 0) { // right stack
      newX = this.rightStackBound - 100 + (this.angledWidth()*(relativeIdx-1));
    }
    else { // left stack
      newX = this.leftStackBound - this.angledWidth() - 200*(relativeIdx-1);
    }
    zindex -= this.idx;

    this.el.css({ 'left': newX + 'px',
                  'z-index': zindex });
    this.imgEl.css({ '-moz-transform': 'rotateY(' + angle + 'deg)',
                                  '-webkit-transform': 'rotateY(' + angle + 'deg)',
                                  'transform': 'rotateY(' + angle + 'deg)' });
  };

  this.straighten = function() {
    this.el.css({ 'z-index': 100,
                  'left': this.selectedLeft });
    this.imgEl.css({ '-moz-transform': 'none',
                     '-webkit-transform': 'none',
                     'transform': 'none' });
  };
},

CoverFlow = function() {
  var cf = {
    el:             $('#covers'),
    coverChildren:  [],
    selectedIdx:    0,
    centerPadding:  10,

    setupKeyListeners: function() {
      var _this = this;
      // keypress only works in FF and Opera, so using keydown
      $('html').keydown(function(evt) {
        var KEY_LEFT = 37,
            KEY_RIGHT = 39;
        if (evt.keyCode === KEY_LEFT || evt.keyCode === KEY_RIGHT) {
          _this.switchPicture(evt.keyCode - 38);
          evt.preventDefault();
        }
      });
    },

    // switch selected picture to left or right
    switchPicture: function(direction) {
      var i, len, cover, newSelectedIdx = this.selectedIdx + direction;
      if (newSelectedIdx < 0) {
        newSelectedIdx = 0;
      }
      else if (newSelectedIdx > this.coverChildren.length-1) {
        newSelectedIdx = this.coverChildren.length-1;
      }
      Cover.prototype.selectedIdx = newSelectedIdx;
      if (newSelectedIdx === this.selectedIdx) {
        // reached a bound
        return;
      }

      for (i=0; i<newSelectedIdx; ++i) {
        // all the covers left of the selected cover
        cover = this.coverChildren[i];
        cover.skew(1);
      }
      for (i=newSelectedIdx; i<this.coverChildren.length; ++i) {
        // all the covers right of the selected cover
        cover = this.coverChildren[i];
        cover.skew(-1);
      }
      // straighten selected
      cover = this.coverChildren[newSelectedIdx];
      cover.straighten();

      this.selectedIdx = newSelectedIdx;
    },

    // set the value for the center "selected" cover
    setSelectedLeft: function() {
      var proto = Cover.prototype;
      proto.selectedLeft = (this.windowWidth - proto.width)/2;
      proto.rightStackBound = proto.selectedLeft + proto.width + this.centerPadding; // the left boundary of the right stack
      proto.leftStackBound = proto.selectedLeft - this.centerPadding;
    },

    init: function() {
      var coverChildren = this.el.children('.cover'),
          coverProto = Cover.prototype,
          i, len, coverChild;

      coverProto.width = 640;
      coverProto.selectedIdx = 0;
      this.windowWidth = $(window).width();
      this.setSelectedLeft();

      for (i=0,len=coverChildren.length; i<len; ++i) {
        coverChild = new Cover({ el: coverChildren[i],
                                 idx: i });
        this.coverChildren.push(coverChild);
        if (i === 0) {
          // initialize first item to be center
          coverChild.straighten();
        }
        else {
          coverChild.skew();
        }
      }

      this.setupKeyListeners();

      return this;
    }
  };

  return cf.init();
};

$(function() {
  var cf = new CoverFlow();
});
