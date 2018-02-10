const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;
const db = require('../config/mongodb');
Mongoose.Promise = global.Promise;

/* db controls */
exports.connection = {
  connect: function() {
    Mongoose.connect(db.server, { useMongoClient : true });
    Mongoose.connection.on('error', console.error.bind(console, 'DB ERROR : '));
  },
  close: function() {
    Mongoose.connection.close();
  }
};
/* db controls */

/* models */
exports.Menu = Mongoose.model('menu', new Schema({
  name: { type: String, required: true },
  alias: { type: String, required: true },
  order: { type: Number, default: 999 },
  publish: { type: Boolean, default: false },
  catalog: { type: Boolean, default: false }
}));

exports.Banner = Mongoose.model('banner', new Schema({
  name: { type: String, dafault: 'unnamed' },
  alias: { type: String },
  cover: { type: String, required: true },
  title: { type: String },
  subtitle: { type: String },
  description: { type: String },
  buttons: [ { text: String, onclick: String, uri: String } ],
  publish: { type: Boolean, default: false },
  order: { type: Number, default: 999 }
}));

exports.Post = Mongoose.model('post', new Schema({
  name: { type: String, required: true },
  alias: { type: String, required: true },
  title: { type: String, required: true },
  text: { type: String, required: true },
  order: { type: Number, default: 999 },
  publish: { type: Boolean, default: false },
  created: { type: Date, default: new Date() },
  modified: { type: Date, default: new Date() },
}));

exports.Category = Mongoose.model('category', new Schema({
  id: { type: Number, default: 0 },
  name: { type: String, required: true },
  alias: { type: String, required: true },
  cover: { type: String, default: 'default.jpg' },
  products: { type: Number, default: 0 },
  order: { type: Number, default: 999 },
  publish: { type: Boolean, default: false },
}));
/* models */
