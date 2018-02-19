const DB = require('./MySQL');
const Async = require('async');

var Provider = function() {  };

Provider.prototype.contactMessage = function(req, callback) {
  var self = this,
      response = {},
      sid = req.sid,
      uid = 0,
      fname = req.fname,
      lname = req.lname,
      phone = req.phone,
      email = req.email,
      message = req.message,
      uid = 0;

    DB.origin.query("INSERT INTO contact_messages SET ?", {
      guest_id : sid,
      user_id : uid,
      fname : fname,
      lname : lname,
      phone : phone,
      email : email,
      message : message,
      created : Date.now()
    }, function(err, res) {
      if(res) response.message = "Спасибо. Мы приняли ваше сообщение."
      else err.message = "По тех. причинам мы не можем принять ваше сообщение.";
      callback(err, response);
    });
};

Provider.prototype.getPageSeo = function(page, callback) {
    DB.execute("SELECT seo_title, seo_keys, seo_desc FROM menu WHERE id = " + page + " LIMIT 1", function(err, res) {
        if(res) callback(null, res.pop());
        else callback(err, null);
    });
};

Provider.prototype.getAllProducts = function(session_id, callback) {
    DB.execute("SELECT P.*, ROUND(P.price, 2) as price, C.name as cat_name, C.alias as cat_alias, "+
      "(SELECT id FROM favorites WHERE prod_id = P.id AND guest_id = '" + session_id + "' LIMIT 1) as in_favorites, " +
      "(SELECT id FROM cart WHERE prod_id = P.id AND guest_id = '" + session_id + "' LIMIT 1) as in_cart " +
      "FROM products as P LEFT JOIN categories as C on C.id = P.cat_id WHERE P.publish = 1 AND C.id > 0 ORDER BY P.sku LIMIT 10000", function(err, res) {
        if(res) callback(null, res);
        else callback(err, null);
    });
};

Provider.prototype.getFeaturedProducts = function(session_id, callback) {
  Async.parallel({
    stock: function (cb) {
      DB.execute("SELECT P.*, ROUND(P.price, 2) as price, C.name as cat_name, C.alias as cat_alias, "+
        "(SELECT id FROM favorites WHERE prod_id = P.id AND guest_id = '" + session_id + "' LIMIT 1) as in_favorites, " +
        "(SELECT id FROM cart WHERE prod_id = P.id AND guest_id = '" + session_id + "' LIMIT 1) as in_cart " +
        "FROM products as P LEFT JOIN categories as C on C.id = P.cat_id WHERE P.is_stock = 1 AND P.publish = 1 LIMIT 8", function(err, res) {
          cb(err, res);
      });
    },
    new: function (cb) {
      DB.execute("SELECT P.*, ROUND(P.price, 2) as price, C.name as cat_name, C.alias as cat_alias, "+
        "(SELECT id FROM favorites WHERE prod_id = P.id AND guest_id = '" + session_id + "' LIMIT 1) as in_favorites, " +
        "(SELECT id FROM cart WHERE prod_id = P.id AND guest_id = '" + session_id + "' LIMIT 1) as in_cart " +
        "FROM products as P LEFT JOIN categories as C on C.id = P.cat_id  WHERE P.is_new = 1 AND P.publish = 1 LIMIT 8", function(err, res) {
          cb(err, res);
      });
    },
    bestsellers: function (cb) {
      DB.execute("SELECT P.*, ROUND(P.price, 2) as price, C.name as cat_name, C.alias as cat_alias, "+
        "(SELECT id FROM favorites WHERE prod_id = P.id AND guest_id = '" + session_id + "' LIMIT 1) as in_favorites, " +
        "(SELECT id FROM cart WHERE prod_id = P.id AND guest_id = '" + session_id + "' LIMIT 1) as in_cart " +
        "FROM products as P LEFT JOIN categories as C on C.id = P.cat_id WHERE P.is_bestseller = 1 AND P.publish = 1 LIMIT 8", function(err, res) {
          cb(err, res);
      });
    }
  }, function(err, result) {
     if(result) callback(err, result);
     else callback(err, null);
  });
};

