const WebSocket = require('ws');

const MatchRouter = require('./wsrouter/match');
const PlayerRouter = require('./wsrouter/player');
const RoomRouter = require('./wsrouter/room');
const RoundRouter = require('./wsrouter/round');
const TeamRouter = require('./wsrouter/team');

var routers = {
  MatchRouter:MatchRouter,
  PlayerRouter:PlayerRouter,
  RoomRouter:RoomRouter,
  RoundRouter:RoundRouter,
  TeamRouter:TeamRouter
}


global.games = [];




console.log("WS server start on 8080")
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    try{
      console.log("receive",message)
      message = JSON.parse(message);
      /*{
          router : "",
          method : "",
          args : [...]
        }
      */
      var ctrl = new routers[message.router]()
      ctrl[message.method](message.args,ws);


      ws.info = function(){
        var obj = {}
        for(let game of global.games){
          console.log("search game")
          for(let team of game.teams){
            console.log("search team")
            for (let player of team.players){
              console.log("search players")
              if(player.id == ws.id){
                obj.room = game;
                obj.team = team;
                obj.player = player;
              }
            }
          }
        }
        return obj;
      }

    }catch(e){
      console.error(e)
    }
  });
});
