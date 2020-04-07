function Game(context, cellSize){
    var arr = [
      [1,2,3,4],
      [5,6,7,8],
      [9,10,11,12],
      [13,14,15,0]
    ];
    var clicks = 0;
 
    this.getClicks = function() {
        return clicks;
    };
  
  function cellView(x, y){
        context.fillStyle = "white";
      context.fillRect(
      x+1, 
      y+1, 
      cellSize-2, 
      cellSize-2
    );
    }
  
  function numView(){
        context.font = "bold "+ 
      (cellSize/2) + "px Sans";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillStyle = "black";
    }
  
  this.getNullCell = function(){
        for (var i = 0; i<4; i++){
            for (var j=0; j<4; j++){
                if(arr[j][i] === 0){
                    return {'x': i, 'y': j};
                }
            }
        }
    }
  
  this.draw = function() {
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 4; j++) {
                if (arr[i][j] > 0) {
                    cellView(
            j * cellSize, 
            i * cellSize
          );
                    numView();
                    context.fillText(
            arr[i][j], 
            j * cellSize + cellSize / 2,
            i * cellSize + cellSize / 2
          );
                }
            }
        }
    };
  
  this.move = function(x, y) {
    let newarr = [];
        var nullX = this.getNullCell().x;
        var nullY = this.getNullCell().y;
        if (
      ((x - 1 == nullX || x + 1 == nullX) && y == nullY) 
      || ((y - 1 == nullY || y + 1 == nullY) && x == nullX)
    ) {
            arr[nullY][nullX] = arr[y][x];
            arr[y][x] = 0;
            clicks++;
        }
        let item = document.querySelector(".item");
        newarr.push(clicks);
        item.innerHTML = newarr;
    };
 
  
  this.victory = function() {
        var e = [[1,2,3,4], [5,6,7,8], [9,10,11,12], [13,14,15,0]];
        var res = true;
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 4; j++) {
                if (e[i][j] != arr[i][j]) {
                    res = false;
                }
            }
        }
        return res;
    };
  
  function getRandomBool() {
        if (Math.floor(Math.random() * 2) === 0) {
            return true;
        }
    }
    
    this.mix = function(stepCount) {
        var x,y;
        for (var i = 0; i < stepCount; i++) {
            var nullX = this.getNullCell().x;
            var nullY = this.getNullCell().y;
            var hMove = getRandomBool();
            var upLeft = getRandomBool();
            if (!hMove && !upLeft) { y = nullY; x = nullX - 1;}
            if (hMove && !upLeft)  { x = nullX; y = nullY + 1;}
            if (!hMove && upLeft)  { y = nullY; x = nullX + 1;}
            if (hMove && upLeft)   { x = nullX; y = nullY - 1;}
            if (0 <= x && x <= 3 && 0 <= y && y <= 3) {
                this.move(x, y);
            }
        }
        clicks = 0;
    };
 
    this.getClicks = function() {
       return clicks;
    };

}