Provider.prototype.getProduct = function(session_id, sku, callback) {
  DB.execute("SELECT P.*, ROUND(P.price, 2) as price, C.name as cat_name, C.alias as cat_alias, "+
    "(SELECT id FROM favorites WHERE prod_id = P.id AND guest_id = '" + session_id + "' LIMIT 1) as in_favorites, " +
    "(SELECT id FROM cart WHERE prod_id = P.id AND guest_id = '" + session_id + "' LIMIT 1) as in_cart " +
    "FROM products as P LEFT JOIN categories as C on C.id = P.cat_id WHERE  P.sku = '" + sku + "' LIMIT 1", function(err, res) {
      if(res) callback(null, res.pop());
      else callback(err, null);
  });
};

Provider.prototype.addToFavorites = function(req, callback) {
  var self = this,
      response = {},
      pid = req.p,
      sid = req.sid,
      uid = 0;
  DB.execute("SELECT sku FROM products WHERE id = " + pid, function(err, res) {
    if(res && res.length) {
      var sku = res.pop().sku;
      DB.execute("DELETE FROM favorites WHERE guest_id = " + sid + " AND prod_id = " + pid, function(err, res) {
        DB.origin.query("INSERT INTO favorites SET ?", {'user_id':uid, 'guest_id':sid, 'prod_id':pid, 'created':Date.now()}, function(err, res) {
          response.sku = sku;
          callback(err, response);
        });
      });
    } else {
      res.message = 'Товар не найден';
      callback(err, res);
    }
  });
};

Provider.prototype.addToCart = function(req, callback) {
  var self = this,
      response = {},
      pid = parseInt(req.p),
      qty = req.q ? req.q : 1,
      sid = req.sid,
      uid = 0;
  DB.execute("SELECT sku FROM products WHERE id = " + pid, function(err, res) {
    if(res && res.length) {
      var sku = res.pop().sku;
      DB.execute("DELETE FROM cart WHERE guest_id = '" + sid + "' AND prod_id = " + pid, function(err, res) {
        DB.origin.query("INSERT INTO cart SET ?", {'user_id':uid, 'guest_id':sid, 'prod_id':pid, 'quantity':qty, 'created':Date.now()}, function(err, res) {
          console.log(sku);
          response.sku = sku;
          callback(err, response);
        });
      });
    } else {
      res.message = 'Товар не найден';
      callback(err, res);
    }
  });
};

Provider.prototype.removeFromFavorites = function(req, callback) {
  var self = this,
      cid = parseInt(req.c),
      sid = req.sid,
      uid = 0;
  DB.execute("DELETE FROM favorites WHERE guest_id = '" + sid + "' AND id = " + cid, function(err, res) {
      callback(err, res);
  });
};

Provider.prototype.removeFromCart = function(req, callback) {
  var self = this,
      cid = parseInt(req.c),
      sid = req.sid,
      uid = 0;
  DB.execute("DELETE FROM cart WHERE guest_id = '" + sid + "' AND id = " + cid, function(err, res) {
      callback(err, res);
  });
};

Provider.prototype.updateQuantity = function(req, callback) {
  var self = this,
      qty = parseInt(req.q),
      cid = parseInt(req.c),
      sid = req.sid,
      uid = 0;

  Async.parallel({
    product: function (callback) {
      DB.execute("SELECT C.id, (SELECT price FROM products WHERE id = C.prod_id LIMIT 1) as price FROM cart as C WHERE C.guest_id = '" + sid + "' AND C.id = " + cid, function(err, res) {
          callback(err, res);
      });
    },
    update: function (callback) {
      DB.execute("UPDATE cart SET quantity = " + qty + " WHERE guest_id = '" + sid + "' AND id = " + cid, function(err, res) {
          callback(err, res);
      });
    }
  }, function(err, result) {
     if(err) console.log('ERROR OCCURED', err);
     else callback(err, result.product.pop());
  });
};

Provider.prototype.getFavorites = function(params, callback) {
  var self = this,
      response = {},
      session_id = params.sid || 0,
      query = "SELECT favorites.*, P.name, P.alias, P.price, P.cover, C.alias as cat_alias " +
              "FROM favorites " +
              "LEFT JOIN products as P on P.id = favorites.prod_id " +
              "LEFT JOIN categories as C on C.id = P.cat_id " +
              "WHERE guest_id = '" + session_id + "'";
  DB.execute(query, function(err, res) {
    if(res) {
      response.total = parseInt(res.length);
    }
    callback(err, response);
  });
};

