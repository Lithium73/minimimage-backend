
const EventEmitter = require('events');

class Team{

  constructor(teamColor){
    this.constEmitter = new EventEmitter();
    this.RED = 0;
    this.BLUE = 1;

    this.players = [];
    this.color = teamColor;
    this.score = 0;
  }

  addPlayer(pl){
    this.players.push(pl);
    this.onJoin();
  }

  onJoin(){
    this.constEmitter.emit("onJoin",this)
  }

  onLeave(){
    this.constEmitter.emit("onLeave",this)
  }

  onWin(){
    this.constEmitter.emit("onWin",this)
  }

  onLoose(){
    this.constEmitter.emit("onLoose",this)
  }

  toWS(){
    var obj = {
        color:this.color,
        players : []
    };
    for(let player of this.players){
        obj.players.push(player.toWS())
    }
    return obj;
  }

}
Team.RED = 0;
Team.BLUE = 1;
module.exports = Team;
