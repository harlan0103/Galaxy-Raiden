/*Get element from HTML*/
var flight = document.getElementById("user_flight");
var game_canvas = document.getElementById("game_canvas");
var current_score = document.getElementById("current_score");
var current_kill = document.getElementById("current_kill");
var current_alive_time = document.getElementById("current_alive_time")
var current_distance = document.getElementById("current_distance");

var endgame_display = document.getElementById("endgame_display");
var end_score = document.getElementById("end_score");
var end_kill = document.getElementById("end_kill");
var end_alive_time = document.getElementById("end_alive_time");
var end_distance = document.getElementById("end_distance");
var end_distance = document.getElementById("end_distance");
var end_highest_score = document.getElementById("end_highest_score");
var end_most_kill = document.getElementById("end_most_kill");

var restart = document.getElementById("restart_btn");

/*ScoreBoard information*/
var killNum = 0;
var score = 0;
var aliveTime = 0;
var distance = 0;
var highestScore;   // Store highest score into the chache
var mostKilled; // Save most kill information
var minite = 0; // Timer variables
var second = 0;
var millisecond = 0;
var distance = 0;
var bulletShot = false;

/*Listeners*/
var bulletspeedstop;
var bulletflystop;
var enemyFlightListener;
var enemyFlyListner;
var enemyBulletListener;
var enemyBulletMoveListener;
var enemyFlightHitListener;
var createEnemyFlightListener;
var userHitListener;
var socreListener;
var timerListener;
var distanceListener;

/*Arrays*/
var array = []; // An array stores user flight bullets object
var enemyFlightArray = [];  // An array stores enemy flight object
var enemyBulletArray = [];  // An array stores enemy bullet object

/*Booleans*/
var userFlightAlive = true;
var endGame = true;

/*
@onmousemove
Detect mouse movement
Avoid user flight out of boundary
*/
document.onmousemove = function(e){
    // When user flight is alive
    // Move mouse will move user flight
    if(userFlightAlive != false){
        var oDiv=document.getElementById("user_flight");
        var oEvent= e||event;
        var flightLeft = oDiv.style.left;
        var scrollLeft=document.documentElement.scrollLeft||document.body.scrollLeft;
        
        var left = oEvent.clientX+scrollLeft;
        if(left <= 203){
            //console.log("less");
            oDiv.style.left = '203px';
        }
        else if(left >= 965){
            oDiv.style.left = '965px';
            //console.log(oDiv.style.left);
        }
        else{
            oDiv.style.left = oEvent.clientX + scrollLeft + 'px';
        }
    }   
}

/*
@onkeydown
When user press 'A'
User flight shot a bullet
*/
document.body.onkeydown = function(code){
    if(code.keyCode == 65 || code.keyCode == 32){
        bulletShot = true;   
    }
}
document.body.onkeyup = function(code){
    if(code.keyCode == 65 || code.keyCode == 32){
        bulletShot = false;   
    }
}

/*
@bulletCreate
When user press 'A'
We create a bullet object and display it on the screen
*/
function bulletCreate(){
    if(bulletShot == true){
        
        left = flight.offsetLeft;
        var bullet = document.createElement("img");
        bullet.src = "images/bullet.png";
        bullet.style.position = "absolute";
        bullet.style.left = left + 14 + "px";  // bullet is in the middle
        bullet.style.top = 690 + "px";
        bullet.alive = true;
        bullet.hitstatus = false;
        // Add this node to the game canvas
        game_canvas.appendChild(bullet);
    
        array.push(bullet);
        var timer = setInterval(function(){
            if(bullet.offsetTop - 5 >= 100){
                bullet.style.top = bullet.offsetTop - 5 + "px";
                //console.log(bullet.bullet.style.top);
            }
            // When out of bound set bullet hidden
            else{
                bullet.alive = false;
                clearInterval(timer);
                array.splice(0, 1);
                bullet.style.visibility = "hidden";
            }
        }, 10);
    }
}

/*
@createEnemy()
Create a enemy flight node
append to the game_canvas div
alive attributes indicates bullet is still alive
*/
function createEnemy(){
    var enemy = document.createElement("img");
    if(score <= 200){
        enemy.src = "images/enemyFlight.png";
    }
    else{
        enemy.src = "images/spaceEnemy.png";
    }
    
    enemy.style.position = "absolute";
    enemy.style.left = random(250, 950) + "px";
    enemy.style.top = 100 + "px";
    enemy.alive = true;
    enemy.hitstatus = false;
    // Add Enemy flight to the game canvas
    game_canvas.appendChild(enemy);
    enemyFlightArray.push(enemy);
}

