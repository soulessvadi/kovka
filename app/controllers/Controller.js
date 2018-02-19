const polyfills = require('../polyfill');
const tempy = require('tempy');
const moment = require('moment');
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
      DB.execute("SELECT C.*, (SELECT COUNT(id) FROM products WHERE cat_id = C.id) as products FROM categories as C WHERE C.publish = 1 ORDER BY C.order_number", function(err, res) {
        callback(err, res);
      });
    },
    featured: function (callback) {
      Provider.getFeaturedProducts(this.sid, function(err, res) {
        callback(err, res);
      });
    },
    seo: function (callback) {
      Provider.getPageSeo(1, function(err, res) {
        callback(err, res);
      });
    }
  }, function(err, result) {
     if(err) console.log('ERROR OCCURED', err);
     res.render('home', {
       seo: result.seo,
       menu: result.menu,
       banners: result.banners,
       categories: result.categories,
       featured: result.featured,
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
      DB.execute("SELECT C.*, (SELECT COUNT(id) FROM products WHERE cat_id = C.id) as products FROM categories as C WHERE C.publish = 1 ORDER BY C.order_number", function(err, res) {
        callback(err, res);
      });
    },
    featured: function (callback) {
      Provider.getFeaturedProducts(this.sid, function(err, res) {
        callback(err, res);
      });
    },
    seo: function (callback) {
      Provider.getPageSeo(6, function(err, res) {
        callback(err, res);
      });
    }
  }, function(err, result) {
     if(err) console.log('ERROR OCCURED', err);
     res.render('catalog', {
       seo: result.seo,
       menu: result.menu,
       featured: result.featured,
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
    },
    featured: function (callback) {
      Provider.getFeaturedProducts(this.sid, function(err, res) {
        callback(err, res);
      });
    },
    seo: function (callback) {
      Provider.getPageSeo(1, function(err, res) {
        callback(err, res);
      });
    }
  }, function(err, result) {
     if(err) console.log('ERROR OCCURED', err);
     result.seo.seo_title = result.category.name;
     res.render('category', {
       seo: result.seo,
       menu: result.menu,
       featured: result.featured,
       categories: result.categories,
       mcategories: polyfills.chunk(result.categories.slice(0, 24), 8),
       category: result.category,
       products: result.products
     });
  });
};

exports.product = function(req, res, next) {
  var cat = req.params.category;
  var sku = req.params.product;
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
    },
    featured: function (callback) {
      Provider.getFeaturedProducts(this.sid, function(err, res) {
        callback(err, res);
      });
    },
    product: function (callback) {
      Provider.getProduct(this.sid, sku, function(err, res) {
        callback(err, res);
      });
    },
    seo: function (callback) {
      Provider.getPageSeo(1, function(err, res) {
        callback(err, res);
      });
    }
  }, function(err, result) {
     if(err) console.log('ERROR OCCURED', err);
     res.render('product', {
       seo: result.seo,
       menu: result.menu,
       product: result.product,
       featured: result.featured,
       favorites: result.favorites,
       categories: polyfills.chunk(result.categories.slice(0, 20), 10),
       mcategories: polyfills.chunk(result.categories.slice(0, 24), 8)
     });
  });
};

exports.favorites = function(req, res, next) {
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
    },
    featured: function (callback) {
      Provider.getFeaturedProducts(this.sid, function(err, res) {
        callback(err, res);
      });
    },
    seo: function (callback) {
      Provider.getPageSeo(9, function(err, res) {
        callback(err, res);
      });
    }
  }, function(err, result) {
     if(err) console.log('ERROR OCCURED', err);
     res.render('favorites', {
       seo: result.seo,
       menu: result.menu,
       featured: result.featured,
       favorites: result.favorites,
       categories: result.categories,
       mcategories: polyfills.chunk(result.categories.slice(0, 24), 8)
     });
  });
};

exports.contacts = function(req, res, next) {
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
    featured: function (callback) {
      Provider.getFeaturedProducts(this.sid, function(err, res) {
        callback(err, res);
      });
    },
    seo: function (callback) {
      Provider.getPageSeo(2, function(err, res) {
        callback(err, res);
      });
    }
  }, function(err, result) {
     if(err) console.log('ERROR OCCURED', err);
     res.render('contacts', {
       seo: result.seo,
       menu: result.menu,
       featured: result.featured,
       categories: result.categories,
       mcategories: polyfills.chunk(result.categories.slice(0, 24), 8)
     });
  });
};

exports.about = function(req, res, next) {
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
    featured: function (callback) {
      Provider.getFeaturedProducts(this.sid, function(err, res) {
        callback(err, res);
      });
    },
    seo: function (callback) {
      Provider.getPageSeo(4, function(err, res) {
        callback(err, res);
      });
    }
  }, function(err, result) {
     if(err) console.log('ERROR OCCURED', err);
     res.render('about', {
       seo: result.seo,
       menu: result.menu,
       featured: result.featured,
       categories: result.categories,
       mcategories: polyfills.chunk(result.categories.slice(0, 24), 8)
     });
  });
};

