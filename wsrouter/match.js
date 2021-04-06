var MatchController = require('../controller/match')

class MatchRouter{
  startGame(args,ws){
    var mr = new MatchController();
    mr.startGame(args,ws)
  }
}
module.exports  = MatchRouter;
