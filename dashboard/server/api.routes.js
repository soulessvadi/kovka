const express = require('express');
const router = express.Router();
const fs = require('fs');
const DB = require('./db');
const tempy = require('tempy');
const moment = require('moment');
const multer  = require('multer');
const Provider = require('./provider');
var upload = multer({
  storage: multer.diskStorage({
    destination: __dirname,
    filename: ( req, file, cb ) => cb( null, 'p.xlsx' )
  })
});

// Response handling
let response = {};

router.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:4200");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, X-CSRF, X-XSRF-TOKEN");
  res.header('Access-Control-Allow-Methods', 'POST, GET');
  next();
});

router.get('/getOrder', (req, res) => {
    response = {};
    var self = this,
        carriers = ['Не выбран', 'Нова Пошта', 'ИнТайм', 'Деливери'];
        id = req.query.p,
        query = "SELECT *, (id + 20000) as number FROM orders WHERE id = " + id + " LIMIT 1";
    DB.execute(query, function(err, row) {
      if(row) {
        response.order = row.pop();
        response.order.carrier_name = carriers[response.order.carrier];
        response.order.amount = 0;
        response.status = 'ok';
        var pquery = "SELECT P.*, OP.quantity, OP.id as op_id FROM orders_products as OP "+
        "LEFT JOIN products as P on P.id = OP.prod_id WHERE order_id = " + id + ";"
        DB.execute(pquery, function(err, products) {
          if(products) {
            response.order.products = products;
          }
          res.json(response);
        });
      } else {
        response.status = err;
        res.json(response);
      }
    });
});

router.get('/getOrders', (req, res) => {
    response = {};
    response.orders = [];
    var self = this,
        onpage = 15,
        page = parseInt(req.query.p) || 1,
        limit = page * onpage - onpage + ', ' + onpage,
        keyword = req.query.q.trim().length ? req.query.q.trim() : '*',
        assumed_id = !isNaN(parseInt(keyword)) ? parseInt(keyword) : 0;
        query = keyword === '*'
        ? "SELECT O.*, (O.id + 20000) as number, " +
          "(SELECT SUM(quantity * (SELECT price FROM products WHERE id = OP.prod_id)) FROM orders_products as OP WHERE order_id = O.id) as amount, "+
          "(SELECT SUM(quantity) FROM orders_products as OP WHERE order_id = O.id) as count "+
          "FROM orders as O ORDER BY O.created DESC LIMIT "+limit+""
        : "SELECT O.*, (O.id + 20000) as number, " +
          "(SELECT SUM(quantity * (SELECT price FROM products WHERE id = OP.prod_id)) FROM orders_products as OP WHERE order_id = O.id) as amount, "+
          "(SELECT SUM(quantity) FROM orders_products as OP WHERE order_id = O.id) as count "+
          "FROM orders as O "+
          "WHERE (O.id + 20000) LIKE '"+assumed_id+"%' OR O.name LIKE '%"+keyword+"%' ORDER BY O.created DESC LIMIT "+limit+"";
        cquery = keyword === '*'
        ? "SELECT COUNT(O.id) as count FROM orders as O LIMIT 1"
        : "SELECT COUNT(O.id) as count FROM orders as O WHERE (O.id + 20000) LIKE '"+assumed_id+"%' OR O.name LIKE '%"+keyword+"%' LIMIT 1";
    DB.execute(query, function(err, orders) {
      DB.execute(cquery, function(err, row) {
        if(res) {
          var total = row[0].count,
          pages = Math.ceil(total/onpage);
          paginator = Provider.getPagination(page, onpage, pages, 3);
          response.status = 'ok';
          response.orders = orders;
          response.total = total;
          response.page_current = paginator.current;
          response.pagi = paginator.pages;
          response.page_prev = paginator.prev;
          response.page_next = paginator.next;
          response.onpage = ( total ? onpage : 0 );
          res.json(response);
        }
      });
    });
});

router.post('/updateOrder', (req, res) => {
    response = {};
    var id = parseInt(req.body.id);
    var status = parseInt(+req.body.status);
    var query = `UPDATE orders SET status = ` + status + ` WHERE id = ` + id + ``;
    DB.execute(query, function(e, r) {
      if(e) response.status = e;
      else response.status = 'ok';
      res.json(response);
    });
});

