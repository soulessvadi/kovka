const polyfills = require('../polyfill');
const DB = require('../models/MySQL');
const Async = require('async');
var provider = require('../models/Provider');
const Provider = new provider();

/* INIT */
exports.sid = 0;
exports.initialize = function(req, res, next) {
  this.sid = req.session.id;
  next();
};
/* INIT */

/* HOME */
exports.home = function(req, res, next) {
  Async.parallel({
    menu: function (callback) {
      DB.execute("SELECT * FROM menu WHERE publish = 1 ORDER BY `order`", function(err, res) {
        callback(err, res);
      });
    },
    banners: function (callback) {
      DB.execute("SELECT * FROM banners WHERE publish = 0", function(err, res) {
        callback(err, res);
      });
    },
    categories: function (callback) {
      DB.execute("SELECT C.*, (SELECT COUNT(id) FROM products WHERE cat_id = C.id) as products FROM categories as C WHERE C.publish = 1 ORDER BY C.name", function(err, res) {
        callback(err, res);
      });
    }
  }, function(err, result) {
     if(err) console.log('ERROR OCCURED', err);
     res.render('home', {
       title: 'МЕГАКОВКА : ГЛАВНАЯ СТРАНИЦА',
       menu: result.menu,
       banners: result.banners,
       categories: result.categories,
       mcategories: polyfills.chunk(result.categories.slice(0, 24), 8)
     });
  });
};
/* HOME */

exports.catalog = function(req, res, next) {
  var query = req.query.q ? req.query.q : '';
  Async.parallel({
    menu: function (callback) {
      DB.execute("SELECT * FROM menu WHERE publish = 1 ORDER BY `order`", function(err, res) {
        callback(err, res);
      });
    },
    categories: function (callback) {
      DB.execute("SELECT C.*, (SELECT COUNT(id) FROM products WHERE cat_id = C.id) as products FROM categories as C WHERE C.publish = 1 ORDER BY C.name", function(err, res) {
        callback(err, res);
      });
    }
  }, function(err, result) {
     if(err) console.log('ERROR OCCURED', err);
     res.render('catalog', {
       title: 'МЕГАКОВКА : КАТАЛОГ',
       menu: result.menu,
       categories: result.categories,
       mcategories: polyfills.chunk(result.categories.slice(0, 24), 8),
       query: req.query
     });
  });
};

exports.category = function(req, res, next) {
  var cat = req.params.category;
  Async.parallel({
    menu: function (callback) {
      DB.execute("SELECT * FROM menu WHERE publish = 1 ORDER BY `order`", function(err, res) {
        callback(err, res);
      });
    },
    category: function (callback) {
      DB.execute("SELECT C.* FROM categories as C WHERE C.publish = 1 AND C.alias = '" + cat + "' LIMIT 1", function(err, res) {
        callback(err, res.pop());
      });
    },
    categories: function (callback) {
      DB.execute("SELECT C.*, (SELECT COUNT(id) FROM products WHERE cat_id = C.id) as products FROM categories as C WHERE C.publish = 1 ORDER BY C.name", function(err, res) {
        callback(err, res);
      });
    },
    products: function (callback) {
      Provider.products({
        sid: this.sid,
        cat: cat,
        d: 1
      }, function(err, res) {
        callback(err, res);
      });
    }
  }, function(err, result) {
     if(err) console.log('ERROR OCCURED', err);
     res.render('category', {
       title: 'МЕГАКОВКА : КАТАЛОГ',
       menu: result.menu,
       categories: result.categories,
       mcategories: polyfills.chunk(result.categories.slice(0, 24), 8),
       category: result.category,
       products: result.products
     });
  });
};