exports.delivery = function(req, res, next) {
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
    featured: function (callback) {
      Provider.getFeaturedProducts(this.sid, function(err, res) {
        callback(err, res);
      });
    },
    seo: function (callback) {
      Provider.getPageSeo(3, function(err, res) {
        callback(err, res);
      });
    }
  }, function(err, result) {
     if(err) console.log('ERROR OCCURED', err);
     res.render('delivery', {
       seo: result.seo,
       menu: result.menu,
       featured: result.featured,
       categories: result.categories,
       mcategories: polyfills.chunk(result.categories.slice(0, 24), 8)
     });
  });
};

exports.pricelist = function(req, res, next) {
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
    featured: function (callback) {
      Provider.getFeaturedProducts(this.sid, function(err, res) {
        callback(err, res);
      });
    },
    products: function (callback) {
      Provider.getAllProducts(this.sid, function(err, res) {
        callback(err, res);
      });
    },
    seo: function (callback) {
      Provider.getPageSeo(5, function(err, res) {
        callback(err, res);
      });
    }
  }, function(err, result) {
     if(err) console.log('ERROR OCCURED', err);
     res.render('pricelist', {
       seo: result.seo,
       menu: result.menu,
       products: result.products,
       featured: result.featured,
       categories: result.categories,
       mcategories: polyfills.chunk(result.categories.slice(0, 24), 8)
     });
  });
};

exports.pricelistxls = function(req, res, next) {
  Provider.getAllProducts(this.sid, function(e, r) {
    if(r) {
      var Excel = require('exceljs');
      var bookname = 'megakovka-com-ua-' + moment().format("DD-MM-YYYY-hh-mm-ss") + '.xlsx';
      var workbook = new Excel.Workbook();
      var worksheet = workbook.addWorksheet('Текущая номенклатура');
      workbook.creator = 'megakovka.com.ua';
      workbook.created = new Date();
      workbook.modified = new Date();
      worksheet.properties.outlineLevelCol = 2;
      worksheet.properties.defaultRowHeight = 20;
      worksheet.columns = [
        { width: 10, style: { alignment : { vertical: 'center', horizontal: 'left' } } },
        { width: 60, style: { alignment : { vertical: 'center', horizontal: 'left' } } },
        { width: 40, style: { alignment : { vertical: 'center', horizontal: 'left' } } },
        { width: 15, style: { alignment : { vertical: 'center', horizontal: 'left' } } },
        { width: 20, style: { alignment : { vertical: 'center', horizontal: 'center' } } }
      ];
      worksheet.mergeCells("A1:E1");
      worksheet.addRow(['№','Группа','Товар','Код товара','Стоимость, ₴']);
      worksheet.getCell('A1').value = { text: 'Прайс-лист МегаКовка [ сгенерирован ' + moment().format("DD.MM.YYYY h:mm:ss") + ' ]', hyperlink: 'http://megakovka.com.ua' };
      worksheet.getCell('A1').style = {font:{ name: 'Arial', size: 13, bold: true }, alignment: { vertical: 'center', horizontal: 'center' }};
      worksheet.getCell('A2').font = { name: 'Arial', bold: true, size: 11 };
      worksheet.getCell('B2').font = { name: 'Arial', bold: true, size: 11 };
      worksheet.getCell('C2').font = { name: 'Arial', bold: true, size: 11 };
      worksheet.getCell('D2').font = { name: 'Arial', bold: true, size: 11 };
      worksheet.getCell('E2').font = { name: 'Arial', bold: true, size: 11 };
      r.forEach(function(v, i) {
        worksheet.addRow([ ( i + 1 ), v.cat_name, v.name, v.sku, v.price ]);
      });
      var tmpfilepath = tempy.file({ name: bookname });
      workbook.xlsx.writeFile(tmpfilepath).then(function() {
          res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
          res.setHeader("Content-Disposition", "attachment; filename=" + bookname);
          res.sendFile(tmpfilepath);
      })
    } else {
      res.end();
    }
  });
};

exports.notFound = function(req, res, next) {
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
    featured: function (callback) {
      Provider.getFeaturedProducts(this.sid, function(err, res) {
        callback(err, res);
      });
    },
    seo: function (callback) {
      Provider.getPageSeo(7, function(err, res) {
        callback(err, res);
      });
    }
  }, function(err, result) {
     if(err) console.log('ERROR OCCURED', err);
     res.render('404', {
       seo: result.seo,
       menu: result.menu,
       featured: result.featured,
       categories: result.categories,
       mcategories: polyfills.chunk(result.categories.slice(0, 24), 8)
     });
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
    },
    featured: function (callback) {
      Provider.getFeaturedProducts(this.sid, function(err, res) {
        callback(err, res);
      });
    },
    seo: function (callback) {
      Provider.getPageSeo(8, function(err, res) {
        callback(err, res);
      });
    }
  }, function(err, result) {
     if(err) console.log('ERROR OCCURED', err);
     res.render('checkout', {
       seo: result.seo,
       menu: result.menu,
       featured: result.featured,
       products: result.products,
       categories: result.categories,
       mcategories: polyfills.chunk(result.categories.slice(0, 24), 8),
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
