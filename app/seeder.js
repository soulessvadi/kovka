const MySQL = require('./models/MySQL');
const fs = require('fs');
const path = require('path');

// var Excel = require('exceljs');
// var workbook = new Excel.Workbook();
// MySQL.origin.query("TRUNCATE TABLE products", function(err, res) {
// 	console.log(err, res);
// });
// workbook.xlsx.readFile('./app/p.xlsx').then(function() {
//   var worksheet = workbook.getWorksheet(1);
//   worksheet.eachRow({ includeEmpty: false }, function(row, key) {
// 		if(key > 1) {
// 			var cat_id = parseInt(row.values[2]),
// 			    name = row.values[3],
// 				  sku = row.values[4],
// 					price = parseFloat(row.values[5]).toFixed(2),
// 					alias = transliterate(name).replace(/\s/g, "-");
//       MySQL.origin.query("INSERT INTO products SET ?", { 'cat_id':cat_id, 'name':name, 'alias':alias, 'price':price, 'sku':sku }, function(err, res) {
//         console.log(err, res);
//       });
// 		}
//   });
// });

// fs.readdir('./public/img/products', function (err, list) {
//     next(list.length - 1);
//     function next(i) {
//       if(i < 0) return null;
//       var ext = path.extname(list[i]);
//       var filename = path.basename(list[i], ext);
//       var basename = path.basename(list[i]);
//       MySQL.execute("UPDATE products SET `cover`='"+basename+"' WHERE `sku`='"+filename+"' OR `sku` LIKE '%"+filename+"%'", function(err, res) {
//         console.log(res);
//         next(i-1);
//       });
//     }
// });

function is_numeric( mixed_var ) {
	return !isNaN( mixed_var );
}