window.onload = function(){


    let x = document.createElement("CANVAS");
    let div = document.createElement("div");
    let panel = document.createElement("div");
    panel.classList.add("top-panel");
    document.body.appendChild(panel);
    for(let i = 0 ; i < 4; i++){
        let button = document.createElement("button");
        panel.appendChild(button);
        button.classList.add("panel-button");  
    }
    let a = document.getElementsByClassName("panel-button");
    a[0].innerHTML = "Размешать и начать";
    a[1].innerHTML = "Стоп";
    a[2].innerHTML = "Сохранить";
    a[3].innerHTML = "Результаты";

    let timeSection = document.createElement("div");
    timeSection.classList.add("time-panel");
    document.body.appendChild(timeSection);
    let timeText = document.createElement("span");
    let timeText2 = document.createElement("span");
    timeText2.classList.add("item");
    let text = document.createElement("p");
    text.innerHTML = "Время: ";
    let text2 = document.createElement("p");
    text2.innerHTML = "Ходов: ";
    timeText.classList.add("time-text");
    timeSection.appendChild(timeText);
    timeSection.appendChild(text);
    timeSection.appendChild(text2);
    text.appendChild(timeText);
    text2.appendChild(timeText2);
    
    timeText.innerText = "00:00";
    timeText2.innerText = "0";
  

    div.classList.add("container");
    document.body.appendChild(div);
    div.appendChild(x);
    x.setAttribute("id", "canvas");


    function functionality(){
    var canvas = document.getElementById("canvas");
    canvas.width  = 300;
    canvas.height = 300;
    var cellSize = canvas.width / 4;
    var context = canvas.getContext("2d");
    context.fillRect(0, 0, canvas.width, canvas.height);
    
   

    var game = new Game(context, cellSize);
    game.mix(300);
    game.draw();
    game.move();


  canvas.onclick = function(e) {
    var x = (e.pageX - canvas.offsetLeft) / cellSize | 0;
    var y = (e.pageY - canvas.offsetTop)  / cellSize | 0;
    event(x, y); 
  };

  canvas.ontouchend = function(e) {
    var x = (e.touches[0].pageX - canvas.offsetLeft) / cellSize | 0;
    var y = (e.touches[0].pageY - canvas.offsetTop)  / cellSize | 0;
 
    event(x, y);
  };  

  function event(x, y) { 
    game.move(x, y);
    context.fillRect(0, 0, canvas.width, canvas.height);
    game.draw();
    if (game.victory()) {
      alert("Ура! Вы решили головоломку за " +myTimer+" " +game.getClicks()+" ходов"); 
      game.mix(300);
      context.fillRect(0, 0, canvas.width, canvas.height);
        game.draw(context, cellSize);
    }
  }
    }
    functionality();

    a[0].addEventListener("click", ()=>{
        canvas.style.pointerEvents="auto";
        clearInterval(t);
        var time = 60 / 100, 
        display = document.querySelector('.time-text');
        functionality();
        startTimer(time, display);
    });
   
    let t;
    let myTimer;
function startTimer(duration, display) {
    var timer = duration, minutes, seconds;
   t = setInterval(function name() {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        myTimer = minutes + ":" + seconds;
        display.textContent = myTimer;

        if (++timer < 0) {
            timer = duration;
        }
    }, 1000);
}
a[1].addEventListener("click", func);

function func(){
    a[1].innerHTML = "Продолжить";
    let some;
    let canvas = document.getElementById("canvas");
    canvas.classList.toggle("test");
    clearInterval(t);
   if(canvas.classList.contains("test")){
    a[1].innerHTML = "Продолжить";
    canvas.classList.toggle("start");
    clearInterval(t);
   }else if(canvas.classList.contains("start")){
    a[1].innerHTML = "Стоп";
    let display = document.querySelector('.time-text');
    some = display;
    var arr = some.innerText;
    let time = String(arr).split(":");
    time[0] = parseInt(time[0]);
    time[1] = parseInt(time[1]);
    time = (Number(time.join("."))*10) + (60/100);
    startTimer(time, some);
    canvas.classList.toggle("stop");
    canvas.classList.remove("start");
   }
}


let display = document.querySelector('.time-text');
let steps = document.querySelector(".item");
a[2].addEventListener("click", ()=>{
let display = document.querySelector('.time-text');
let steps = document.querySelector(".item");
    let canvas = document.getElementById("canvas");
    canvas.classList.toggle("test");
    let time = document.querySelector('.time-text');
localStorage.time = time.innerText;
localStorage.steps = steps.innerText;
a[2].classList.add("save");
});
if(typeof localStorage.time !== "undefined") {
    display.innerHTML = localStorage.time;
    steps.innerHTML = localStorage.steps;
    func();
}else{
    display.innerHTML = "00:00";
    steps.innerHTML = "0";
}


};