/*
@enemyFly()
For each alive enemy flight in the arry
Give it a speed of 5
If flight out of bound
Drop that flight and set alive to false
*/
function enemyFly(){
    for(var i = 0; i < enemyFlightArray.length; i++){
        if(enemyFlightArray[i].alive == true){  // When enemy flight is still alive
            if(enemyFlightArray[i].offsetTop + 48 <= 800){  // If flight is not out of bound
                enemyFlightArray[i].style.top = enemyFlightArray[i].offsetTop + 5 + "px";   // move downward
            }
            else{   // When enemy flight out of bound
                enemyFlightArray[i].alive = false;
                game_canvas.removeChild(enemyFlightArray[i]);
                array.splice(i, 1);
            }
        }
    }
}

/*
@createEnemyBullet()
Create a enemy bullet node
append to the game_canvas div
alive attribute indicates bullet is still alive
*/
function createEnemyBullet(left, top){
    var eBullet = document.createElement("img");
    if(score <= 200){
        eBullet.src = "images/enemyBullet.png"; 
    }
    else{
        eBullet.src = "images/enemyFire.png"; 
    }
    
    eBullet.style.position = "absolute";
    eBullet.style.left = left + "px";
    eBullet.style.top = top + "px";
    eBullet.alive = true;
    eBullet.hitstatus = false;
    game_canvas.appendChild(eBullet);
    enemyBulletArray.push(eBullet);
}

/*
@initialEnemyBullet()
For each alive enemy flight
Create a bullet element for that flight
*/
function initialEnemybullet(){
    for(var i = 0; i < enemyFlightArray.length; i++){
        if(enemyFlightArray[i].alive == true){
            var left = enemyFlightArray[i].offsetLeft + 10;
            var top = enemyFlightArray[i].offsetTop + 50;
            createEnemyBullet(left, top);
        }
    }
}

/*
@enemyBulletMove()
A function to move each bullet with speed 5
If bullet is out of bound
Clear the bullet and set alive to flase
*/
function enemyBulletMove(){
    for(var i = 0; i < enemyBulletArray.length; i++){
        if(enemyBulletArray[i].offsetTop + 48 <= 800){
            if(score <= 200){
                enemyBulletArray[i].style.top = enemyBulletArray[i].offsetTop + 5 + "px";
            }
            else{
                enemyBulletArray[i].style.top = enemyBulletArray[i].offsetTop + 15 + "px";
            }
        }
        else{
            game_canvas.removeChild(enemyBulletArray[i]);
            enemyBulletArray[i].alive = false;
            enemyBulletArray.splice(i, 1);
        }
    }
}

/*
@enemyFlightHit
Detect Enemy flight has been hitted
Remove hitted enemy flight
Add kill number and score
*/
function enemyFlightHit(){  // For every flight object and bullet object
    for(var i = 0; i < enemyFlightArray.length; i++){
        for(var j = 0; j < array.length; j++){
            var bulletLeft = array[j].offsetLeft;
            var bulletTop = array[j].offsetTop;
            var enemyFlightLeft = enemyFlightArray[i].offsetLeft;
            var enemyFlightTop = enemyFlightArray[i].offsetTop;
            
            if(enemyFlightArray[i].alive == true){  // When the flight is still alive
                // Check if bullet will hit the flight
                // Bullet.png is 12 x 12
                if(enemyFlightLeft <= bulletLeft + 10 && bulletLeft + 10 <= enemyFlightLeft + 48 && bulletTop <= enemyFlightTop + 48){ // Boundary check
                    enemyFlightArray[i].alive = false;  // Remove enemy flight
                    game_canvas.removeChild(enemyFlightArray[i]);
                    //enemyFlightArray.splice(i, 1);
                    
                    array[j].alive = false; //  Remove bullet
                    game_canvas.removeChild(array[j]);
                    array.splice(j, 1);
                                    
                    killNum++;  // Add on flight kill
                    score = killNum * 10;
                }
            }
        }
    }
}

/*
@userFlightHit
Detect user flight status
If user flight is hitted
Call end game function
*/
function outFlightHit(){
    for(var i = 0; i < enemyBulletArray.length; i++){
        var bulletLeft = enemyBulletArray[i].offsetLeft;
        var bulletTop = enemyBulletArray[i].offsetTop;
        var userFlightLeft = flight.offsetLeft;
        var userFlightTop = flight.offsetTop;
        //console.log("bulletLeft" + bulletLeft);
        if(enemyBulletArray[i].alive == true){
            if(bulletTop + 10 >= userFlightTop && userFlightLeft <= bulletLeft + 10 && bulletLeft + 10 <= userFlightLeft + 48){
                // Enemy bullet hits user flight
                enemyBulletArray[i].alive = false;
                game_canvas.removeChild(enemyBulletArray[i]);
                enemyBulletArray.splice(i,1);
                close_game();
            }
        }
    }
}

