const EventEmitter = require('events');
class Player{

  constructor(){
    this.ws = null;
    this.name = null;
    this.id = null;
    this.isHost = false;
    this.constEmitter = new EventEmitter();
    this.ready = false;
    this.words = [];

  }

  setWs(ws){
    this.ws = ws;
    this.ws.on("close",this.onExit.bind(this))
  }

  setReady(ready){
    this.ready = ready;
    if(ready)this.onReady()
  }

  onReady(){
    this.constEmitter.emit("onReady",this)
  }

  onJoin(){
    this.constEmitter.emit("onJoin",this)
  }

  onExit(){
    this.constEmitter.emit("onExit",this)
  }

  onDraw(args){
    this.constEmitter.emit("onDraw",this,args)
  }

  onWrite(){
    this.constEmitter.emit("onWrite",this)
  }

  onSendResponse(msg){
    this.constEmitter.emit("onSendResponse",this,msg)
  }

  toWS(){
    return {
      name:this.name,
      id:this.id,
      ready:this.ready
    }
  }

}
module.exports = Player;
