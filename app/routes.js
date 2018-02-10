const Router = require('express').Router();
const Controller = require('./controllers/Controller');

Router.use(Controller.initialize);
Router.get('/', Controller.home);
Router.get('/404', Controller.notFound);
Router.get('/catalog', Controller.catalog);
Router.get('/catalog/:category', Controller.category);
Router.get('/catalog/:category/:product', Controller.product);
Router.get('/about', Controller.about);
Router.get('/checkout', Controller.checkout);
Router.get('/contacts', Controller.contacts);
Router.get('/favorites', Controller.favorites);
Router.get('/delivery&payment', Controller.delivery);
Router.all('/ajax', Controller.ajax);

module.exports = Router;
