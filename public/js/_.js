var __ = new Object;
__.domain = "/";
__.ajax = function(req, callback) {
  $.ajax({
    url: this.domain + 'ajax',
    type: 'post',
    data: req,
    headers: { "X-CSRF-TOKEN" : "mdai1400" },
    dataType: 'json',
    success: function (data) {
      if(data.status=='success') callback(null, data);
      else callback(data, null);
    }
  });
};

__.tablepagi = function(e, c) {
  var offset = $('.table-slider').scrollLeft();
  var width = $('.table-slider .table-slider-slide').outerWidth();
  console.log(offset, width);
  $('.table-slider').animate({ scrollLeft: ( c ? offset + width + 3.8 : offset - width - 3.8 ) }, 150);
};

__.contactMessage = function(e) {
  e.preventDefault();
  $('.contact-form *').removeClass('required');
  var self = this;
  var data = {};
  data.a       = 'contact_message';
  data.fname    = $('.contact-form [name="fname"]').val();
  data.lname    = $('.contact-form [name="lname"]').val();
  data.phone   = $('.contact-form [name="phone"]').val();
  data.email   = $('.contact-form [name="email"]').val();
  data.message = $('.contact-form [name="message"]').val();

  if(data.fname.length < 5) {
    $('.contact-form [name="fname"]').addClass('required').focus();
    return null;
  }
  if(!data.email.isEmail()) {
    $('.contact-form [name="email"]').addClass('required').focus();
    return null;
  }
  if(data.message.length < 10) {
    $('.contact-form [name="message"]').addClass('required').focus();
    return null;
  }
  $('#contact-form-wrapper').bootloader('show');
  this.ajax(data, function(err, res) {
    if(res) {
      $('.contact-form')[0].reset();
      new Tooltip(res.message, 'success', 'fa fa-check-circle').show(200, true).hide(500, 2500);
    } else {
      new Tooltip(err.message, 'warning', 'fa fa-exclamation').show(200, true).hide(500, 5000);
    }
    $('#contact-form-wrapper').bootloader('hide');
  });
}

__.toFavorites = function(e, pid) {
  var self = this;
  e.preventDefault();
  if(parseInt(pid)) {
    this.ajax({ a: 'to_favorites', p: pid }, function(err, res) {
      if(res) {
        $(e.target)
        .parents('.product-slide-entry').find('.to-favorites-button')
        .removeAttr('onclick').find('span').html('В избранном');
        $(e.target)
        .parents('.detail-info-entry').find('.to-favorites-button')
        .removeAttr('onclick').find('span').html('В избранном');
        new Tooltip(res.sku + ' добавлен в избранное', 'success', 'fa fa-heart').show(200, true).hide(500, 2500);
        self.refreshFavorites();
      }
    });
  }
};

__.toCart = function(e, pid, qty) {
  var self = this;
  var qty = typeof qty === typeof undefined ? 1 : qty;
  e.preventDefault();
  if(parseInt(pid)) {
    this.ajax({ a: 'to_cart', p: pid, q: qty }, function(err, res) {
      if(res) {
        $(e.target)
        .parents('.product-slide-entry').find('.to-cart-button')
        .removeAttr('onclick').find('span').html('В корзине');
        $(e.target)
        .parents('.detail-info-entry').find('.to-cart-button')
        .removeAttr('onclick').find('span').html('В корзине');
        new Tooltip(res.sku + ' добавлен в корзину', 'success', 'fa fa-shopping-cart').show(200, true).hide(500, 2500);
        self.refreshCart();
      }
    });
  }
};



__.removeFromFavoritesPopup = function(e, cid) {
  if(!parseInt(cid)) return null;
  var self = this;
  var tr = $(e.target).parents('.wishlist-entry');
  var overlay = $('#cart-table-overlay');
  var bottomWidth = $(tr).css('width');
  var bottomHeight = $(tr).css('height');
  var rowPos = $(tr).position();
  bottomTop = rowPos.top;
  bottomLeft = rowPos.left;
  overlay.hide();
  overlay.css({
    position: 'absolute',
    top: bottomTop,
    left: bottomLeft,
    width: bottomWidth,
    height: bottomHeight
  }).slideDown(200);
  overlay.find('.confirm').off().on('click', function() {
    self.removeFavorite(e, cid);
    overlay.slideUp(200);
  });
  overlay.find('.decline').off().on('click', function() {
    overlay.slideUp(200);
  });
};

