var http = require('http');
http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('running');
}).listen(process.env.PORT || 5000);

var Twitter = require('twitter');
var request = require('request');
var client = new Twitter({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token_key: process.env.ACCESS_TOKEN_KEY,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET
});

var tweet = function(){
  var animals = ["cat"];
  var descriptor = ["funny", "stupid", "OCD", "angry", "scared", "silly", "excited"];
  var actions = ["in a box", "flying", "jumping", "taming human", "skiing", "in a hat", "eating"]
  var gif;
  var rand_animal_i = Math.floor(Math.random()*animals.length);
  var rand_descriptor_i = Math.floor(Math.random()*descriptor.length);
  var rand_actions_i = Math.floor(Math.random()*actions.length);
  var tweet = animals[rand_animal_i] + " " + actions[rand_actions_i]

  request('http://api.giphy.com/v1/gifs/translate?s=' + tweet + '&api_key='+process.env.GIPHY_API_KEY+'&limit=5', function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var info = JSON.parse(body);
        gif = info["data"]["bitly_gif_url"]

        client.post('statuses/update', {status: tweet + ' ' + gif},  function(error, tweet, response){
          if(error){
            console.log(error);
          }
          console.log(tweet);  // Tweet body.
        });
      }
  });
}
//prevent idling
setInterval(function(){
  //http.get("http://thawing-tundra-24474.herokuapp.com");
}, 300000)
//tweet every hour
//setInterval(tweet,1000 * 60 * 60);

var stream = client.stream('statuses/filter', {track: "app idea"});
stream.on('data', function(event) {
  if (typeof event.text == "string"){
    var text = event.text.toLowerCase();
    if (text.includes("app idea") && event.text.includes("RT") == false){
      console.log(event.text);
    }
  }
});

stream.on('error', function(error) {
  throw error;
});
