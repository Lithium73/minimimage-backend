const EventEmitter = require('events');

class Round{
  constructor(){
    this.whiteboardType = 0;
    this.currentMaster = null;
    this.currentMasterTeam =  null;
    this.word = null;
    this.constEmitter = new EventEmitter();


  }

  startRound(time){
    this.onRoundBegin();
    setTimeout(this.onRoundEnd.bind(this),time)
  }

  onRoundBegin(){
    this.constEmitter.emit("onRoundBegin",this)
  }

  onRoundEnd(){
    this.constEmitter.emit("onRoundEnd",this)
  }

  onAnswerFound(){
    this.constEmitter.emit("onAnswerFound",this)
  }

  toWS(){
    return {
      whiteboardType:this.whiteboardType,
      currentMaster:this.currentMaster.toWS(),
      currentMasterTeam:this.currentMasterTeam.toWS()
    }
  }
}

Round.FULL = 0;
Round.BLACK = 1;
Round.PIXEL = 2;
Round.MINIMAL = 3;
module.exports = Round;
