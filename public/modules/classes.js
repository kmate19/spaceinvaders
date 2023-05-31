import { waveEnd } from "../script.js";
import { Vars } from "./globalVars.js";

export class Enemy{
    static enemyPlaceX=0;
    static enemyPlaceY=0;
    enemyX=0;
    enemyY=0;
    constructor(id){
      this.id = id;
      this.kep = new Image();
      this.hp = id;
      this.kep.src = 'img/enemy'+id+'.svg';
    }

    moveEnemy(){
        Vars.ctx.drawImage(Vars.fillerImage,this.enemyX,this.enemyY,40,40)
        this.enemyY+=5
        Vars.ctx.drawImage(this.kep,this.enemyX,this.enemyY,40,40)
    }
    
    static ResetAll(){
        this.enemyPlaceX=0;
        this.enemyPlaceY=0;
    }
}

export class Player{
    delay=false;
    playerX;
    playerImg=new Image();
    playerScore=0;
    static player2Exists=false;
    constructor(playerX,pid) {
        this.playerX=playerX;
        this.pid=pid;
        this.playerImg.src='img/player'+pid+'.svg';
    }
    
    static ResetAll(){
        this.player2Exists=false;
    }
}

export class Beam {
    beamX;
    beamY=Vars.defaultY;
    img=new Image();
    constructor(x,playerId){
        this.beamX=x;
        this.playerId=playerId;
        this.img.src="img/beam.svg";
    }

    async beamFly() {
        while (this.beamY>0 && Vars.started) {
            Vars.ctx.drawImage(Vars.fillerImage,this.beamX+20,this.beamY,10,10);
            this.beamY-=5;
            Vars.ctx.drawImage(this.img,this.beamX+20,this.beamY);
            this.checkHit();
            await Vars.timeout(6);
        }
        Vars.ctx.drawImage(Vars.fillerImage,this.beamX+20,0,10,10);
    }

  //neha kettot lelo ha koze megy pont ugy a loves
    checkHit(){
        Vars.enemies.forEach(enemy => {
            if (this.beamX>enemy.enemyX-30 && this.beamX<enemy.enemyX+30 && this.beamY===enemy.enemyY+30) {
                Vars.ctx.drawImage(Vars.fillerImage,this.beamX,this.beamY,30,10);
                this.beamY=0;
                enemy.hp--;
                Vars.players[this.playerId-1].playerScore+=5;
                this.updateScore();
                if (enemy.hp===0) {
                    Vars.ctx.drawImage(Vars.fillerImage,enemy.enemyX,enemy.enemyY,43,43);
                    Vars.enemies.splice([Vars.enemies.indexOf(enemy)],1);
                    Vars.players[this.playerId-1].playerScore+=10;
                    this.updateScore();
                    waveEnd();
                }
            }
        });
    }

    updateScore(){
        if (Player.player2Exists) document.getElementById("scoreDiv").children[this.playerId-1].innerText="Player "+this.playerId+" score: "+Vars.players[this.playerId-1].playerScore;
        else document.getElementById("scoreDiv").children[this.playerId-1].innerText="Score: "+Vars.players[this.playerId-1].playerScore;
    }
}