const EventEmitter = require('events');

class Match{
  constructor(){
    this.currentRound = null;
    this.rounds = [];
    this.state = null;
    this.constEmitter = new EventEmitter();

    this.timePerPerson = 30;
    this.wordPerPerson = 3;

  }

  start(){
    this.state = Match.CHOOSE_WORD;
    this.onMatchBegin();
  }

  onMatchBegin(){
    this.constEmitter.emit("onMatchBegin");
  }

  onMatchEnd(){
    this.constEmitter.emit("onMatchEnd");
  }

  toWS(){
    return {
      currentRound:this.currentRound,
      state:this.state,
      timePerPerson:this.timePerPerson,
      wordPerPerson:this.wordPerPerson,
      CHOOSE_WORD:Match.CHOOSE_WORD,
      INGAME:Match.INGAME,
      END:Match.END
    }
  }
}

Match.CHOOSE_WORD = 0;
Match.INGAME = 1;
Match.END = 2;

module.exports = Match;
