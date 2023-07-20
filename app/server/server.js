const express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

const TargetSpawnFactory = require('./targetSpawnFactory.js');
const targetSpawnFactory = new TargetSpawnFactory(10);

const path = require('path');

/**
 * As JavaScript paths work relatively from the executed file, we first to navigate from the
 * current path ('__dirname') one directory back ('..') and from there into the directory client ('client').
 */
const clientPath = path.join(__dirname, '..', 'client');

app.use(express.static(clientPath));

const GAME_DURATION = 180;
const SPAWN_RATE = 0.6; //0%-100% per loop cycle

let clientOne = null;
let clientTwo = null;
let gameTimer = -1;
let ready = {
  one : false,
  two : false
};


io.on('connection', socket => {

  //new connection
  if (clientOne == null) {
    console.log('Client One connected.');
    clientOne = socket;
    io.to(clientOne.id).emit('setside', false);
  } else if (clientTwo == null) {
    console.log('Client Two connected.');
    clientTwo = socket;
    io.to(clientTwo.id).emit('setside', true);
  } else {
    console.log('Client connection refused. There are already two clients.');
    io.to(socket.id).emit('refused');
  }

  //game ready
  if(clientOne!==null && clientTwo!==null) {
    io.emit('bothConnected');
    console.log("Both clients connected.");
  }

  //start game
  socket.on('playerReady', function () {
    notifyOtherPlayer(socket, 'playerReady', '');
    if (clientOne !== null && socket.id === clientOne.id) {
      ready.one = true;
    } else if (clientTwo !== null && socket.id === clientTwo.id) {
      ready.two = true;
    }
    if(ready.one && ready.two) {
      gameTimer = GAME_DURATION;
      io.emit('startgame', gameTimer);
      console.log('Starting new game...');
      ready.one = false;
      ready.two = false;
    }
  });

  //disconnect
  socket.on('disconnect', function () {
    if (clientOne !== null && socket.id === clientOne.id) {
      clientOne = null;
      console.log('Client One disconnected.');
    } else if (clientTwo !== null && socket.id === clientTwo.id) {
      clientTwo = null;
      console.log('Client Two disconnected.');
    } else {
      console.log('Redundant socket disconnected.');
    }

  });

  //pass on player position
  socket.on('playerposition', (data) => {
    notifyOtherPlayer(socket, 'playerposition', data);
  });

  //update other Player Ready Status
  socket.on('remotePlayerStatus', (data) => {
    notifyOtherPlayer(socket, 'remotePlayerStatus', data);
  });

  //update score
  socket.on('newScore', (data) => {
    notifyOtherPlayer(socket, 'newScore', data);
  });

  //target hit
  socket.on('targetHit', (data) => {
    notifyOtherPlayer(socket, 'targetHit', data);
  })

  //tell player he got shot by the other player
  socket.on('playerGotHit', () => {
    notifyOtherPlayer(socket, 'playerGotHit');
  })

  //tell player the remote player fired a shot
  socket.on('shotFired', () => {
    notifyOtherPlayer(socket, 'shotFired');
  })

  //tell player the remote player is reloading
  socket.on('reloading', () => {
    notifyOtherPlayer(socket, 'reloading');
  })
});

http.listen(3000, () => {
  console.log(`Serving ${clientPath} on *:3000.`);
});

setInterval(loop.bind(this), 1000); //1s interval
function loop() {

  if (gameTimer > 0) {
    gameTimer--;

    //spawn target
    let chanceOfSpawning = Math.random() >= 1-SPAWN_RATE; // 0.1==%90 probability of get "true"
    if (chanceOfSpawning) {
      let targetSpawn = targetSpawnFactory.createNewTargetSpawn();
      console.log(targetSpawn);
      io.emit('targetspawn', targetSpawn);
    }

  } else if (gameTimer === 0) {
    console.log("Game Over!");
    targetSpawnFactory.reset();
    gameTimer = -1;
    io.emit('gameOver');
  }
}

function notifyOtherPlayer(currentSocket, event, data) {
  if (clientOne !== null && clientTwo !== null) {
    if (currentSocket.id === clientOne.id) {
      console.log('Passing on <',event,'> from clientOne to clientTwo');
      io.to(clientTwo.id).emit(event, data);
    } else if (currentSocket.id === clientTwo.id) {
      console.log('Passing on <',event,'> from clientTwo to clientOne');
      io.to(clientOne.id).emit(event, data);
    }
  } else {
    console.log('Warning! One socket not connected.');
  }
} 