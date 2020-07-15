class Snake {
    // (x, y) <=> (row, col) <=> (down, right)
    constructor() {
        this.tableSize = 40;
        this.foodX = 10;
        this.foodY = 10;
        this.headX = 20;
        this.headY = 20;
        this.tailX = [20, 20, 20];
        this.tailY = [19, 18, 17];

        this.direction = 'right';
        this.speedInterval = 120;
        this.timerId = null;
        this.paused = true;
        this.score = 0;
        this.level = 1;

        // stores scores until tab refresh
        this.scoreData = [];
        this.highest = 0;

        this.createBoard();
    }

    createBoard() {
        let board = document.querySelector('.board');
        let table = document.createElement('table');
        table.className = 'table';

        for (let i = 0; i < this.tableSize; i++) {
            let tr = document.createElement('tr');

            for (let j = 0; j < this.tableSize; j++) {
                let td = document.createElement('td');
                tr.appendChild(td);
            }

            table.appendChild(tr);
        }

        board.appendChild(table);

        this.render();
    }

    render() {
        let table = document.querySelector('table.table');

        for (let i = 0; i < this.tableSize; i++) {
            for (let j = 0; j < this.tableSize; j++) {
                let groundCell = table.children[i].children[j];
                groundCell.className = 'groundCell';
            }
        }

        let foodCell = table.children[this.foodX].children[this.foodY];
        foodCell.className = 'foodCell';

        let headCell = table.children[this.headX].children[this.headY];
        headCell.className = 'headCell';

        for (let i = 0; i < this.tailX.length; i++) {
            let tailCell = table.children[this.tailX[i]].children[this.tailY[i]];
            tailCell.className = 'tailCell';
        }

        document.querySelector('#score').innerHTML = this.score;
        document.querySelector('#level').innerHTML = this.level;
        document.querySelector('#highest').innerHTML = this.highest;
    }

    start() {
        this.stop();
        this.paused = false;

        let update = () => {
            // save position of the last cell of the tail
            let tailEndX = this.tailX[ this.tailX.length - 1 ];
            let tailEndY = this.tailY[ this.tailY.length - 1 ];

            // move snake one step
            this.moveSnake();

            // check if the snake is dead
            if ( this.isSnakeDead() ) {
                snake.stop();
            
                let message = document.querySelector('p.message');
                message.innerHTML = `Oops! the snake crashed.<br>
                    Your Score is ${this.score}.`;

                document.querySelector('button.reset').hidden = false;
                document.querySelector('.navigation').hidden = true;
        
                return;
            }

            // check if snake got the food
            if ( this.didSnakeGetFood() ) {
                this.score++;
                this.increaseSnakeSize(tailEndX, tailEndY);
                this.createFood();
                this.updateLevelandSpeed();
            }

            this.render();
            this.timerId = setTimeout(update, this.speedInterval);
        }

        this.timerId = setTimeout(update, 0);
    }

    stop() {
        //
        clearTimeout(this.timerId);
        this.paused = true;
    }

    reset() {
        // remove the previous goodbye message
        document.querySelector('p.message').innerHTML = '' ;
        // show hidden navigation buttons
        document.querySelector('.navigation').hidden = false;
        document.querySelector('button.reset').hidden = true;

        // save the current score and highest score
        this.scoreData.push(this.score);
        this.scoreData.sort((a, b) => b - a);
        this.highest = this.scoreData[0];

        this.stop();
        let table = document.querySelector('.board').children[0];
        table.remove();

        this.tableSize = 40;
        this.foodX = 10;
        this.foodY = 10;
        this.headX = 20;
        this.headY = 20;
        this.tailX = [20, 20, 20];
        this.tailY = [19, 18, 17];

        this.direction = 'right';
        this.speedInterval = 120;
        this.score = 0;
        this.level = 1;

        this.createBoard();
    }

    moveSnake() {
        // make the tail follow the head
        for (let i = this.tailX.length - 1; i >= 1; i--) {
            this.tailX[i] = this.tailX[i-1];
            this.tailY[i] = this.tailY[i-1];
        }

        this.tailX[0] = this.headX;
        this.tailY[0] = this.headY;

        if (this.direction === 'right') {
            if (this.headY === this.tableSize - 1) {
                this.headY = 0;
            } else {
                this.headY++;
            }
        } else if (this.direction === 'left') {
            if (this.headY === 0) {
                this.headY = this.tableSize - 1;
            } else {
                this.headY--;
            }
        } else if (this.direction === 'up') {
            if (this.headX === 0) {
                this.headX = this.tableSize - 1;
            } else {
                this.headX--;
            }
        } else if (this.direction === 'down') {
            if (this.headX === this.tableSize - 1) {
                this.headX = 0;
            } else {
                this.headX++;
            }
        }
    }

    isSnakeDead() {
        for (let i = 0; i < this.tailX.length; i++) {
            if (this.tailX[i] === this.headX && 
            this.tailY[i] === this.headY) {
                return true;
            }
        }

        return false;
    }

    didSnakeGetFood() {
        //
        return  (this.headX === this.foodX && this.headY === this.foodY);
    }

    increaseSnakeSize(prevTailEndX, prevTailEndY) {
        this.tailX.push( prevTailEndX );
        this.tailY.push( prevTailEndY );
    }

    createFood() {
        this.foodX = Math.floor( Math.random() * this.tableSize );
        this.foodY = Math.floor( Math.random() * this.tableSize );
    }

    updateLevelandSpeed() {
        if ( this.score % 5 === 0 ) {
            this.level++;
            this.speedInterval -= 5;
        }
    }

    moveRight() {
        if (this.direction === 'up' || this.direction === 'down') {
            this.direction = 'right';
        }
    }

    moveLeft() {
        if (this.direction === 'up' || this.direction === 'down') {
            this.direction = 'left';
        }
    }

    moveUp() { 
        if (this.direction === 'right' || this.direction === 'left') {
            this.direction = 'up';
        }
    }

    moveDown() {
        if (this.direction === 'right' || this.direction === 'left') {
            this.direction = 'down';
        }
    }
}

let snake = new Snake();

/**************************************/
/************EVENT-LISTENER************/
/**************************************/

document.querySelector('.reset').addEventListener('click', (e) => {
    snake.reset();
});

document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowLeft':
        case 'a':
             snake.moveLeft(); break;
        case 'ArrowUp':
        case 'w':
            snake.moveUp(); break;
        case 'ArrowRight':
        case 'd':
            snake.moveRight(); break;
        case 'ArrowDown':
        case 's':
            snake.moveDown(); break;
    }
});


/**********TOUCH-EVENT-LISTENER***********/
document.addEventListener('touchstart', (e) => {
    // let x = e.touches[0].clientX;
    // let y = e.touches[0].clientY;
});

document.addEventListener('touchend', (e) => {
    // code here
});

document.addEventListener('touchmove', (e) => {
    // code here
});

document.addEventListener('touchcancel', (e) => {
    // code here
});

/************ONSCREEN-CONTROL-KEY***************/
document.querySelector('button.play').addEventListener('click', (e) => {
    (snake.paused === true) ? snake.start() : snake.stop();
});

document.querySelector('button.left').addEventListener('click', (e) => {
    snake.moveLeft();
});

document.querySelector('button.up').addEventListener('click', (e) => {
    snake.moveUp();
});

document.querySelector('button.right').addEventListener('click', (e) => {
    snake.moveRight();
});

document.querySelector('button.down').addEventListener('click', (e) => {
    snake.moveDown();
});