router.post('/updateProduct', (req, res) => {
    response = {};
    var id = req.body.id;
    var is_bestseller = parseInt(+req.body.is_bestseller);
    var is_new = parseInt(+req.body.is_new);
    var is_stock = parseInt(+req.body.is_stock);
    var publish = parseInt(+req.body.publish);
    var price = parseFloat(req.body.price);
    var rank = parseInt(req.body.rank);
    var cat_id = parseInt(req.body.cat_id);
    var alias = req.body.alias;
    var description = req.body.description;
    var name = req.body.name;
    var sku = req.body.sku;
    var query = `UPDATE products SET
      is_bestseller = ` + is_bestseller + `,
      is_new = ` + is_new + `,
      is_stock = ` + is_stock + `,
      price = ` + price + `,
      publish = ` + publish + `,
      rank = ` + rank + `,
      cat_id = ` + cat_id + `,
      alias = '` + alias + `',
      description = '` + description + `',
      name = '` + name + `',
      sku = '` + sku + `'
    WHERE id = ` + id + ``;
    DB.execute(query, function(e, r) {
      if(e) response.status = e;
      else response.status = 'ok';
      res.json(response);
    });
});

router.get('/getProducts', (req, res) => {
    response = {};
    var self = this,
        onpage = 20,
        page = parseInt(req.query.p) || 1,
        limit = page * onpage - onpage + ', ' + onpage,
        keyword = req.query.q.trim().length ? req.query.q.trim() : '*',
        query = keyword === '*'
        ? "SELECT P.*, (SELECT name FROM categories WHERE id = P.cat_id LIMIT 1) as cat_name, " +
          "(SELECT alias FROM categories WHERE id = P.cat_id LIMIT 1) as cat_alias FROM products as P " +
          "ORDER BY P.sku ASC LIMIT "+limit+""
        : "SELECT P.*, (SELECT name FROM categories WHERE id = P.cat_id LIMIT 1) as cat_name, " +
          "(SELECT alias FROM categories WHERE id = P.cat_id LIMIT 1) as cat_alias FROM products as P " +
          "WHERE P.name LIKE '%"+keyword+"%' OR P.sku LIKE '"+keyword+"%' ORDER BY P.sku ASC LIMIT "+limit+"";
        cquery = keyword === '*'
        ? "SELECT COUNT(P.id) as count FROM products as P LIMIT 1"
        : "SELECT COUNT(P.id) as count FROM products as P WHERE P.name LIKE '%"+keyword+"%' OR P.sku LIKE '"+keyword+"%' LIMIT 1";
    DB.execute(query, function(err, products) {
      DB.execute(cquery, function(err, row) {
        if(res) {
          var total = row[0].count,
          pages = Math.ceil(total/onpage);
          paginator = Provider.getPagination(page, onpage, pages, 5);
          response.status = 'ok';
          response.products = products;
          response.total = total;
          response.page_current = paginator.current;
          response.pagi = paginator.pages;
          response.page_prev = paginator.prev;
          response.page_next = paginator.next;
          response.onpage = ( total ? onpage : 0 );
          res.json(response);
        }
      });
    });
});

router.get('/getProduct', (req, res) => {
    response = {};
    var self = this,
        id = req.query.p,
        query = "SELECT P.*, (SELECT name FROM categories WHERE id = P.cat_id LIMIT 1) as cat_name, " +
          "(SELECT alias FROM categories WHERE id = P.cat_id LIMIT 1) as cat_alias FROM products as P " +
          "WHERE id = " + id +
          " LIMIT 1";
    DB.execute(query, function(err, row) {
      if(row) {
        response.product = row.pop();
        response.status = 'ok';
      } else {
        response.status = err;
      }
      res.json(response);
    });
});