__.removeFavorite = function(e, cid) {
  var self = this;
  e.preventDefault();
  if(parseInt(cid)) {
    this.ajax({ a: 'remove_from_favorites', c: cid }, function(err, res) {
      if(res) {
        self.refreshFavorites();
        new Tooltip('Товар удален из избранных', 'success', 'fa fa-remove').show(200, true).hide(500, 2500);
        $(e.target).parents('.wishlist-entry').remove();
        if(!$('.wishlist-box .wishlist-entry.favorite').length) {
          $('.wishlist-box .wishlist-entry.empty-message').show();
        }
      }
    });
  }
};

__.removeFromCart = function(e, cid) {
  var self = this;
  e.preventDefault();
  if(parseInt(cid)) {
    this.ajax({ a: 'remove_from_cart', c: cid }, function(err, res) {
      if(res) {
        self.refreshCart();
        new Tooltip('Товар удален из корзины', 'success', 'fa fa-remove').show(200, true).hide(500, 2500);
        $(e.target).parents('tr').remove();
        $('.cart-table tr[data-rel="'+cid+'"]').remove();
        if(!$('.cart-table .product-row').length) {
          $('.cart-table .empty-message').show();
          $('.clear-cart').remove();
          $('#order-form-wrapper').remove();
        }
      }
    });
  }
};

__.updateQuantity = function(e, cid, qty) {
  var self = this;
  e.preventDefault();
  if(parseInt(cid)) {
    this.ajax({ a: 'update_quantity', c: cid, q: qty }, function(err, res) {
      if(res) {
        var subtotal = (res.product.price * qty).toFixed(2);
        $('.cart-table tr[data-rel="'+cid+'"]').find('.subtotal-value').text(subtotal);
        self.refreshCart();
      }
    });
  }
};

__.removeFromCartPopup = function(e, cid) {
  if(!parseInt(cid)) return null;
  var self = this;
  var tr = $(e.target).parents('tr');
  var overlay = $('#cart-table-overlay');
  var bottomWidth = $(tr).css('width');
  var bottomHeight = $(tr).css('height');
  var rowPos = $(tr).position();
  bottomTop = rowPos.top;
  bottomLeft = rowPos.left;
  overlay.hide();
  overlay.css({
    position: 'absolute',
    top: bottomTop,
    left: bottomLeft,
    width: bottomWidth,
    height: bottomHeight
  }).slideDown(200);
  overlay.find('.confirm').off().on('click', function() {
    self.removeFromCart(e, cid);
    overlay.slideUp(200);
  });
  overlay.find('.decline').off().on('click', function() {
    overlay.slideUp(200);
  });
};

__.refreshCart = function() {
  $('.cart-content').bootloader('show');
  this.ajax({a:'refresh_cart'}, function(err, res) {
    if(res) {
      $('.cart-total').html(res.total);
      $('.cart-content .content-wrapper').html(res.content);
    }
    $('.cart-content').bootloader('hide');
  });
};

__.createOrder = function() {
  $('.order-form *').removeClass('required');
  var self = this;
  var data = {};
  data.a       = 'create_order';
  data.name    = $('[name="customer"]').val();
  data.phone   = $('[name="phone"]').val();
  data.email   = $('[name="email"]').val();
  data.carrier = $('[name="carrier"]').val();
  data.comment = $('[name="comment"]').val();
  data.terms   = $('[name="terms"]:checked').length ? 1 : 0;

  if(data.name.length < 5) {
    $('[name="customer"]').addClass('required').focus();
    return null;
  }
  if(data.phone.length < 15) {
    $('[name="phone"]').addClass('required').focus();
    return null;
  }
  if(!data.email.isEmail()) {
    $('[name="email"]').addClass('required').focus();
    return null;
  }
  if(!data.terms) {
    $('.order-form .check').addClass('required');
    return null;
  }
  $('#cart-table-wrapper').bootloader('show');
  this.ajax(data, function(err, res) {
    if(res) {
      $('#cart-table-wrapper .content-wrapper').html(res.message);
    } else {
      new Tooltip(err.message, 'warning', 'fa fa-exclamation').show(200, true).hide(500, 5000);
    }
    self.refreshCart();
    $('#cart-table-wrapper').bootloader('hide');
  });
};

