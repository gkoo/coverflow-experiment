var CoverFlow = function(opt) {
  var Cover = function(o) {
    this.el = $(o.el).css({ 'bottom': this.paddingBottom,
                            '-moz-perspective': '1200px',
                            '-webkit-perspective': '1200px',
                            'perspective': '1200px' });

    this.childEl = this.el.children().css('width', this.width);

    this.idx = o.idx;

    this.angledWidth = function() {
      return this.width/2*1.4142; /* 1.4142 == sqrt(2) */
    };

    this.rotateY = function(y) {
      // For some reason, setting transform to 0 resets the box-reflect property,
      // so we'll just have to set it very time.
      this.childEl.css({ '-moz-transform': 'rotateY(' + y + 'deg)',
                         //'-o-transform': 'rotateY(' + y + 'deg)',
                         '-webkit-transform': 'rotateY(' + y + 'deg)',
                         'transform': 'rotateY(' + y + 'deg)',
                         '-webkit-box-reflect': 'below 5px -webkit-gradient(linear, left top, left bottom, from(transparent), color-stop(0.5, transparent), to(white))' });
    };

    // direction: 1 === left stack, -1 === right stack
    this.skew = function(direction) {
      var newX, zindex, relativeIdx, angle=45, angWidth = this.angledWidth();

      relativeIdx = Math.abs(this.selectedIdx - this.idx);
      zindex = 100 - relativeIdx;

      if (typeof direction === 'undefined') {
        direction = -1;
      }

      angle *= direction;

      // Determine the new position for the picture.
      if (direction < 0) { // right stack
        newX = this.rightStackBound - angWidth/3 + (angWidth/2*(relativeIdx-1));
      }
      else { // left stack
        newX = this.leftStackBound - angWidth*1.1 - (angWidth/2*(relativeIdx-1));
      }

      this.el.css({ 'left': Math.floor(newX) + 'px',
                    'z-index': zindex });
      this.childEl.css({ 'width': this.width*3/4 });
      this.rotateY(angle);
    };

    this.straighten = function() {
      this.el.css({ 'z-index': 100,
                    'left': this.selectedLeft });
      this.childEl.css({ 'width': this.width });
      this.rotateY(0);
    };
  },

  controller = {
    el:             $('#coverflow-covers'),
    coverChildren:  [],
    selectedIdx:    0,
    centerPadding:  10,

    // Handler for window resize
    resizeCoverFlow: function() {
      var _this = this;

      if (!this.resizing && this.el.width() !== this.width) {
        this.setSelectedLeft();
        this.switchPicture(0);
        this.resizing = 1;
        setTimeout(function() {
          _this.resizing = 0;
        }, 100);
      }
    },

    setupEvents: function() {
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

      if (!this.width) {
        $(window).resize(this.resizeCoverFlow.bind(this));
      }
    },

    //jumpToPicture: function(idx) {
    //},

    // switch selected picture to left or right
    switchPicture: function(direction) {
      var i, len, cover, newSelectedIdx = Cover.prototype.selectedIdx + direction;
      if (newSelectedIdx < 0) {
        return;
      }
      else if (newSelectedIdx > this.coverChildren.length-1) {
        return;
      }
      Cover.prototype.selectedIdx = newSelectedIdx;

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
    },

    // set the value for the center "selected" cover
    setSelectedLeft: function() {
      var proto = Cover.prototype;
      proto.selectedLeft = (this.el.width() - proto.width)/2;
      proto.rightStackBound = proto.selectedLeft + proto.width + this.centerPadding; // the left boundary of the right stack
      proto.leftStackBound = proto.selectedLeft - this.centerPadding;
    },

    init: function() {
      var coverChildren = this.el.children('.coverflow-cover'),
          coverProto = Cover.prototype,
          container = this.el.parent(),
          elCss = {},
          i, len, coverChild;

      // ==============
      // MODULE OPTIONS
      // ==============
      if (opt.minHeight) {
        elCss['minHeight'] = opt.minHeight;
      }
      if (opt.bgColor) {
        elCss['background-color'] = opt.bgColor;
      }
      this.width = opt.width ? opt.width : '100%';
      elCss.width = this.width;
      console.log(elCss);
      this.el.css(elCss);

      coverProto.paddingBottom = opt.paddingBottom ? opt.paddingBottom + 'px' : 0;
      coverProto.width = opt.coverWidth;
      coverProto.selectedIdx = typeof opt.selectedIdx !== 'undefined' ? opt.selectedIdx: 0;

      this.setSelectedLeft();

      for (i=0,len=coverChildren.length; i<len; ++i) {
        coverChild = new Cover({ el: coverChildren[i],
                                 idx: i });
        this.coverChildren.push(coverChild);
      }
      this.switchPicture(0); // do the initial rendering of coverflow

      this.setupEvents();

      return this;
    }
  };

  return controller.init();
};
