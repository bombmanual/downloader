/**
 * Created by vrut on 26/11/15.
 */

var fs = require('fs');
var async = require('async');
var Download = require('download');
var cheerio = require('cheerio');

var ROOT = 'http://www.bombmanual.com/manual/1/html/';
var DEST_IMG = './img/';
var DEST_CSS = './css/';
var DEST_JS = './js/';
var DEST_ROOT = './';

async.parallel([

  // index.html

  function(cb) {

    console.log('Downloading:', ROOT + 'index.html');

    new Download()
      .get(ROOT + 'index.html')
      .dest(DEST_ROOT)
      .run(cb);
  },

  // CSS

  function(cb) {

    console.log('Downloading:', ROOT + 'css/normalize.css');
    console.log('Downloading:', ROOT + 'css/main.css');

    new Download()
      .get(ROOT + 'css/normalize.css')
      .get(ROOT + 'css/main.css')
      .dest(DEST_CSS)
      .run(cb);
  },

  // JS

  function(cb) {

    console.log('Downloading:', ROOT + 'js/main.js');

    new Download()
      .get(ROOT + 'js/main.js')
      .dest(DEST_JS)
      .run(cb);
  },

  function(cb) {

    console.log('Downloading:', ROOT + 'js/vendor/jquery-1.11.0.min.js');

    new Download()
      .get(ROOT + 'js/vendor/jquery-1.11.0.min.js')
      .dest(DEST_JS + 'vendor/')
      .run(cb);
  }

], function() {

  console.log('Done downloading main files');

  var INDEX = fs.readFileSync('./index.html', 'utf8');

  var $ = cheerio.load(INDEX);
  var images = [];

  // extracting images from file HTML

  $('img').each(function(index, image) {

    images.push($(this).attr('src'));

  });

  // download each image

  async.each(images, function(image, cb) {

    var img = ROOT + image;
    var path = image.split('/').slice(1);

    path = path.slice(0, path.length -1).join('/');

    console.log('Downloading:', img, 'in:', path);

    new Download()
      .get(img)
      .dest(DEST_IMG + path)
      .run(cb);

  }, function(err) {

    if (err) throw err;

    console.log('Done!');
    process.exit(0);

  });

});

