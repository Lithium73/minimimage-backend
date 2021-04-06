const PlayerController = require ('../controller/player');

class PlayerRouter{

  addPlayer(args,ws){
    console.log("[PlayerRouter]addPlayer")
    var pl = new PlayerController();
    pl.addPlayer(args,ws)
  }

  changeName(args,ws){
    var pl = new PlayerController();
    pl.changeName(args,ws)
  }

  setReady(args,ws){
    var pl = new PlayerController();
    pl.setReady(args,ws)

  }

  draw(args,ws){

    var pl = new PlayerController();
    pl.draw(args,ws)

  }

  sendResponse(args,ws){
    var pl = new PlayerController();
    pl.sendResponse(args,ws)
  }

}
module.exports  = PlayerRouter;
