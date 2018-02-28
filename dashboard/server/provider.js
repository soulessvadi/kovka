const DB = require('./db');
var Provider = function() {  };

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
        current : page,
      };
		}
	};
};

Provider.prototype.getPagination = function(page, per_page, pages_count, pages_display, onclick) {
  var pages_all = [], result = '';
  for(var x = 1; x <= pages_count; x++) pages_all.push(x);
  const paginate = this.paginator(pages_all, per_page, pages_display);
  paginator = paginate.page(page);
  return paginator;
};

Provider.prototype.getAllProducts = function(callback) {
    DB.execute("SELECT P.*, ROUND(P.price, 2) as price, C.name as cat_name, C.alias as cat_alias "+
      "FROM products as P LEFT JOIN categories as C on C.id = P.cat_id "+
			"ORDER BY P.sku LIMIT 10000", function(err, res) {
        if(res) callback(null, res);
        else callback(err, null);
    });
};

module.exports = new Provider;