/*
@close_game
Close all interval
Calaulate score information
Then display score board
*/
function close_game(){
    userFlightAlive = false;
    clearInterval(bulletspeedstop);
    clearInterval(bulletspeedstop);
    clearInterval(enemyFlightListener);
    clearInterval(enemyFlyListner);
    clearInterval(enemyBulletListener);
    clearInterval(enemyBulletMoveListener);
    clearInterval(enemyFlightHitListener);
    clearInterval(userHitListener);
    clearInterval(socreListener);
    clearInterval(timerListener);
    clearInterval(distanceListener);
    // Display socre information and show end game information board
    setHighestScore();
    displayScore();

    endgame_display.style.visibility = "visible";    
}

/*
@displayScore
Display the socre of the current game
And display if it is the highest score
*/
function displayScore(){
    end_kill.innerHTML = "KILLS: " + killNum;
    end_score.innerHTML = "SCORE: " + score;
    end_alive_time.innerHTML = "ALIVE TIME: " + minite + ':' + second + ':' + millisecond;
    end_distance.innerHTML = "DISTANCE: " + distance;
    end_highest_score.innerHTML = "HIGHEST SCORE: " + localStorage.getItem("highestScore");
    end_most_kill.innerHTML = "HIGHEST KILLS: " + localStorage.getItem("highestKills");
}

/*
@random()
Return a random integer in the range(lower, upper)
*/
function random(lower, upper){
    var range = upper - lower + 1;
    return Math.floor(Math.random() * range) + lower;
}

/*
@refreshScore()
Track the user scores including kills number, alive time and distance
*/
function refreshScore(){
    current_score.innerHTML = "SCORE: " + score;
    current_kill.innerHTML = "KILLS: " + killNum;
    highest_score.innerHTML = "HIGHEST SCORE: " + localStorage.getItem("highestScore");
    most_kill.innerHTML = "HIGHEST KILLS: " + localStorage.getItem("highestKills");
}

/*
@timer()
Calculate the user flight alive time
*/
function timer(){
    millisecond = millisecond + 50;
    if(millisecond >= 1000){
        millisecond = 0;
        second = second + 1;
    }
    if(second >= 60){
        second = 0;
        minite = minite + 1;
    }
    current_alive_time.innerHTML = "ALIVE TIME: " + minite + ':' + second + ':' + millisecond; 
    
}

/*
@setDistance()
Update the distance of user flight
*/
function setDistance(){
    var aliveTime = millisecond;
    distance = distance + parseInt(millisecond * 0.01);
    current_distance.innerHTML = "DISTANCE: " + distance;
}

/*
@setHighestScore()
Check if the current socre and kill number is the highest
Then store highest score and kill information to the local storage
Display relative information on the score board
*/
function setHighestScore(){
    if(localStorage.getItem("highestScore") == null){   // There is no local storage
        localStorage.setItem("highestScore", score);
        localStorage.setItem("highestKills", killNum);
    }
    else{
        var currentHighestScore = localStorage.getItem("highestScore");
        var currentHighestKills = localStorage.getItem("highestKills");
        // Check if user has get the new highest score and kills
        if(currentHighestScore < score){
            localStorage.setItem("highestScore", score);
        }
        if(currentHighestKills < killNum){
            localStorage.setItem("highestKills", killNum);
        }
    }
}

/*
@startGame()
When user load the page
start the game
*/
function startGame(){
    /*ScoreBoard information*/
    killNum = 0;
    score = 0;
    aliveTime = 0;
    distance = 0;
    minite = 0; // Timer variables
    second = 0;
    millisecond = 0;
    distance = 0;
    bulletShot = false;


    array = []; // An array stores user flight bullets object
    enemyFlightArray = [];  // An array stores enemy flight object
    enemyBulletArray = [];  // An array stores enemy bullet object

    bulletspeedstop = setInterval(bulletCreate, 100);
    enemyFlightListener = setInterval(createEnemy, 3000);   // Create an enemy flight every 4 sec
    enemyFlyListner = setInterval(enemyFly, 100);
    enemyBulletListener = setInterval(initialEnemybullet, 3000);    // Enemy flight launch missle every 3 sec
    enemyBulletMoveListener = setInterval(enemyBulletMove, 50);
    enemyFlightHitListener = setInterval(enemyFlightHit, 100);
    userHitListener = setInterval(outFlightHit, 50);
    socreListener = setInterval(refreshScore, 100);
    timerListener = setInterval(timer, 50);
    distanceListener = setInterval(setDistance, 50);
}

/*
@When user want to restart the game
Reload the page
*/
restart.onclick = function(){
    location.reload();
}

window.onload = function(){
    // When game start, hide the endgame display window
    endgame_display.style.visibility = "hidden";
    startGame();
}