__.toOrder = function(e, pid) {
  $('.instant-order-form *').removeClass('required');
  var self = this;
  var data = {};
  data.a       = 'create_instant_order';
  data.name    = $('.instant-order-form [name="ocustomer"]').val();
  data.phone   = $('.instant-order-form [name="ophone"]').val();
  data.email   = $('.instant-order-form [name="oemail"]').val();
  data.qty     = parseInt($('.instant-order-form [name="qty"]').val());
  data.pid     = parseInt($('.instant-order-form [name="oproduct"]').val());

  if(data.name.length < 5) {
    $('.instant-order-form [name="ocustomer"]').addClass('required').focus();
    return null;
  }
  if(data.phone.length < 15) {
    $('.instant-order-form [name="ophone"]').addClass('required').focus();
    return null;
  }
  if(!data.email.isEmail()) {
    $('.instant-order-form [name="oemail"]').addClass('required').focus();
    return null;
  }
  $('#product-popup-wrapper').bootloader('show');
  this.ajax(data, function(err, res) {
    if(res) {
      $('#product-popup-wrapper .content-wrapper').html(res.content);
    } else {
      new Tooltip(err.message, 'warning', 'fa fa-exclamation').show(200, true).hide(500, 5000);
    }
    $('#product-popup-wrapper').bootloader('hide');
  });
};

__.refreshFavorites = function() {
  this.ajax({a:'refresh_favorites'}, function(err, res) {
    if(res) {
      $('.favorites-total').html(res.total);
    }
  });
};

__.closeForm = function() {
  $('#search-results').slideUp(200);
  $('.paginator').html('');
  $('.results-count').html('0');
  $('.onpage-count').html('0');
  $('#search-results-products .content').html('');
  $('input[name="q"]').val('');
};

__.search = function(e, page) {
  e.preventDefault();
  var self = this;
  var req = {
    a: 'search',
    p: isDefined(page) ? page : 1,
    q: $('input[name="q"]').val(),
    s: $('select[name="sort"]').val(),
    ppp: $('select[name="ppp"]').val(),
    d: $('.sort-button').hasClass('active') ? 1 : 2
  };
  if(!req.q.trim().length) {
    $('#search-results').slideUp(200);
    return null;
  }
  $('#search-results').slideDown(200);
  $('#search-results-products').bootloader('show');
  this.ajax(req, function(err, res) {
    if(res) {
      $('.paginator').html(res.pagi);
      $('.results-count').html(res.count);
      $('.onpage-count').html(res.onpage);
      $('#search-results-products .content-wrapper').html(res.products);
      self.initTriggers();
    }
    $('#search-results-products').bootloader('hide');
  });
};

__.searchSubmit = function(e) {
  var path = window.location.href.parseURL().path;
  var action = $(e.target).attr('action');
  if(path === action) this.search(e);
};

__.csearch = function(e, page) {
  var self = this;
  e.preventDefault();
  var req = {
    a: 'csearch',
    p: isDefined(page) ? page : 1,
    s: $('select[name="sort"]').val(),
    ppp: $('select[name="ppp"]').val(),
    cat: $('#cat-id').val(),
    pf: $('#price-from').text().trim(),
    pt: $('#price-till').text().trim(),
    d: $('.sort-button').hasClass('active') ? 1 : 2
  };

  $('#category-results-products').bootloader('show');
  this.ajax(req, function(err, res) {
    if(res) {
      $('.paginator').html(res.pagi);
      $('.results-count').html(res.total);
      $('.onpage-count').html(res.onpage);
      $('#category-results-products .content-wrapper').html(res.products);
      self.initTriggers();
    }
    $('#category-results-products').bootloader('hide');
  });
};

__.initTriggers = function() {
  var self = this;
  $('.product-page-form .quantity-value').on('change', function() {
    var price = parseFloat($('.product-page-form .product-price span').text());
    var qty = parseInt($(this).val());
    var total = (price * qty).toFixed(2);
    $('.product-page-form .total-price span').html(total);
  });
  $('#product-popup-wrapper .quantity-value').on('change', function() {
    var price = parseFloat($('.instant-order-form .product-price span').text());
    var qty = parseInt($(this).val());
    var total = (price * qty).toFixed(2);
    $('.instant-order-form .total-price span').html(total);
  });
  $('.open-product').off().on('click', function() {
    var pid = $(this).attr('data-pid');
     self.showPopup($('#product-popup'));
     $('#product-popup-wrapper').bootloader('show');
     self.ajax({ a: 'get_product_popup', p: pid }, function(err, res) {
       if(res) {
         $('#product-popup-wrapper .content-wrapper').html(res.content);
         self.initTriggers();
       }
       $('#product-popup-wrapper').bootloader('hide');
     });
     return false;
  });
  $('.close-popup, .overlay-popup .close-layer').off().on('click', function() {
    $('.overlay-popup.visible').removeClass('active');
    setTimeout(function() {
      $('.overlay-popup.visible').removeClass('visible');
    }, 500);
  });
  $('.sort-button.sort').off().on('click', function(e) {
    $(this).toggleClass('active');
    __.search(e);
  });
  $('.sort-button.csort').off().on('click', function(e) {
    $(this).toggleClass('active');
    __.csearch(e);
  });
  $('.number-plus').off().on('click', function(){
    var divUpd = $(this).parent().find('.number'),
        input = $(this).parent().find('.quantity-value'),
        newVal = parseInt(divUpd.text(), 10)+1;
    divUpd.text(newVal);
    input.val(newVal).trigger('change');
  });
  $('.number-minus').off().on('click', function(){
    var divUpd = $(this).parent().find('.number'),
        input = $(this).parent().find('.quantity-value'),
        newVal = parseInt(divUpd.text(), 10)-1;
    if(newVal > 0) {
      divUpd.text(newVal);
      input.val(newVal).trigger('change');
    }
  });
  $('input.quantity-value').on('change', function(e) {
    __.updateQuantity(e, parseInt($(this).attr('data-rel'), 10), parseInt($(this).val(), 10));
  });
  $('.phone-mask').mask("(000) 000-00-00", {placeholder: "(000) 000-00-00"});
};

