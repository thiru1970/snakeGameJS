const gameBoard = document.getElementById('gameboard');
const context = gameBoard.getContext('2d');
const scoretxt  = document.getElementById('scoreVal')

const Width = gameBoard.width;
const Height = gameBoard.height;
const Unit = 25;

let foodX;
let foodY;
let xVel = 25;
let yVel = 0;
let score = 0;
let active = true;
let started = false;

let snake = [
    {x:Unit*3,y:0},
    {x:Unit*2,y:0},
    {x:Unit,y:0},
    {x:0,y:0},
];

window.addEventListener('keydown',keyPress)

startGame();

function startGame(){
    context.fillStyle = '#212121';
    context.fillRect(0,0,Width,Height);
    createfood();
    displayfood();
    drawsnake();
    // movesnake();
    // clearBoard();
    // drawsnake();
}

function clearBoard(){
    context.fillStyle = '#212121';
    context.fillRect(0,0,Width,Height);
}

function createfood(){
    foodX = Math.floor(Math.random()*Width/Unit)*Unit;
    foodY = Math.floor(Math.random()*Height/Unit)*Unit;
}

function displayfood(){
    context.fillStyle = 'palegreen';
    context.fillRect(foodX,foodY,Unit,Unit);
}

function drawsnake() {
    context.fillStyle = 'white';

    // Draw the head (box) for the first snake part
    const headWidth = Unit;
    const headHeight = Unit;
    context.fillRect(snake[0].x, snake[0].y, headWidth, headHeight);

    // Eyes (circles)
    const headRadius = Unit / 2;
    const headX = snake[0].x + headRadius;
    const headY = snake[0].y + headRadius;

    const eyeRadius = headRadius / 4;
    context.fillStyle = 'black';
    context.beginPath();
    context.arc(headX - headRadius / 4, headY - headRadius / 4, eyeRadius, 0, 2 * Math.PI);
    context.arc(headX + headRadius / 4, headY - headRadius / 4, eyeRadius, 0, 2 * Math.PI);
    context.fill();

    // Draw the tongue (triangle)
    context.fillStyle = 'red';
    context.beginPath();
    context.moveTo(headX - eyeRadius, headY + headRadius / 2);
    context.lineTo(headX + eyeRadius, headY + headRadius / 2);
    context.lineTo(headX, headY + headRadius * 2);
    context.fill();

    // Draw the body (rectangles) for the remaining snake parts
    for (let i = 1; i < snake.length; i++) {
        context.fillRect(snake[i].x, snake[i].y, Unit, Unit);
    }
}

function movesnake(){
    // if (snake[0].x === foodX && snake[0].y === foodY) {
    //     // existing code

    //     // Play eat sound when the snake eats the food
       
    // }
    const head = {x:snake[0].x+xVel,
                 y:snake[0].y+yVel}
    snake.unshift(head)
    if(snake[0].x==foodX && snake[0].y==foodY){
        console.log("here")
        document.getElementById('eatSound').play();
        score+=1;
        scoretxt.textContent = score;
        createfood();
    }
    else{
        snake.pop()             
    }
}

function nexttick(){
    if(active){
    setTimeout(()=>{
        clearBoard();
        displayfood();
        movesnake();
        drawsnake();
        checkGameOver();
        nexttick();
    },120)
}
else{
    clearBoard();
    context.font = "bold 50px sans-serif";
    context.fillStyle = 'white';
    context.textAlign = 'center';
    context.fillText('Game Over!', Width/2,Height/2)
}
}


function keyPress(event){
    if(!started){
        started = true;
        nexttick();
    }
    active = true;
    const Left = 37
    const Up = 38
    const Right = 39
    const Down = 40

    switch(true){
        case(event.keyCode == Left && xVel!=Unit):
            xVel=-Unit;
            yVel = 0;
            break;
        case(event.keyCode == Right && xVel!=-Unit):
            xVel=Unit;
            yVel = 0;
            break;
        case(event.keyCode == Up && yVel!=Unit):
            xVel=0;
            yVel=-Unit;
            break;
        case(event.keyCode == Down && yVel!=-Unit):
            xVel=0;
            yVel=Unit;
            break;        
    }
}

function checkGameOver() {
    // Check if the head collides with any other part of the snake
    for (let i = 1; i < snake.length; i++) {
        if (snake[0].x === snake[i].x && snake[0].y === snake[i].y) {
            active = false;
            return;
        }
    }

    // Check if the head goes out of bounds
    switch (true) {
        case (snake[0].x < 0):
        case (snake[0].x >= Width):
        case (snake[0].y < 0):
        case (snake[0].y >= Height):
            active = false;
            break;
    }
}


function handleTouchStart(event) {
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
}

function handleTouchEnd(event) {
    if (!touchStartX || !touchStartY) {
        return;
    }

    const touchEndX = event.changedTouches[0].clientX;
    const touchEndY = event.changedTouches[0].clientY;

    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;

    // Adjust snake velocity based on the larger movement (horizontal or vertical)
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Horizontal movement
        xVel = deltaX > 0 ? Unit : -Unit;
        yVel = 0;
    } else {
        // Vertical movement
        xVel = 0;
        yVel = deltaY > 0 ? Unit : -Unit;
    }

    touchStartX = null;
    touchStartY = null;
}

