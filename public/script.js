import { writeDataToDB } from "./modules/firebase.js";
import { Enemy, Beam, Player } from "./modules/classes.js";
import { Vars } from "./modules/globalVars.js";
var IsRestart=false;
var player1;
var movePlayerInterval;
//known bugs: if enemy moves and gets hit in between the update the hit doesnt register

function reDraw() {
    Vars.ctx.drawImage(Vars.backGround,0,0,600,700)
    Vars.ctx.drawImage(player1.playerImg,230,Vars.defaultY,50,50);
    player1.playerX=230;
    if (Player.player2Exists) {
        Vars.ctx.drawImage(Vars.player2.playerImg,330,Vars.defaultY,50,50)
        Vars.player2.playerX=330;
    }
}

function movePlayerRight(player) {
    Vars.ctx.drawImage(Vars.fillerImage,player.playerX,Vars.defaultY,50,50);
    player.playerX+=5;
    Vars.ctx.drawImage(player.playerImg,player.playerX,Vars.defaultY,50,50);
}

function movePlayerLeft(player) {
    Vars.ctx.drawImage(Vars.fillerImage,player.playerX,Vars.defaultY,50,50);
    player.playerX-=5;
    Vars.ctx.drawImage(player.playerImg,player.playerX,Vars.defaultY,50,50);
}

function CodeInit() {

    if (IsRestart){ 
        document.removeEventListener("keydown",restartListener,true);
        Vars.ResetAll();
        Enemy.ResetAll();
        Player.ResetAll();
    }

    player1;
    movePlayerInterval;
    Vars.ctx.imageSmoothingEnabled=false;
    Vars.backGround.src='img/hatter.png';
    Vars.fillerImage.src='img/fillerImage.svg';
    
    player1=new Player(230,1);
    Vars.players.push(player1);
    
    document.getElementsByTagName("body")[0].onload = () => {
        reDraw()
    }

    //event listeners

    document.addEventListener("keyup", (event) => {
        if (Vars.started) {
            switch (event.code) {
                case 'ArrowRight':
                    Vars.keys[event.code]=false;
                    break;
                case 'ArrowLeft':
                    Vars.keys[event.code]=false;
                    break;
                case 'ArrowUp':
                    Vars.keys[event.code]=false;
                    break;
                default:
                    break;
            }
            if (Player.player2Exists) {
                switch (event.code) {
                    case 'KeyD':
                        Vars.keys[event.code]=false;
                        break;
                    case 'KeyA':
                        Vars.keys[event.code]=false;
                        break;
                    case 'KeyW':
                        Vars.keys[event.code]=false;
                        break;
                    default:
                        break;
                }
            }
        }
    })
    
    document.addEventListener("keydown", async (event) => {
        if (Vars.started) {
            switch (event.code) {
                case 'ArrowRight':
                    Vars.keys[event.code]=true;
                    break;
                case 'ArrowLeft':
                    Vars.keys[event.code]=true;
                    break;
                case 'ArrowUp':
                    Vars.keys[event.code]=true;
                    break;
                default:
                    break;
            }
            if (Player.player2Exists) {
                switch (event.code) {
                    case 'KeyD':
                        Vars.keys[event.code]=true;
                        break;
                    case 'KeyA':
                        Vars.keys[event.code]=true;
                        break;
                    case 'KeyW':
                        Vars.keys[event.code]=true;
                        break;
                    default:
                        break;
                }
            }
        }
        else{
            if (event.isComposing || event.code==='KeyL' && !Vars.menuKeyLock) {
                location.href='./leaderboard.html'
                return;
            }
            if (event.isComposing || event.code==='Space' && !Vars.menuKeyLock) {
                Vars.menuKeyLock=true;
                drawAllEnemies();
                await Vars.timeout(2500);
                decideEnemySpeed();
                document.getElementsByTagName("h2")[0].innerText="Started!";
                document.getElementsByTagName("h2")[1].innerText="Wave 1";
                if (!Player.player2Exists) {
                    Vars.UserName=prompt("Player name (cancel if you dont want to store your score):")
                }
                Vars.started=true;
                Vars.waveClearTime=Date.now();
                return;
            }
            if (!Player.player2Exists && !Vars.started && !Vars.menuKeyLock){
                if (event.isComposing || event.code==='Enter') {
                    Vars.player2=new Player(330,2);
                    Vars.players.push(Vars.player2);
                    Player.player2Exists=true;
                    document.getElementsByTagName("h2")[1].innerText="Player 2 Controls: W A D";
                    document.getElementsByTagName("p")[1].innerText="Player 1 score: 0";
                    document.getElementById("scoreDiv").appendChild(Object.assign(document.createElement("p"),{innerText: "Player 2 score: 0"}));
                    await Vars.timeout(60)
                    Vars.ctx.drawImage(Vars.player2.playerImg,330,Vars.defaultY,50,50)
                    return;
                }
            }
        }
    })

    //movement hogy lehessen egyszerre mindketto jatekosnak mozogni=keyvalue pair

    movePlayerInterval=setInterval(movePlayer,25)
}

