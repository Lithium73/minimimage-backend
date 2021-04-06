var Match = require('../dto/match');
var Round = require('../dto/round');

class MatchController{
  startGame(args,ws){
    var match = new Match();

    match.timePerPerson = args.timePerPerson;
    match.wordPerPerson = args.wordPerPerson;

    match.constEmitter.on("onMatchBegin",()=>{
      var info = ws.info();

      info.room.match = match;

      for(let team of info.room.teams){
        for(let player of team.players){
            player.setReady(false)
            player.constEmitter.on("onReady",this.onPlayerSecondReady.bind(this,ws))
        }
      }

      info.room.broadcast(JSON.stringify({
        action:"onMatchBegin",
        match:match.toWS()
      }))
    })

    match.start();
  }

  onPlayerSecondReady(ws){
    var info = ws.info();
    console.log("check how many players ready")
    var allReady = !info.room.teams[0].players.filter((pl)=>{
      return !pl.ready;
    }).length && !info.room.teams[1].players.filter((pl)=>{
      return !pl.ready;
    }).length
    if(allReady)this.firstRound(ws)
  }

  firstRound(ws){
    var info = ws.info();
    var allWords = [];

    for(let team of info.room.teams){
      for(let player of team.players){
        console.log("playerowrds",player.words)
        player.constEmitter.off("onReady",this.onPlayerSecondReady.bind(this,ws))
        allWords = allWords.concat(player.words)
      }
    }

    console.log(allWords)
    //make all rounds
    var match = info.room.match;
    for(var i =0; i<allWords.length;i++){
      var round = new Round();
      round.word = allWords[i];
      round.whiteboardType = i%4;
      round.currentMaster = this._getRandomPlayer(info).player
      round.currentMasterTeam = this._getRandomPlayer(info).team;

      round.constEmitter.on("onRoundBegin",()=>{
        match.currentRound = round;
      })

      round.constEmitter.on("onAnswerFound",()=>{
        room.broadcast(JSON.stringify({
          action:"onAnswerFound"
        }))
        //begin another round
      })

      match.rounds.push(round)
    }

    match.rounds[0].onRoundBegin();
    var info = ws.info();
    info.room.broadcast(JSON.stringify({
      action:"onRound",
      round:match.rounds[0].toWS()
    }))

  }

 _getRandomPlayer(info){
   var players = [];
   for(let team of info.room.teams){
     for(let player of team.players){
       players.push({team:team,player:player})
     }
   }
   var i = parseInt(Math.random()*players.length-1);
   return players[i];
 }

}
module.exports = MatchController;
