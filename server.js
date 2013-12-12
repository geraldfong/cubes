var express = require('express');
var app = express();

var amplitude = 0;

app.configure(function (){
  app.use(express.static(__dirname + '/public'));
});


app.get('/eeg', function (req, res) {
  console.log(req.url);
  amplitude = req.query.amplitude;
  res.send("SUCCESS");
});

app.get('/query', function (req, res) {
  console.log(req.url);
  res.send(amplitude);
});
console.log("Starting on 1500");
app.listen(1500);
/*
app.get('/shooter/api', function(req, res) {
  console.log(req.url);
  res.send('this page is an easter egg!');
});

var players = {}; 
var bullets = {}; 

app.get('/shooter/api/register', function(req, res) {
  console.log(req.url);
  var player = req.query.player;
  var id = player.id;
  players[id] = player;

  console.log(players);
  res.send( {
    players: players,
    bullets: bullets
  }); 
});

app.get('/shooter/api/poll', function(req, res) {
  var player = req.query.player;
  var id = player.id;
  players[id] = player;

  var bulletsData = req.query.bullets;
  for (bulletId in bulletsData) {
    bullets[bulletId] = bulletsData[bulletId];
  }
  data = { 
    players: players,
  bullets: bullets
  };  
  console.log(data);
  res.send(data);});
*/