exports.favorites = function(req, res, next) {
  var cat = req.params.category;
  Async.parallel({
    menu: function (callback) {
      DB.execute("SELECT * FROM menu WHERE publish = 1 ORDER BY `order`", function(err, res) {
        callback(err, res);
      });
    },
    categories: function (callback) {
      DB.execute("SELECT C.*, (SELECT COUNT(id) FROM products WHERE cat_id = C.id) as products FROM categories as C WHERE C.publish = 1 ORDER BY C.name", function(err, res) {
        callback(err, res);
      });
    },
    favorites: function(callback) {
      Provider.getFavoritesList(this.sid, function(err, res) {
        callback(err, res);
      });
    }
  }, function(err, result) {
     if(err) console.log('ERROR OCCURED', err);
     res.render('favorites', {
       title: 'МЕГАКОВКА : ИЗБРАННЫЕ ТОВАРЫ',
       menu: result.menu,
       favorites: result.favorites,
       categories: result.categories,
       mcategories: polyfills.chunk(result.categories.slice(0, 24), 8)
     });
  });
};

exports.contacts = function(req, res, next) {
  var cat = req.params.category;
  Async.parallel({
    menu: function (callback) {
      DB.execute("SELECT * FROM menu WHERE publish = 1 ORDER BY `order`", function(err, res) {
        callback(err, res);
      });
    },
    categories: function (callback) {
      DB.execute("SELECT C.*, (SELECT COUNT(id) FROM products WHERE cat_id = C.id) as products FROM categories as C WHERE C.publish = 1 ORDER BY C.name", function(err, res) {
        callback(err, res);
      });
    }
  }, function(err, result) {
     if(err) console.log('ERROR OCCURED', err);
     res.render('contacts', {
       title: 'МЕГАКОВКА : КОНТАКТЫ',
       menu: result.menu,
       categories: result.categories,
       mcategories: polyfills.chunk(result.categories.slice(0, 24), 8)
     });
  });
};


exports.delivery = function(req, res, next) {
  var cat = req.params.category;
  Async.parallel({
    menu: function (callback) {
      DB.execute("SELECT * FROM menu WHERE publish = 1 ORDER BY `order`", function(err, res) {
        callback(err, res);
      });
    },
    categories: function (callback) {
      DB.execute("SELECT C.*, (SELECT COUNT(id) FROM products WHERE cat_id = C.id) as products FROM categories as C WHERE C.publish = 1 ORDER BY C.name", function(err, res) {
        callback(err, res);
      });
    }
  }, function(err, result) {
     if(err) console.log('ERROR OCCURED', err);
     res.render('delivery', {
       title: 'МЕГАКОВКА : ДОСТАВКА И ОПЛАТА',
       menu: result.menu,
       categories: result.categories,
       mcategories: polyfills.chunk(result.categories.slice(0, 24), 8)
     });
  });
};

exports.notFound = function(req, res, next) {
  var cat = req.params.category;
  Async.parallel({
    menu: function (callback) {
      DB.execute("SELECT * FROM menu WHERE publish = 1 ORDER BY `order`", function(err, res) {
        callback(err, res);
      });
    },
    categories: function (callback) {
      DB.execute("SELECT C.*, (SELECT COUNT(id) FROM products WHERE cat_id = C.id) as products FROM categories as C WHERE C.publish = 1 ORDER BY C.name", function(err, res) {
        callback(err, res);
      });
    }
  }, function(err, result) {
     if(err) console.log('ERROR OCCURED', err);
     res.render('404', {
       title: 'МЕГАКОВКА : СТРАНИЦА НЕ НАЙДЕНА',
       menu: result.menu,
       categories: result.categories,
       mcategories: polyfills.chunk(result.categories.slice(0, 24), 8)
     });
  });
};

exports.product = function(req, res, next) {
  var cat = req.params.category;
  var product = req.params.product;
  res.render('category', {
    title: 'МЕГАКОВКА'
  });
};

exports.about = function(req, res, next) {
  var cat = req.params.category;
  var product = req.params.product;
  res.render('category', {
    title: 'МЕГАКОВКА'
  });
};