Provider.prototype.getProductPopup = function(params, callback) {
  var self = this,
      response = {},
      session_id = params.sid || 0,
      pid = params.p,
      query = "SELECT P.*, IF(CHAR_LENGTH(P.cover) > 1, P.cover, 'default.png') as cover, C.name as cat_name, C.alias as cat_alias, " +
              "(SELECT id FROM favorites WHERE prod_id = P.id AND guest_id = '" + session_id + "' LIMIT 1) as in_favorites, " +
              "(SELECT id FROM cart WHERE prod_id = P.id AND guest_id = '" + session_id + "' LIMIT 1) as in_cart " +
              "FROM products as P " +
              "LEFT JOIN categories as C on C.id = P.cat_id " +
              "WHERE P.id = '" + pid + "' LIMIT 1";
    DB.execute(query, function(err, res) {
      if(res) {
        response.content = self.getProductPopupContent(res);
      }
      callback(err, response);
    });
};

Provider.prototype.createOrder = function(params, callback) {
  var self = this,
      response = {},
      session_id = params.sid || 0,
      user_id = 0,
      name = params.name,
      phone = params.phone,
      email = params.email,
      carrier = params.carrier,
      comment = params.comment,
      terms = params.terms;
  response.message = 'Сейчас мы не можем принять ваш заказ по техническим причинам, попробуйте пожалуйста позже.';
  self.getCartList(session_id, function(err, res) {
    if(res) {
      var products = res.list;
      DB.origin.query("INSERT INTO orders SET ?", {
        guest_id : session_id, user_id : user_id, name : name, phone : phone,
        email : email, comment : comment, carrier : carrier, created : Date.now(),
        modified : Date.now()
      }, function(err, res) {
          if(res) {
            var order_id = res.insertId, o_products = [];
            for(var x in products) {
              o_products.push([
                order_id, products[x].guest_id, products[x].user_id,
                products[x].prod_id, products[x].quantity, Date.now()
              ]);
            }
            DB.origin.query("INSERT INTO orders_products (order_id, guest_id, user_id, prod_id, quantity, created) VALUES ?", [o_products], function(err, res) {
              if(res) {
                response.message = '<p class="orm"><span>Спасибо за доверие</span> <br> Мы свяжемся с Вами для подтверждения информации <br> Номер заказа #' + (order_id + 20000) + '</p>';
                self.clearCart(session_id);
              }
              callback(null, response);
            });
          } else {
            callback(response, null);
          }
      });
    } else {
        response.message = 'Извините за неудобства.  но мы не можем создать пустой заказ.';
        callback(response, null);
    }
  });
};

Provider.prototype.createInstantOrder = function(params, callback) {
  var self = this,
      response = {},
      session_id = params.sid || 0,
      user_id = 0,
      name = params.name,
      pid = params.pid,
      qty = params.qty,
      phone = params.phone,
      email = params.email;
  response.message = 'Сейчас мы не можем принять ваш заказ по техническим причинам, попробуйте пожалуйста позже.';

  DB.origin.query("INSERT INTO orders SET ?", {
    guest_id : session_id, user_id : user_id, name : name, phone : phone, email : email, created : Date.now(), modified : Date.now()
  }, function(err, res) {
      if(res) {
        var order_id = res.insertId;
        DB.origin.query("INSERT INTO orders_products SET ?", {
          order_id: order_id,
          guest_id: session_id,
          user_id: user_id,
          prod_id: pid,
          quantity: qty,
          created: Date.now()
        }, function(err, res) {
          if(res) {
            response.message = '<p class="orm"><span>Спасибо за доверие</span> <br> Мы свяжемся с Вами для подтверждения информации <br> Номер заказа #' + (order_id + 20000) + '</p>';
            self.clearCart(session_id);
          }
          callback(null, response);
        });
      } else {
        callback(response, null);
      }
  });
};

Provider.prototype.clearCart = function(guest_id) {
  DB.execute("DELETE FROM cart WHERE guest_id = '" + guest_id + "'", function(e, r) {
    if(e) console.trace(e);
  });
};