function decideEnemySpeed() {
    if (Player.player2Exists) Vars.enemyLoop=setInterval(enemyMoveLoop,800);
    else Vars.enemyLoop=setInterval(enemyMoveLoop,900);
}

async function movePlayer(){
    if (Vars.keys['ArrowRight'] && player1.playerX!=Vars.canvas.clientWidth-40) {
        movePlayerRight(player1);
    }
    if (Vars.keys['ArrowLeft'] && player1.playerX!=0) {
        movePlayerLeft(player1);
    }
    if (Vars.keys['ArrowUp'] && !player1.delay) {
        player1.delay=true;
        let beam=new Beam(player1.playerX,1);
        beam.beamFly();
        await Vars.timeout(500);
        player1.delay=false;
    }
    if (Player.player2Exists) {
        if (Vars.keys['KeyD'] && Vars.player2.playerX!=Vars.canvas.clientWidth-40) {
            movePlayerRight(Vars.player2);
        }
        if (Vars.keys['KeyA'] && Vars.player2.playerX!=0) {
            movePlayerLeft(Vars.player2);
        }
        if (Vars.keys['KeyW'] && !Vars.player2.delay) {
            Vars.player2.delay=true;
            let beam=new Beam(Vars.player2.playerX,2);
            beam.beamFly()
            await Vars.timeout(500)
            Vars.player2.delay=false;
        }
    }
}


async function drawAllEnemies(){
for (let j = 0; j < 3; j++) {
    for (let i = 0; i < 12; i++) {
        if (j===2 && Vars.waveCount>1) var enemy = new Enemy(Vars.waveCount);
        else if (Vars.waveCount>1) var enemy=new Enemy(Vars.waveCount-1);
        else var enemy=new Enemy(Vars.waveCount);
        await Vars.timeout(50);
        Vars.ctx.drawImage(enemy.kep,Enemy.enemyPlaceX,Enemy.enemyPlaceY,40,40);
        enemy.enemyX=Enemy.enemyPlaceX;
        enemy.enemyY=Enemy.enemyPlaceY;
        Vars.enemies.push(enemy)
        Enemy.enemyPlaceX+=50;
        }
        Enemy.enemyPlaceX = 0;
        Enemy.enemyPlaceY+=30;
    }   
    return true;
}

function enemyMoveLoop(){
    Vars.enemies.forEach(enemy => {
        if (enemy.enemyY<600) {
            enemy.moveEnemy();
        }
        else endGame();
    });
}

function resetKeys() {
    Object.keys(Vars.keys).forEach(key=>{
        Vars.keys[key]=false;
    })
}

function clearStuff() {
    document.removeEventListener("keydown",(event));
    document.removeEventListener("keyup",(event));
    clearInterval(movePlayerInterval);
    clearInterval(Vars.enemyLoop);
}

function showWaveClearTime() {
    document.getElementById("timeDiv").appendChild(Object.assign(document.createElement("p"),{innerText: "Wave "+Vars.waveCount+" clear time: "+Math.floor((Date.now()-Vars.waveClearTime)/1000)+" seconds"}));
}

function showTotalTime() {
    document.getElementById("timeDiv").appendChild(Object.assign(document.createElement("p"),{innerText: "Total time: "+Vars.totalTime+" seconds"}));
}

export async function waveEnd() {
    if (Vars.enemies.length===0) {
        clearInterval(Vars.enemyLoop);
        showWaveClearTime();
        Vars.totalTime+=Math.floor((Date.now()-Vars.waveClearTime)/1000);
        Vars.waveClearTime=Date.now();
        Vars.started=false;
        reDraw();
        Vars.waveCount++;
        if (Vars.waveCount>5) {
            Vars.gameWon=true;
            endGame();
            return;
        }
        document.getElementsByTagName("h2")[1].innerText="Wave "+Vars.waveCount;
        await Vars.timeout(200);
        Enemy.enemyPlaceX=0;
        Enemy.enemyPlaceY=0;
        resetKeys();
        drawAllEnemies();
        await Vars.timeout(2500);
        Vars.started=true;
        decideEnemySpeed();
    }
}

function scoreCalc(){
    return Math.round((player1.playerScore/Vars.totalTime)*200)
}

async function restartListener(event) {
    if (event.isComposing || event.code==='Space') {
        console.log("hello");
        IsRestart=true;
        CodeInit();
        return;
    }
}

function endGame() {
    if (Vars.gameWon) {
        document.getElementsByTagName("h2")[0].innerText="You won!";
        document.getElementsByTagName("h2")[1].innerText="Space to restart!";
        showTotalTime()
        if (!Player.player2Exists && Vars.UserName!==null && Vars.UserName!=="") writeDataToDB(Vars.UserName,Vars.totalTime,scoreCalc());
        clearStuff();
    }
    else{
        document.getElementsByTagName("h2")[0].innerText="You lost!";
        document.getElementsByTagName("h2")[1].innerText="Space to restart!";
        clearStuff();
    }
    document.addEventListener("keydown",restartListener,true);
}

CodeInit();