exports.checkout = function(req, res, next) {
  Async.parallel({
    menu: function (callback) {
      DB.execute("SELECT * FROM menu WHERE publish = 1 ORDER BY `order`", function(err, res) {
        callback(err, res);
      });
    },
    categories: function (callback) {
      DB.execute("SELECT C.*, (SELECT COUNT(id) FROM products WHERE cat_id = C.id) as products FROM categories as C WHERE C.publish = 1 ORDER BY C.name", function(err, res) {
        callback(err, res);
      });
    },
    cart: function(callback) {
      Provider.getCartList(this.sid, function(err, res) {
        callback(err, res);
      });
    }
  }, function(err, result) {
     if(err) console.log('ERROR OCCURED', err);
     res.render('checkout', {
       title: 'МЕГАКОВКА : КОРЗИНА',
       menu: result.menu,
       products: result.products,
       categories: result.categories,
       mcategories: polyfills.chunk(result.categories.slice(0, 24), 6),
       cart: result.cart
     });
  });
};

exports.ajax = function(req, res, next) {
  var response = {'status':'failed', 'message':'error occured'},
      params = req.body;
  params.sid = this.sid;
  switch (params.a) {

    case 'search':
      Provider.search(params, function(error, result) {
        if(result) {
          response.status = 'success';
          response.message = '';
          response.products = result.products;
          response.pagi = result.pagi;
          response.count = result.count;
          response.onpage = result.onpage;
        }
        res.send(response);
      });
    break;

    case 'csearch':
      Provider.products(params, function(error, result) {
        if(result) {
          response.status = 'success';
          response.message = '';
          response.products = result.products;
          response.pagi = result.pagi;
          response.count = result.total;
          response.onpage = result.count;
        }
        res.send(response);
      });
    break;

    case 'to_cart':
      Provider.addToCart(params, function(error, result) {
        if(result) {
          response.status = 'success';
          response.message = result.message;
          response.sku = result.sku;
        }
        res.send(response);
      });
    break;

    case 'create_order':
      Provider.createOrder(params, function(error, result) {
        if(result) {
          response.status = 'success';
          response.message = result.message;
        } else {
          response.message = error.message;
        }
        res.send(response);
      });
    break;

    case 'create_instant_order':
      Provider.createInstantOrder(params, function(error, result) {
        if(result) {
          response.status = 'success';
          response.content = result.message;
        } else {
          response.message = error.message;
        }
        res.send(response);
      });
    break;

    case 'remove_from_cart':
      Provider.removeFromCart(params, function(error, result) {
        if(result) {
          response.status = 'success';
          response.message = '';
        }
        res.send(response);
      });
    break;

    case 'remove_from_favorites':
      Provider.removeFromFavorites(params, function(error, result) {
        if(result) {
          response.status = 'success';
          response.message = '';
        }
        res.send(response);
      });
    break;

    case 'update_quantity':
      Provider.updateQuantity(params, function(error, result) {
        if(result) {
          response.status = 'success';
          response.message = '';
          response.product = result;
        }
        res.send(response);
      });
    break;

    case 'refresh_cart':
      Provider.getCart(params, function(error, result) {
        if(result) {
          response.status = 'success';
          response.message = '';
          response.total = result.total;
          response.content = result.content;
        }
        res.send(response);
      });
    break;

    case 'refresh_favorites':
      Provider.getFavorites(params, function(error, result) {
        if(result) {
          response.status = 'success';
          response.message = '';
          response.total = result.total;
        }
        res.send(response);
      });
    break;

    case 'to_favorites':
      Provider.addToFavorites(params, function(error, result) {
        if(result) {
          response.status = 'success';
          response.message = result.message;
          response.sku = result.sku;
        }
        res.send(response);
      });
    break;

    case 'contact_message':
      Provider.contactMessage(params, function(error, result) {
        if(result) {
          response.status = 'success';
          response.message = result.message;
        } else {
          response.message = error.message;
        }
        res.send(response);
      });
    break;

    case 'get_product_popup':
      Provider.getProductPopup(params, function(error, result) {
        if(result) {
          response.status = 'success';
          response.message = result.message;
          response.content = result.content;
        } else {
          response.message = error.message;
        }
        res.send(response);
      });
    break;

    default:
      res.send(response);
    break;
  }
};