Provider.prototype.getCart = function(params, callback) {
  var self = this,
      response = {},
      session_id = params.sid || 0,
      query = "SELECT cart.*, P.name, P.alias, P.price, P.cover, C.alias as cat_alias " +
              "FROM cart " +
              "LEFT JOIN products as P on P.id = cart.prod_id " +
              "LEFT JOIN categories as C on C.id = P.cat_id " +
              "WHERE guest_id = '" + session_id + "'";
  DB.execute(query, function(err, res) {
    if(res) {
      response.total = res.map( e => e.quantity * e.price );
      response.total = response.total.length ? response.total.reduce( (a, b) => a + b ).toFixed(2) : '0.00';
      response.content = self.getCartContent(res);
    }
    callback(err, response);
  });
};

Provider.prototype.getCartList = function(session_id, callback) {
  var self = this,
      response = {},
      session_id = session_id || 0,
      query = "SELECT cart.*, P.sku, P.name, P.alias, P.price, IF(CHAR_LENGTH(P.cover) > 1, P.cover, 'default.png') as cover, (P.price * cart.quantity) as sum, C.alias as cat_alias, C.name as cat_name " +
              "FROM cart " +
              "LEFT JOIN products as P on P.id = cart.prod_id " +
              "LEFT JOIN categories as C on C.id = P.cat_id " +
              "WHERE guest_id = '" + session_id + "'";
  DB.execute(query, function(err, res) {
    if(res) {
      res.forEach(function(v, k) {
        v.price = v.price.toFixed(2);
        v.sum = v.sum.toFixed(2);
      });
      response.total = res.map( e => e.quantity * e.price );
      response.total = response.total.length ? response.total.reduce( (a, b) => a + b ).toFixed(2) : '0.00';
      response.list = res;
    }
    callback(err, response);
  });
};

Provider.prototype.getFavoritesList = function(session_id, callback) {
  var self = this,
      response = {},
      session_id = session_id || 0,
      query = "SELECT favorites.*, P.id as prod_id, P.sku, P.name, P.alias, P.price, IF(CHAR_LENGTH(P.cover) > 1, P.cover, 'default.png') as cover, C.alias as cat_alias, C.name as cat_name, " +
              "(SELECT id FROM cart WHERE prod_id = P.id AND guest_id = '" + session_id + "' LIMIT 1) as in_cart " +
              "FROM favorites " +
              "LEFT JOIN products as P on P.id = favorites.prod_id " +
              "LEFT JOIN categories as C on C.id = P.cat_id " +
              "WHERE guest_id = '" + session_id + "'";
  DB.execute(query, function(err, res) {
    if(res) {
      res.forEach(function(v, k) {
        v.price = v.price.toFixed(2);
      });
      response.list = res;
    }
    callback(err, response);
  });
};

Provider.prototype.getCartContent = function(list) {
  var html = '';
  if(list.length) {
    for(var x in list) {
      html += '<div class="cart-entry">'+
          '<a class="image" style="background-image: url(/img/products/'+( list[x].cover.length > 1 ? list[x].cover : 'default.png' )+');"></a>'+
          '<div class="content">'+
              '<a class="title" href="/catalog/' + list[x].cat_alias + '/' + list[x].alias + '">' + list[x].name + '</a>'+
              '<div class="quantity">Кол-во: ' + list[x].quantity + '</div>'+
              '<div class="price">' + list[x].price.toFixed(2) + ' ₴</div>'+
          '</div>'+
          '<div class="button-x" onclick="__.removeFromCart(event, ' + list[x].id + ')"><i class="fa fa-close"></i></div>'+
          '<div class="clear"></div>'+
      '</div>';
    }
  } else {
    html = '<div class="cart-entry"><p style="text-align:center;">Корзина пуста</p></div>';
  }
  return html;
};

