var Twitter = require('twitter');
var request = require('request');
var client = new Twitter({
  consumer_key: CONSUMER_KEY,
  consumer_secret: CONSUMER_SECRET,
  access_token_key: ACCESS_TOKEN_KEY,
  access_token_secret: ACCESS_TOKEN_SECRET
});

var tweet = function(){
  var animals = ["cat", "dog"];
  var descriptor = ["black", "white", "huge", "fluffy", "funny", "stupid", "OCD", "blue", "smelly", "angry", "scared", "silly", "excited"];
  var gif;
  var rand_animal_i = Math.floor(Math.random()*animals.length);
  var rand_descriptor_i = Math.floor(Math.random()*descriptor.length);
  var tweet = descriptor[rand_descriptor_i] + " " + animals[rand_animal_i]

  request('http://api.giphy.com/v1/gifs/translate?s=' + tweet + '&api_key='+GIPHY_API_KEY+'&limit=5', function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var info = JSON.parse(body);
        gif = info["data"]["bitly_gif_url"]

        client.post('statuses/update', {status: tweet + ' ' + gif},  function(error, tweet, response){
          if(error){
            console.log(error);
          }
          console.log(tweet);  // Tweet body.
          console.log(response);  // Raw response object.
        });
      }
  });
}


setInterval(tweet,1000 * 60 * 60);
