const Room = require('../dto/room');

class RoomController{

  createGame(ws){
    console.log("[RoomController]createGame")
    var room = new Room();
    room.constEmitter.on('onRoomCreated',(room)=>{
      ws.send(JSON.stringify({action:"onRoomCreated",room:room.toWS()}))
    })
    room.constEmitter.on('onPlayerEntered',(room,player)=>{
      room.broadcast(JSON.stringify({
        action:"onPlayerEntered",
        room:room.toWS(),
        player:player.toWS()
      }))
    })
    room.constEmitter.on("onRoomEnd",()=>{
      global.games = global.games.filter((game)=>{
        return room.roomId != game.roomId
      })
    })

    global.games.push(room);
  }

  findRoom(id){
    return global.games.filter((room)=>{
      return room.roomId == id;
    })[0]
  }

}
module.exports = RoomController;
