const prompt = require('prompt');
const request = require('request');

var schema = {
  properties: {
    shopify_url: {
      message: 'Enter the Shopify URL you want to track',
      default: 'https://www.chubbiesshorts.com/products/the-one-man-wolf-pack',
      required: true
    },
  }
};

prompt.start();

prompt.get(schema, function(err, prompts) {
  makeRequest(prompts.shopify_url);
});

function makeRequest(url){
  var options = {
    url: url,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.186 Safari/537.36'
    }
  };

  request(options, function(err, resp, html){
      if(err) { console.error(err); return false; };

      // var variants = html.match(/"variants":\[.*\]/g)[1].replace(/"variants":/, "").replace(/,"options":\["Size"\]/, '}]');
      var variants = html.match(/"variants":\[.*\]/g)[1];

      if(variants === undefined){
        variants = html.match(/Loop.variants = \{((\s*?.*?)*?)\};/)[1];
      }

      var quantity = variants.match(/"inventory_quantity":(\d+)/g);
      var name = variants.match(/"name":"(.*?)"/g);

      for (var i = 0; i < quantity.length; i++) {
        console.log(`${name[i]} - ${quantity[i]}`);
      };
  });
}