__.showPopup = function(el) {
  el.addClass('visible active');
};

$(window).load(function() {
  __.refreshCart();
  __.refreshFavorites();
  __.initTriggers();
  if(query.length) {
    $('.toggle-desktop-menu').click();
    __.search(new Event('woop'));
  }
});

/* extends & polyfills */
var Tooltip = function(message, windowClass, iconClass) {
    this.tooltipbox;
    this.tooltip;
    this.message = message;
    this.playSound = true;
    this.windowClass = typeof windowClass != 'undefined' ? windowClass : '';
    this.iconClass = typeof iconClass != 'undefined' ? iconClass : 'fa-check-square-o';
    this.styles = '<style>'+
    '.tips-pop-up:hover{transition:all .15s;box-shadow: 0px 0px 3px #edeced;box-sizing: border-box;}'+
    '.tips-pop-up{cursor:pointer;position:relative;background: rgba(0, 0, 0, 0.7);margin-top: 10px;border-radius: 5px;right: -300px;padding: 15px 0px 15px 20px;'+
    'color: #fff;z-index: 99999999; max-width: 500px;letter-spacing: 1px;font-size: 18px;opacity:0;}'+
    '.tips-pop-up.success{background: rgba(24, 24, 24, 0.8);}'+
    '.tips-pop-up.warning{background: rgba(248, 0, 0, 0.7);}'+
    '.tips-pop-up .close{float: right; cursor: pointer; transition: all .15s;}'+
    '.tips-pop-up .close:hover{transform: scale(1.3);}'+
    '.tips-pop-up .content p{display: inline-block; margin: 0; padding: 10px;text-transform: lowercase;font-size: 14px;}'+
    '.tips-pop-up .content i{position: absolute;top: 3px;left: 3px;font-size: 30px;}'+
    '.tips-pop-up .content{clear: both; padding: 0 35px;position: relative;}</style>';
    this.html = '<div class="tips-pop-up '+this.windowClass+'">'+ this.styles +
                    '<div class="content">'+
                        '<i class="'+this.iconClass+'"></i>'+
                        '<p>'+this.message+'</p>'+
                    '</div>'+
                '</div>';
    this.box = '<div class="tips-pop-up-box"><style>.tips-pop-up-box{ position: fixed;top: 10px;right: 10px;z-index: 999;}</style></div>';
    return this;
};

Tooltip.prototype.show = function(delay, sound) {
    var self = this;
    self.playSound = typeof sound != 'undefined' ? sound : self.playSound;
    self.tooltipbox = $(self.box);
    self.tooltip = $(self.html);
    self.tooltips = $('.tips-pop-up');

    if(!$('body').find('.tips-pop-up-box').length) $('body').append(self.tooltipbox);
    $('.tips-pop-up-box').append(self.tooltip);

    self.tooltip.animate({
        right : '10px',
        opacity : 1
    }, delay, function() {
        if(sound) {
            var a = new Audio("../note.mp3");
            a.volume = 0.4;
            a.play();
        }
    });
    self.tooltip.off().on('click', function() {
        self.hide(delay * 2);
    });
    return self;
};

Tooltip.prototype.hide = function(delay, timeout) {
    var self = this;
    timeout = typeof timeout != 'undefined' ? timeout : 0;
    setTimeout(function() {
      $(self.tooltip).animate({
        opacity : 0
      }, delay, function() {
          self.tooltip.remove();
      });
    }, timeout);
    return null;
};

