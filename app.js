//board
let board;
let boardWidth = 400;
let boardHeight = 600;
let context;


//bird
let birdWidth = 40;
let birdHeight = 40;
let birdX = boardWidth/8;
let birdY = boardHeight/2;
let birdImg;

let bird = {
    x : birdX,
    y : birdY,
    width : birdWidth,
    height : birdHeight,
}

let pipeArray = [];
let pipeWidth = 64;
let pipeHeight = 512;

let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;

//physics 
let velocityX = -2; //pipes moveing speed
let velocityY = -7; //bird jump
let gravity = 0.2;
let gameOver = false;
let score = 0;

window.onload = function() {
    board = document.getElementById("board");
    board.width = boardWidth;
    board.height = boardHeight;
    context = board.getContext("2d");

    //draw flappy bird
    // context.fillStyle = "green";
    // context.fillRect(bird.x, bird.y, bird.width, bird.height);

    //load image
    birdImg = new Image();
    birdImg.src = "pngwing.com.png";
    birdImg.onload = function(){
        context.drawImage(birdImg,bird.x,bird.y,bird.width,bird.height);
    }


    topPipeImg = new Image();
    topPipeImg.src = "top.jpeg";
    bottomPipeImg = new Image();
    bottomPipeImg.src = "bottom.jpeg";

    requestAnimationFrame(update);
    setInterval(placePipe,1500);

    document.addEventListener('keydown',moveBird);
    document.addEventListener('touchstart',moveBird)
}

function update(){
    requestAnimationFrame(update);

    if(gameOver){
        return;
    }
    context.clearRect(0,0,board.width,board.height);
    //bird
    velocityY += gravity;
    // bird.y += velocityY;
    bird.y = Math.max(bird.y + velocityY , 0); //limiy bird
    context.drawImage(birdImg,bird.x,bird.y,bird.width,bird.height);

    //when bird falls down

    if(bird.y > board.height){
        gameOver = true;
    }
    //pipes
    for(let i = 0; i< pipeArray.length;i++){
        let pipe = pipeArray[i];
        pipe.x += velocityX;
        context.drawImage(pipe.img,pipe.x,pipe.y,pipe.width,pipe.height);
        if(!pipe.passed && bird.x > pipe.x+pipe.width){
            score += 0.5;
            pipe.passed = true;

        }
        if(detectCollision(bird,pipe)){
            gameOver = true;
        }
    }
    while(pipeArray.length > 0 && pipeArray[0].x < -pipeWidth){
        pipeArray.shift();
    }

    //score
    context.fillStyle = "white";
    context.font = "45px sans-serif";
    context.fillText(score,5,45);


    if(gameOver){
        context.fillText("GAME OVER",45,300);

    }
}

function placePipe(){
    if(gameOver){
        return;
    }
    let openingSpace = boardHeight/3;
    let randomPipeY = pipeY - pipeHeight/4 - (Math.random()*(pipeHeight/2));
    let topPipe = {
        img : topPipeImg,
        x : pipeX,
        y : randomPipeY,
        width : pipeWidth,
        height : pipeHeight,
        passed : false

    }
    pipeArray.push(topPipe);
    let bottomPipe = {
        img : bottomPipeImg ,
        x : pipeX,
        y : randomPipeY+pipeHeight+ openingSpace,
        width : pipeWidth,
        height : pipeHeight,
        passed : false

    }

    pipeArray.push(bottomPipe);
}

function moveBird(event){
    if(event.code == "Space" || event.code == "ArrowUp" || event.type == "touchstart"){
        velocityY = -5;
    }

    //reset game

    if(gameOver){
        bird.y = birdY;
        pipeArray = [];
        score = 0;
        gameOver = false
    }
}

function detectCollision(a,b){
    return( a.x < b.x + b.width) && 
    a.x + a.width > b.x &&
    a.y < b.y +b.height &&
    a.y + a.height > b.y;
}