router.get('/buildPricelist', (req, res) => {
  Provider.getAllProducts(function(e, r) {
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
        { width: 60, style: { alignment : { vertical: 'center', horizontal: 'left' } } },
        { width: 15, style: { alignment : { vertical: 'center', horizontal: 'left' } } },
        { width: 20, style: { alignment : { vertical: 'center', horizontal: 'center' } } }
      ];
      worksheet.addRow(['№','Группа','Товар','Код товара','Стоимость, ₴']);
      worksheet.getCell('A1').font = { name: 'Arial', bold: true, size: 11 };
      worksheet.getCell('B1').font = { name: 'Arial', bold: true, size: 11 };
      worksheet.getCell('C1').font = { name: 'Arial', bold: true, size: 11 };
      worksheet.getCell('D1').font = { name: 'Arial', bold: true, size: 11 };
      worksheet.getCell('E1').font = { name: 'Arial', bold: true, size: 11 };
      worksheet.getCell('F1').font = { name: 'Arial', bold: true, size: 11 };
      r.forEach(function(v, i) {
        worksheet.addRow([ ( i + 1 ), v.cat_id + ' - ' + v.cat_name, v.name, v.sku, v.price ]);
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
});

router.post('/uploadPricelist', upload.single('files'), (req, res) => {
  var filename = req.file.filename;
  var path = req.file.path;

  if(path) {
    var Excel = require('exceljs');
    var workbook = new Excel.Workbook();
    Provider.getAllProducts(function(err, rows) {
      if(rows) readXlsx(rows);
    });

    function readXlsx(rows) {
      var products = rows.map((val) => val.sku);
      var history = [];
      workbook.xlsx.readFile(path).then(() => {
        var worksheet = workbook.getWorksheet(1);
        worksheet.eachRow({ includeEmpty: false }, (row, key) => {
          if(!isNaN(parseInt(row.values[2]))) {
            var entity = {};
            entity.cat_id = parseInt(row.values[2]);
            entity.name = row.values[3];
            entity.sku = row.values[4];
            entity.price = parseFloat(row.values[5]).toFixed(2);
            entity.alias = transliterate(entity.name).replace(/\s/g, "-");
            entity.ops = updateOrCreate(entity);
            history.push(entity);
          }
        });
      }).then(() => {
          if(products.length) {
            rows.forEach((val) => {
              if(products.includes(val.sku)) {
                history.push({
                  cat_id: val.cat_id, name: val.name, sku: val.sku,
                  price: val.price, alias: val.alias, ops: 3
                });
              }
            });
            DB.origin.query("update products set publish = 0 where sku in (?)", [products], (err, res) => {
              if(err) console.trace(err);
            });
          }
          response.products = history;
          response.status = 'ok';
          res.send(response);
      });

      function updateOrCreate(entity) {
        if(products.includes(entity.sku)) {
          products.splice(products.indexOf(entity.sku), 1);
          DB.origin.query("update products set ? where sku = ?", [entity, entity.sku], (err, res) => {
            if(err) console.trace(err);
          });
          return 2;
        } else {
          DB.origin.query("insert into products set ?", entity, (err, res) => {
            if(err) console.trace(err);
          });
          return 1;
        }
      }
    }
  } else {
    res.send(response);
  }
});

function transliterate(text, engToRus) {
	var rus = "щ  ш  ч  ц  ю  я  ё  ж  ъ  ы  э  а б в г д е з и й к л м н о п р с т у ф х ь".split(/ +/g),
		  eng = "shh sh ch cz yu ya yo zh `` y' e` a b v g d e z i j k l m n o p r s t u f x `".split(/ +/g);
	for(x = 0; x < rus.length; x++) {
		text = text.split(engToRus ? eng[x] : rus[x]).join(engToRus ? rus[x] : eng[x]);
		text = text.split(engToRus ? eng[x].toUpperCase() : rus[x].toUpperCase()).join(engToRus ? rus[x].toUpperCase() : eng[x].toUpperCase());
	}
	return text;
}

if (!Array.prototype.includes) {
  Object.defineProperty(Array.prototype, 'includes', {
    value: function(searchElement, fromIndex) {
      if (this == null) {
        throw new TypeError('"this" is null or not defined');
      }
      var o = Object(this);
      var len = o.length >>> 0;
      if (len === 0) {
        return false;
      }
      var n = fromIndex | 0;
      var k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);
      function sameValueZero(x, y) {
        return x === y || (typeof x === 'number' && typeof y === 'number' && isNaN(x) && isNaN(y));
      }
      while (k < len) {
        if (sameValueZero(o[k], searchElement)) {
          return true;
        }
        k++;
      }
      return false;
    }
  });
}

module.exports = router;