$.prototype.blur = function(size) {
  $(this).css({
    '-webkit-filter': size ? 'blur('+size+'px)' : '',
    '-moz-filter': size ? 'blur('+size+'px)' : '',
    '-o-filter': size ? 'blur('+size+'px)' : '',
    '-ms-filter': size ? 'blur('+size+'px)' : '',
    'filter': size ? 'blur('+size+'px)' : ''
  });
  return this;
};

$.prototype.bootloader = function(act) {
    var self = this;
    var styles =
    ".bootloader{position: absolute;top: 0;left: 0;width: 100%;height: 100%;min-height: 70px;background: rgba(39, 46, 52, 0.6);z-index: 99;text-align: center;}"+
    ".bootloader:before {content: '';display: inline-block;vertical-align: middle;height: 100%;}"+
    ".bootloader .process{vertical-align: middle;position: relative;width: auto;display: inline-block;font-size:40px;}"+
    ".bootloader .spinner{position: relative; z-index: -1; width: 100%; height: 100%; -webkit-animation: rotate 3s infinite linear;"+
    "-o-animation: rotate 3s infinite linear;-moz-animation: rotate 3s infinite linear; -ms-animation: rotate 3s infinite linear;}"+
    ".bootloader .spinner-wrapper{margin: auto;width: 123px;height: 123px;padding: 15px;}"+
    "@-webkit-keyframes rotate {from { -webkit-transform: rotate( 0deg ); } to { -webkit-transform: rotate( 360deg );}}"+
    "@keyframes rotate {from { -webkit-transform: rotate( 0deg ); } to { -webkit-transform: rotate( 360deg );}}";

    var html = '<div class="bootloader" style="display:none;">'+
                    '<style>'+styles+'</style>'+
                    '<span class="process">'+
                        '<div class="spinner-wrapper">'+
                          '<div class="spinner"><i class="fa fa-cog" style="font-size: 95px;color: #efedef;"></i></div>'+
                        '</div>'+
                    '</span>'+
                '</div>';

    if(act=='show') {
        $(self).find('.bootloader').remove().end()
        .css('position','relative').find('.content-wrapper').blur(2).end()
        .prepend(html).find('.bootloader').fadeIn(300);
    } else if(act=='hide') {
        $(self).css('position','relative').find('.content-wrapper').blur(0).end()
        .find('.bootloader').fadeOut(300, function() { $(this).remove() });
    }
    return self;
}

if(typeof isDefined !== "function") {
  var isDefined = function(v) {
    return typeof v !== typeof undefined;
  };
}

String.prototype.isEmail = function() {
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(this);
};

$.fn.scrollToElement = function(offset) {
    offset = typeof offset == 'undefined' ? 0 : offset;
    $('html, body').animate({ scrollTop: ($(this).offset().top - offset) + 'px' }, 300);
    return this;
}

if(!$.prototype.hasAttr) {
  $.prototype.hasAttr = function(attr) {
    var attr = $(this).attr(attr);
    return typeof attr !== typeof undefined && attr !== false;
  };
}

if(!$.prototype.visible) {
  $.prototype.visible = function() {
    $(this).css('visibility','visible');
    return this;
  };
}

if(!$.prototype.invisible) {
  $.prototype.invisible = function() {
    $(this).css('visibility','hidden');
    return this;
  };
}

if(!String.prototype.startsWith) {
  String.prototype.startsWith = function(str) {
    return str.length > 0 && this.substring(0, str.length) === str;
  }
}

if (!Array.prototype.includes) {
  Array.prototype.includes = function(searchElement/*, fromIndex*/) {
    'use strict';
    var O = Object(this);
    var len = parseInt(O.length) || 0;
    if (len === 0) {
      return false;
    }
    var n = parseInt(arguments[1]) || 0;
    var k;
    if (n >= 0) {
      k = n;
    } else {
      k = len + n;
      if (k < 0) {
        k = 0;
      }
    }
    while (k < len) {
      var currentElement = O[k];
      if (searchElement === currentElement ||
         (searchElement !== searchElement && currentElement !== currentElement)
      ) {
        return true;
      }
      k++;
    }
    return false;
  };
}

String.prototype.parseURL = function() {
    var parser = document.createElement('a'), queries, split, i;
    parser.href = this;
    queries = parser.search.replace(/^\?/, '').split('&');
    for(i=0;i<queries.length;i++) { split = queries[i].split('='); }
    return {
        protocol:   parser.protocol,
        host:       parser.host,
        hostname:   parser.hostname,
        port:       parser.port,
        path:       parser.pathname.replace(/\/+$/,''),
        search:     parser.search,
        hash:       parser.hash
    };
};
/* extends & polyfills */
