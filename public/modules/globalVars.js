export class Vars{
    static canvas=document.getElementById("jatekCanvas");
    static ctx=this.canvas.getContext('2d');
    static timeout = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    static defaultY=this.canvas.height-50;
    static UserName; //=form valami bekeres
    static enemyLoop;
    static started=false;
    static menuKeyLock=false
    static player2;
    static enemies=[];
    static players=[];
    static keys={};
    static waveCount=1;
    static gameWon=false;
    static waveClearTime=0;
    static totalTime=0;
    static fillerImage=new Image();
    static backGround=new Image();

    static ResetAll() {
        this.canvas=document.getElementById("jatekCanvas");
        this.ctx=Vars.canvas.getContext('2d');
        this.timeout = (ms) => new Promise(resolve => setTimeout(resolve, ms));
        this.defaultY=Vars.canvas.clientHeight-50;
        this.UserName; //=form valami bekeres
        this.enemyLoop;
        this.started=false;
        this.menuKeyLock=false
        this.player2;
        this.enemies=[];
        this.players=[];
        this.keys={};
        this.waveCount=1;
        this.gameWon=false;
        this.waveClearTime=0;
        this.totalTime=0;
        this.fillerImage=new Image();
        this.backGround=new Image();
    }
}
