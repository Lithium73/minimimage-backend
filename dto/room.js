const crypto = require("crypto");
const EventEmitter = require('events');
const Team = require('./team');

class Room{

  constructor(){
    this.teams=[
      new Team(0),
      new Team(1)
    ];
    this.roomId = crypto.randomBytes(2).toString("hex");
    this.match = null;
    this.constEmitter = new EventEmitter();
    setTimeout(this.onRoomCreated.bind(this),100);
  }

  addPlayer(player){
    console.log("[Player]addPlayer")
    if(this.teams[Team.RED].players.length >this.teams[Team.BLUE].players.length){
      this.teams[Team.BLUE].addPlayer(player)
    }else{
      this.teams[Team.RED].addPlayer(player)
    }
    player.ws.on("close",()=>{
      this.onPlayerExited(player);
    })
    this.onPlayerEntered(player);
  }

  removePlayer(player){
    for(let team of this.teams){
      team.players = team.players.filter((p)=>{
        return player.id != p.id;
      })
    }
    if(this.teams[Team.RED].players.length == 0 && this.teams[Team.BLUE].players.length == 0){
      this.onRoomEnd();
    }
  }

  broadcast(message){
    for(let team of this.teams){
      for(let player of team.players){
        player.ws.send(message)
      }
    }
  }

  onRoomCreated(){
    this.constEmitter.emit('onRoomCreated',this);
  }

  onRoomEnd(){
    this.constEmitter.emit('onRoomEnd',this);
  }

  onPlayerEntered(player){
    this.constEmitter.emit('onPlayerEntered',this,player);
  }

  onPlayerExited(player){
    this.constEmitter.emit('onPlayerExited',this,player);
  }

  toWS(){
    return {
      roomId:this.roomId,
      teams:[
        this.teams[0].toWS(),
        this.teams[1].toWS()
      ]
    }
  }


}
module.exports = Room;