Provider.prototype.products = function(params, callback) {
  var self = this,
      html = "",
      sortings = { 1 : 'price', 2 : 'name', 3 : 'sku', 4 : 'rank' },
      limits = { 12 : '12', 24 : '24', 36 : '36' },
      order = sortings.hasOwnProperty(params.s) ? sortings[params.s] : sortings[1],
      perpage = limits.hasOwnProperty(params.ppp) ? parseInt(limits[params.ppp]) : parseInt(limits[12]),
      page = parseInt(params.p) || 1,
      price_f = parseInt(params.pf) || 0,
      price_t = parseInt(params.pt) || 99999999,
      session_id = params.sid || 0,
      cat = params.cat || 0,
      dir = params.d == 1 ? 'ASC' : 'DESC',
      limit = page * perpage - perpage + ', ' + perpage,
      query = "SELECT P.*, C.name as cat_name, C.alias as cat_alias, " +
              "(SELECT id FROM favorites WHERE prod_id = P.id AND guest_id = '" + session_id + "' LIMIT 1) as in_favorites, " +
              "(SELECT id FROM cart WHERE prod_id = P.id AND guest_id = '" + session_id + "' LIMIT 1) as in_cart " +
              "FROM products as P " +
              "LEFT JOIN categories as C on C.id = P.cat_id " +
              "WHERE C.alias = '" + cat + "' OR C.id = '" + cat + "' " +
              "AND P.price BETWEEN '" + price_f + "' AND '" + price_t + "' " +
              "ORDER BY P."+order+" "+dir+" LIMIT "+limit+";";
      cquery = "SELECT COUNT(P.id) as count FROM products as P LEFT JOIN categories as C on C.id = P.cat_id " +
               "WHERE C.alias = '" + cat + "' OR C.id = '" + cat + "' " +
               "AND P.price BETWEEN '" + price_f + "' AND '" + price_t + "' LIMIT 1";
  DB.execute(query, function(err, res) {
    var products = self.getProductsHtml(res);
    DB.execute(cquery, function(err2, res2) {
      if(res2) {
        var total = res2[0].count,
            pages = Math.ceil(total/perpage),
            pagi = self.getPagination(page, perpage, pages, 3, 'csearch');
        callback(err, {products: products, count: res.length, total: total, pagi: pagi, perpage: ( total ? perpage : 0 )});
      }
    });
  });
};

Provider.prototype.search = function(params, callback) {
  var self = this,
      html = "",
      sortings = { 1 : 'price', 2 : 'name', 3 : 'sku', 4 : 'rank' },
      limits = { 8 : '8', 16 : '16', 24 : '24' },
      session_id = params.sid,
      order = sortings.hasOwnProperty(params.s) ? sortings[params.s] : sortings[1],
      onpage = limits.hasOwnProperty(params.ppp) ? parseInt(limits[params.ppp]) : parseInt(limits[8]),
      page = parseInt(params.p),
      limit = page * onpage - onpage + ', ' + onpage,
      keyword = params.q.trim(),
      dir = params.d == 1 ? 'ASC' : 'DESC',
      query = keyword === '*'
      ? "SELECT P.*, (SELECT name FROM categories WHERE id = P.cat_id LIMIT 1) as cat_name, " +
        "(SELECT id FROM favorites WHERE prod_id = P.id AND guest_id = '" + session_id + "' LIMIT 1) as in_favorites, " +
        "(SELECT id FROM cart WHERE prod_id = P.id AND guest_id = '" + session_id + "' LIMIT 1) as in_cart, " +
        "(SELECT alias FROM categories WHERE id = P.cat_id LIMIT 1) as cat_alias FROM products as P " +
        "ORDER BY P."+order+" "+dir+" LIMIT "+limit+""
      : "SELECT P.*, (SELECT name FROM categories WHERE id = P.cat_id LIMIT 1) as cat_name, " +
        "(SELECT id FROM favorites WHERE prod_id = P.id AND guest_id = '" + session_id + "' LIMIT 1) as in_favorites, " +
        "(SELECT id FROM cart WHERE prod_id = P.id AND guest_id = '" + session_id + "' LIMIT 1) as in_cart, " +
        "(SELECT alias FROM categories WHERE id = P.cat_id LIMIT 1) as cat_alias FROM products as P " +
        "WHERE P.name LIKE '%"+keyword+"%' OR P.sku LIKE '"+keyword+"%' ORDER BY P."+order+" "+dir+" LIMIT "+limit+"";
      cquery = keyword === '*'
      ? "SELECT COUNT(P.id) as count FROM products as P LIMIT 1"
      : "SELECT COUNT(P.id) as count FROM products as P WHERE P.name LIKE '%"+keyword+"%' OR P.sku LIKE '"+keyword+"%' LIMIT 1";
  DB.execute(query, function(err, res) {
    var products = self.getProductsHtml(res);
    DB.execute(cquery, function(err2, res2) {
      if(res2) {
        var total = res2[0].count,
            pages = Math.ceil(total/onpage),
            pagi = self.getPagination(page, onpage, pages, 3);
        callback(err, {products: products, count: total, pagi: pagi, onpage: ( total ? onpage : 0 )});
      }
    });
  });
};

