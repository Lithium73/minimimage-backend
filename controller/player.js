const Player = require('../dto/player');
const crypto = require("crypto");



class PlayerController{

  addPlayer(args,ws){
    var p = new Player();
    p.setWs(ws)
    p.name = args.name;
    p.isHost = args.isHost;
    if(p.isHost)p.ready=true;
    p.id = crypto.randomBytes(16).toString("hex");
    ws.id = p.id;
    var room = this.findRoom(args.roomId);
    console.log("[PlayerController]addPlayer",room)
    if(room){
      room.addPlayer(p)
      p.ws.send(JSON.stringify({
        action:"onPlayerInfo",
        player:p.toWS()
      }))
      p.constEmitter.on("onExit",()=>{
        room.removePlayer(p)
        room.broadcast(JSON.stringify({
          action:"onPlayerExited",
          room:room.toWS(),
          player:p.toWS()
        }))
      })

      p.constEmitter.on("onDraw",(pl,drawArgs)=>{
        room.broadcast(JSON.stringify({
          action:"onPlayerDraw",
          player:p.toWS(),
          drawArgs:drawArgs
        }))
      });

      p.constEmitter.on("onSendResponse",(pl,msg)=>{

        var info = ws.info();
        console.log(info.room.match.currentRound.word,"vs",msg)

        if(msg.toLowerCase().indexOf(info.room.match.currentRound.word.toLowerCase())){
          info.room.match.currentRound.onAnswerFound();
        }

        room.broadcast(JSON.stringify({
          action:"onPlayerSendResponse",
          player:p.toWS(),
          msg:msg
        }))
      });
    }else{
      p.ws.send(JSON.stringify({
        action:"onError",
        description:"This room does not exist"
      }))
      console.error('This room does not exist',args.roomId)
    }

  }

  changeName(args,ws){
    var info = ws.info();
    info.player.name = args.name;
    info.room.broadcast(JSON.stringify({
      action:"onPlayerChangeName",
      player:info.player.toWS()
    }))
  }

  setReady(args,ws){
    console.log("player:setready")
    var info = ws.info();
    if(args.words){
      info.player.words = args.words;
    }
    info.player.setReady(args.ready);
    console.log("setready : ",args)

    info.room.broadcast(JSON.stringify({
      action:"onPlayerReady",
      player:info.player.toWS()
    }))
  }

  draw(args,ws){
    var info = ws.info();
    info.player.onDraw(args);
  }

  sendResponse(args,ws){
    var info = ws.info();
    info.player.onSendResponse(args.msg);
  }


  findRoom(id){
    return global.games.filter((room)=>{
      return room.roomId == id;
    })[0]
  }

}
module.exports = PlayerController;