function transliterate(text, engToRus) {
	var rus = "щ  ш  ч  ц  ю  я  ё  ж  ъ  ы  э  а б в г д е з и й к л м н о п р с т у ф х ь".split(/ +/g),
		  eng = "shh sh ch cz yu ya yo zh `` y' e` a b v g d e z i j k l m n o p r s t u f x `".split(/ +/g);
	for(x = 0; x < rus.length; x++) {
		text = text.split(engToRus ? eng[x] : rus[x]).join(engToRus ? rus[x] : eng[x]);
		text = text.split(engToRus ? eng[x].toUpperCase() : rus[x].toUpperCase()).join(engToRus ? rus[x].toUpperCase() : eng[x].toUpperCase());
	}
	return text;
}
//
// var categories = [
//   {
//     id: 1,
//     name: 'Спиральные элементы из квадрата 10х10мм и 10х5мм',
//     alias: 'spiral-nyy-elementy-iz-kvadrata-10h10mm-i-10h5mm',
//     cover: '1-Спиральный элементы из квадрата 10х10мм и 10х5мм.png',
//     publish: true,
//     order: 1
//   },
//   {
//     id: 10,
//     name: 'Вставки',
//     alias: 'vstavki',
//     cover: '10-Вставки.png',
//     publish: true,
//     order: 1
//   },
//   {
//     id: 11,
//     name: 'Набалдашники',
//     alias: 'nabaldashniki',
//     cover: '11-Набалдашники.png',
//     publish: true,
//     order: 1
//   },
//   {
//     id: 12,
//     name: 'Шары целостные гладкие',
//     alias: 'shary-celostnye-gladkie',
//     cover: '12-Шары целостные гладкие.png',
//     publish: true,
//     order: 1
//   },
//   {
//     id: 13,
//     name: 'Шары целостные фактурные',
//     alias: 'shary-celostnye-fakturnye',
//     cover: '13-Шары целостные фактурные.png',
//     publish: true,
//     order: 1
//   },
//   {
//     id: 14,
//     name: 'Шары пустотелые гладкие и полусферы',
//     alias: 'shary-pustotelye-gladkie-i-polusfery',
//     cover: '14-Шары пустотелые гладкие и полусферы.png',
//     publish: true,
//     order: 1
//   },
//   {
//     id: 15,
//     name: 'Маскировочные элементы',
//     alias: 'maskirovochnye-elementy',
//     cover: '15-Маскировочные элементы.png',
//     publish: true,
//     order: 1
//   },
//   {
//     id: 16,
//     name: 'Цветы, листья, растения, узоры',
//     alias: 'cvety-list-ya-rasteniya-uzory',
//     cover: '16-Цветы, листья, растения, узоры.png',
//     publish: true,
//     order: 1
//   },
//   {
//     id: 17,
//     name: 'Чугунные элементы',
//     alias: 'chugunnye-elementy',
//     cover: '17-Чугунные элементы.png',
//     publish: true,
//     order: 1
//   },
//   {
//     id: 18,
//     name: 'Петли и навесы',
//     alias: 'petli-i-navesy',
//     cover: '18-Петли и навесы.png',
//     publish: true,
//     order: 1
//   },
//   {
//     id: 19,
//     name: 'Металлические заглушки',
//     alias: 'metallicheskie-zaglushki',
//     cover: '19-Металлические заглушки.png',
//     publish: true,
//     order: 1
//   },
//   {
//     id: 2,
//     name: 'Спиральные элементы из квадрата 12х12мм',
//     alias: 'spiral-nye-elementy-iz-kvadrata-12h12mm',
//     cover: '2-Спиральные элементы из квадрата 12х12мм.png',
//     publish: true,
//     order: 1
//   },
//   {
//     id: 20,
//     name: 'Пластиковые заглушки',
//     alias: 'plastikovye-zaglushki',
//     cover: '20-Пластиковые заглушки.png',
//     publish: true,
//     order: 1
//   },
//   {
//     id: 21,
//     name: 'Кованные ручки',
//     alias: 'kovannye-ruchki',
//     cover: '21-Кованные ручки.png',
//     publish: true,
//     order: 1
//   },
//   {
//     id: 22,
//     name: 'Накладки',
//     alias: 'nakladki',
//     cover: '22-Накладки.png',
//     publish: true,
//     order: 1
//   },
//   {
//     id: 23,
//     name: 'Заклепки',
//     alias: 'zaklepki',
//     cover: '23-Заклепки.png',
//     publish: true,
//     order: 1
//   },
//   {
//     id: 24,
//     name: 'Почтовые ящики',
//     alias: 'pochtovye-yaschiki',
//     cover: '24-Почтовые ящики.png',
//     publish: true,
//     order: 1
//   },
//   {
//     id: 25,
//     name: 'Боковушка лавочки',
//     alias: 'bokovushka-lavochki',
//     cover: '25-Боковушка лавочки.png',
//     publish: true,
//     order: 1
//   },
//   {
//     id: 26,
//     name: 'Краски и патины',
//     alias: 'kraski-i-patiny',
//     cover: '26-Краски и патины.png',
//     publish: true,
//     order: 1
//   },
//   {
//     id: 3,
//     name: 'Спиральные элементы из полосы 12х6мм и цветочки',
//     alias: 'spiral-nye-elementy-iz-polosy-12h6mm-i-cvetochki',
//     cover: '3-Спиральные элементы из полосы 12х6мм и цветочки.png',
//     publish: true,
//     order: 1
//   },
//   {
//     id: 4,
//     name: 'Корзинки',
//     alias: 'korzinki',
//     cover: '4-Корзинки.png',
//     publish: true,
//     order: 1
//   },
//   {
//     id: 5,
//     name: 'Розеты',
//     alias: 'rozety',
//     cover: '5-Розеты.png',
//     publish: true,
//     order: 1
//   },
//   {
//     id: 6,
//     name: 'Балясины',
//     alias: 'balyasiny',
//     cover: '6-Балясины.png',
//     publish: true,
//     order: 1
//   },
//   {
//     id: 7,
//     name: 'Поручни и полосы',
//     alias: 'poruchni-i-polosy',
//     cover: '7-Поручни и полосы.png',
//     publish: true,
//     order: 1
//   },
//   {
//     id: 8,
//     name: 'Художественный металлопрокат',
//     alias: 'hudozhestvennyy-metalloprokat',
//     cover: '8-Художественный металлопрокат.png',
//     publish: true,
//     order: 1
//   },
//   {
//     id: 9,
//     name: 'Пики',
//     alias: 'piki',
//     cover: '9-Пики.png',
//     publish: true,
//     order: 1
//   },
// ];
//
// for ( let x in categories ) {
//   var entity = new Model.Category(categories[x]);
//   entity.save(function(e, res) {
//     if(e) console.log(e);
//     else console.log('saved');
//   });
// }
//
// var banners = [
//   {
//     name: '',
//     alias: '',
//     cover: 'bs1.jpg',
//     title: 'СУМАСШЕДШИЕ СКИДКИ',
//     description: 'НА ВСЮ ПРОДУКЦИЮ -30%',
//     buttons: [ { text: 'К покупкам' } ],
//     publish: true,
//     order: 1
//   },
//   {
//     name: '',
//     alias: '',
//     cover: 'bs2.jpg',
//     title: 'СУМАСШЕДШИЕ СКИДКИ',
//     description: 'НА ВСЮ ПРОДУКЦИЮ -30%',
//     buttons: [ { text: 'К покупкам' } ],
//     publish: true,
//     order: 2
//   },
//   {
//     name: '',
//     alias: '',
//     cover: 'bs3.png',
//     title: 'СУМАСШЕДШИЕ СКИДКИ',
//     description: 'НА ВСЮ ПРОДУКЦИЮ -30%',
//     buttons: [ { text: 'К покупкам' } ],
//     publish: true,
//     order: 3
//   },
//   {
//     name: '',
//     alias: '',
//     cover: 'bs4.jpg',
//     title: 'СУМАСШЕДШИЕ СКИДКИ',
//     description: 'НА ВСЮ ПРОДУКЦИЮ -30%',
//     buttons: [ { text: 'К покупкам' } ],
//     publish: true,
//     order: 4
//   },
//   {
//     name: '',
//     alias: '',
//     cover: 'bs5.png',
//     title: 'СУМАСШЕДШИЕ СКИДКИ',
//     description: 'НА ВСЮ ПРОДУКЦИЮ -30%',
//     buttons: [ { text: 'К покупкам' } ],
//     publish: true,
//     order: 5
//   },
//   {
//     name: '',
//     alias: '',
//     cover: 'bs6.jpg',
//     title: 'СУМАСШЕДШИЕ СКИДКИ',
//     description: 'НА ВСЮ ПРОДУКЦИЮ -30%',
//     buttons: [ { text: 'К покупкам' } ],
//     publish: true,
//     order: 6
//   },
//   {
//     name: '',
//     alias: '',
//     cover: 'bs7.jpg',
//     title: 'СУМАСШЕДШИЕ СКИДКИ',
//     description: 'НА ВСЮ ПРОДУКЦИЮ -30%',
//     buttons: [ { text: 'К покупкам' } ],
//     publish: true,
//     order: 7
//   },
//   {
//     name: '',
//     alias: '',
//     cover: 'bs8.jpg',
//     title: 'СУМАСШЕДШИЕ СКИДКИ',
//     description: 'НА ВСЮ ПРОДУКЦИЮ -30%',
//     buttons: [ { text: 'К покупкам' } ],
//     publish: true,
//     order: 8
//   }
// ];
//
// for ( let x in banners ) {
//   var entity = new Model.Banner(banners[x]);
//   entity.save(function(e, res) {
//     if(e) console.log(e);
//     else console.log('saved');
//   });
// }