Provider.prototype.paginator = function(pages, per_page, pages_display) {
	return {
		page: function( page ) {
			var pagi = pages.length > 1 ? pages.concat(pages).concat(pages) : pages;
				current = parseInt(page - 1) + pages.length,
				offset 	= Math.ceil((pages_display - 1) / 2),
				from 	= current - offset,
				till	= current + offset;
			return {
        pages : pagi.slice(from, till + 1),
        prev : pagi.slice(current - 1, current).pop(),
        next : pagi.slice(current + 1, current + 2).pop(),
      };
		}
	};
};

Provider.prototype.getPagination = function(page, per_page, pages_count, pages_display, onclick) {
  var pages_all = [], result = '';
  for(var x = 1; x <= pages_count; x++) pages_all.push(x);
  const paginate = this.paginator(pages_all, per_page, pages_display);
  paginator = paginate.page(page);
  onclick = typeof onclick === typeof undefined ? 'search' : onclick.trim();

  if(pages_count > 1) {
    result += '<a class="square-button" onclick="' + ( ( !paginator.prev ? '' : '__.'+onclick+'(event, ' + ( paginator.prev ) + ' )' ) ) + '"><i class="fa fa-angle-left"></i></a>';
  }
  for(var x in paginator.pages) {
    result += '<a class="square-button ' + ( paginator.pages[x] == page ? 'active' : '' ) + '" onclick="' + ( page == paginator.pages[x] ? '' : '__.'+onclick+'(event, ' + paginator.pages[x] + ' )' ) + '">' + paginator.pages[x] + '</a>';
  }
  if(pages_count > 1) {
    result += '<a class="square-button" onclick="' + ( ( !paginator.next ? '' : '__.'+onclick+'(event, ' + ( paginator.next ) + ' )' ) ) + '"><i class="fa fa-angle-right"></i></a>';
  }
  return result;
};

Provider.prototype.getProductsHtml = function(products) {
  var result = '';
  if(products) {
    for(var x in products) {
      result += '<div class="col-md-3 col-sm-4 col-xs-6 shop-grid-item">'+
          '<div class="product-slide-entry shift-image">'+
              '<div class="product-image" style="background-image: url(/img/products/'+( products[x].cover && products[x].cover.length > 1 ? products[x].cover : 'default.png' )+');">'+
              '<a class="top-line-a right open-product" data-pid="' + products[x].id + '" title="Заказать в два клика"><i class="fa fa-clock-o" style="font-size:16px;"></i> <span>Мгновенный заказ</span></a>'+
                  '<div class="bottom-line"><div class="right-align"><a class="bottom-line-a square to-favorites-button" title="В избранное" '+
                  ( !parseInt(products[x].in_favorites) ? 'onclick="__.toFavorites(event, ' + products[x].id + ')"' : '' ) +
                  '><i class="fa fa-heart"></i></a></div>'+
                  '<div class="left-align"><a class="bottom-line-a to-cart-button" title="Добавить товар в корзину" '+
                  ( !parseInt(products[x].in_cart) ? 'onclick="__.toCart(event, ' + products[x].id + ')"' : '' ) +
                  '><i class="fa fa-shopping-cart" style="font-size:14px;"></i> ' +
                  '<span>' + ( !parseInt(products[x].in_cart) ? 'В корзину' : 'В корзине' ) + '</span></a></div></div>'+
              '</div>'+
              '<a class="tag" href="/catalog/'+products[x].cat_alias+'/" target="_blank" title="'+products[x].cat_name+'">'+products[x].cat_name+'</a>'+
              '<a class="title" href="/catalog/'+products[x].cat_alias+'/'+products[x].sku+'/" target="_blank" title="'+products[x].name+'">'+products[x].name+'</a>'+
              '<div class="article-container style-1">'+
                  '<p>'+products[x].sku+'</p>'+
              '</div>'+
              '<div class="price">'+
                  '<div class="prev"></div>'+
                  '<div class="current">'+products[x].price.toFixed(2)+' ₴</div>'+
              '</div>'+
              '<div class="clear"></div>'+
              '<div class="list-buttons">'+
                  '<a class="button style-10 to-cart-button" '+( !parseInt(products[x].in_cart) ? 'onclick="__.toCart(event, ' + products[x].id + ')"' : '' )+
                  '><span>'+( !parseInt(products[x].in_cart) ? 'В корзину' : 'В корзине' )+'</span></a>'+
                  '<a class="button style-11 to-favorites-button" '+( !parseInt(products[x].in_favorites) ? 'onclick="__.toFavorites(event, ' + products[x].id + ')"' : '' )+
                  '><i class="fa fa-heart"></i> <span>'+( !parseInt(products[x].in_favorites) ? 'В избранное' : 'В избранном' )+'</span></a>'+
              '</div>'+
          '</div>'+
          '<div class="clear"></div>'+
      '</div>';
    }
  } else {
    result = '<h3 style="padding: 30px 0; text-align: center; font-size:14px;">Ничего не найдено</h3>';
  }
  result += '<div class="clear"></div>';
  return result;
};

