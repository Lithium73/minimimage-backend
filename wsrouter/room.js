const RoomController = require('../controller/room');

class RoomRouter{

  createGame(args,ws){
    console.log("[RoomRouter]createGame")
    var rc = new RoomController();
    rc.createGame(ws);
  }



}
module.exports  = RoomRouter;