Provider.prototype.getProductPopupContent = function(products) {
  var result = '';
  if(products) {
    for(var x in products) {
      result += '<div class="row">'+
          '<div class="col-sm-6 col-md-6 col-lg-4 information-entry">'+
              '<div class="product-preview-box">'+
                  '<div class="swiper-container initialized product-preview-swiper">'+
                      '<div class="swiper-wrapper">'+
                          '<div class="swiper-slide">'+
                              '<div class="product-zoom-image">'+
                                  '<img src="/img/products/'+ products[x].cover +'" alt="" />'+
                              '</div>'+
                        '  </div>'+
                      '</div>'+
                  '</div>'+
              '</div>'+
         '</div>'+
          '<div class="col-sm-6 col-md-6 col-lg-8 information-entry">'+
            '  <form class="product-detail-box instant-order-form">'+
                  '<h1 class="product-title">'+ products[x].name +'</h1>'+
                  '<h3 class="product-subtitle">'+ products[x].cat_name +'</h3>'+
                  '<div class="product-description detail-info-entry">'+ products[x].sku +'</div>'+
                  '<div class="price detail-info-entry">'+
                      '<div class="product-price" style="font-size:24px;"><span>'+ products[x].price.toFixed(2) +'</span> ₴</div>'+
                      '<div class="quantity-selector detail-info-entry">'+
                      '<div class="detail-info-entry-title">Количество</div>'+
                      '<div class="entry number-minus">&nbsp;</div>'+
                      '<div class="entry number">1</div>'+
                      '<div class="entry number-plus">&nbsp;</div>'+
                      '<input type="hidden" class="quantity-value" name="qty" value="1">'+
                      '</div>'+
                      '<div class="current total-price"><span>'+ products[x].price.toFixed(2) +'</span> ₴</div>'+
                  '</div>'+
                  '<div class="information-entry">'+
                      '<h3 class="cart-column-title">Данные покупателя <span class="inline-label red">Обязательно</span></h3>'+
                      '<label>Полное имя</label>'+
                      '<input type="text" name="ocustomer" placeholder="ФИО" class="simple-field size-1">'+
                      '<label>Номер телефона</label>'+
                      '<input type="text" name="ophone" placeholder="(099) 999-99-99" class="simple-field size-1 phone-mask">'+
                      '<label>Email</label>'+
                      '<input type="text" name="oemail" placeholder="email@mail.com" class="simple-field size-1">'+
                      '<input type="hidden" name="oproduct" value="'+ products[x].id +'">'+
                      '<label></label>'+
                  '</div>'+
                  '<div class="detail-info-entry">'+
                      '<a class="button style-12 pull-left" onclick="__.toOrder(event, '+ products[x].id +')">ЗАКАЗАТЬ</a>'+
                      '<a class="button style-10 to-cart-button" '+
                      ( !parseInt(products[x].in_cart) ? 'onclick="__.toCart(event, ' + products[x].id + ')"' : '' ) +
                      '><span>' + ( !parseInt(products[x].in_cart) ? 'В КОРЗИНУ' : 'В КОРЗИНЕ' ) + '</span></a>'+
                      '<div class="clear"></div>'+
                  '</div>'+
              '</form>'+
          '</div>'+
      '</div>';
    }
  } else {
    result = '<h3 style="padding: 30px 0; text-align: center; font-size:14px;">Ничего не найдено</h3>';
  }
  return result;
};

module.exports = Provider;
