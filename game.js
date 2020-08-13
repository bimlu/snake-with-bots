const TABLESIZE = 40;

class Food {
    constructor() {
        this.foodX = 10;
        this.foodY = 10;
    }

    createFood() {
        this.foodX = Math.floor( Math.random() * TABLESIZE );
        this.foodY = Math.floor( Math.random() * TABLESIZE );
    }
}

let food = new Food()

class Snake {
    constructor() {
        // X, Y => down, right
        this.headX = 20;
        this.headY = 20;
        this.tailX = [20, 20, 20];
        this.tailY = [19, 18, 17];

        this.prevTailEndX = 0;
        this.prevTailEndY = 0;

        this.direction = 'right';
        this.dead = false;
        this.incrementInSize = 1;
    }

    moveSnake() {
        // save prev tail end
        this.prevTailEndX = this.tailX[snake.tailX.length - 1];
        this.prevTailEndY = this.tailY[snake.tailY.length - 1];

        // make the tail follow the head
        for (let i = this.tailX.length - 1; i >= 1; i--) {
            this.tailX[i] = this.tailX[i-1];
            this.tailY[i] = this.tailY[i-1];
        }

        this.tailX[0] = this.headX;
        this.tailY[0] = this.headY;

        if (this.direction === 'right') {
            if (this.headY === TABLESIZE - 1) {
                snake.dead = true
            } else {
                this.headY++;
            }
        } else if (this.direction === 'left') {
            if (this.headY === 0) {
                snake.dead = true
            } else {
                this.headY--;
            }
        } else if (this.direction === 'up') {
            if (this.headX === 0) {
                snake.dead = true
            } else {
                this.headX--;
            }
        } else if (this.direction === 'down') {
            if (this.headX === TABLESIZE - 1) {
                snake.dead = true
            } else {
                this.headX++;
            }
        }

        /*// No wall mode
        if (this.direction === 'right') {
            if (this.headY === TABLESIZE - 1) {
                this.headY = 0;
            } else {
                this.headY++;
            }
        } else if (this.direction === 'left') {
            if (this.headY === 0) {
                this.headY = TABLESIZE - 1;
            } else {
                this.headY--;
            }
        } else if (this.direction === 'up') {
            if (this.headX === 0) {
                this.headX = TABLESIZE - 1;
            } else {
                this.headX--;
            }
        } else if (this.direction === 'down') {
            if (this.headX === TABLESIZE - 1) {
                this.headX = 0;
            } else {
                this.headX++;
            }
        }*/
    }

    checkIfHeadHitTail() {
        for (let i = 0; i < this.tailX.length; i++) {
            if (this.tailX[i] === this.headX && 
            this.tailY[i] === this.headY) {
                snake.dead = true;
                break
            }
        }
    }

    didSnakeGetFood() {
        //
        return  (this.headX === food.foodX && this.headY === food.foodY);
    }

    increaseSnakeSize(prevTailEndX, prevTailEndY) {
        for (let i = 0; i <= this.incrementInSize; i++) {
            this.tailX.push( prevTailEndX );
            this.tailY.push( prevTailEndY );
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

let snake = new Snake()

class Game {
    constructor() {
        this.player = null;
        this.speedInterval = 10;
        this.timerId = null;
        this.paused = true;

        // info
        this.foodEaten = 0;
        this.eatingSpeedT = 0;
        this.eatingSpeedD = 0;
        this.timeElapsed = 0;
        this.distanceTravelled = 0;

        // always hide reset button
        document.querySelector('button.reset').hidden = true;
    
        this.createBoard();
    }

    createBoard() {
        let board = document.querySelector('.board');
        let table = document.createElement('table');
        table.className = 'table';

        for (let i = 0; i < TABLESIZE; i++) {
            let tr = document.createElement('tr');

            for (let j = 0; j < TABLESIZE; j++) {
                let td = document.createElement('td');
                td.className = 'groundCell';
                tr.appendChild(td);
            }

            table.appendChild(tr);
        }

        board.appendChild(table);
        this.render();
    }

    render() {

        let table = document.querySelector('table.table');

        table.children[snake.prevTailEndX].children[snake.prevTailEndY].className = 'groundCell';

        table.children[snake.headX].children[snake.headY].className = 'headCell';
        table.children[food.foodX].children[food.foodY].className = 'foodCell';
        for (let k = 0; k < snake.tailX.length; k++) {
            table.children[snake.tailX[k]].children[snake.tailY[k]].className = 'tailCell';
        }

        document.querySelector('#foodEaten').innerHTML = this.foodEaten;
        document.querySelector('#eatingSpeedT').innerHTML = this.eatingSpeedT;
        document.querySelector('#eatingSpeedD').innerHTML = this.eatingSpeedD;
        document.querySelector('#timeElapsed').innerHTML = 
                                                (this.timeElapsed).toFixed(2);
        document.querySelector('#distanceTravelled').innerHTML = this.distanceTravelled;
    }

    start() {
        this.stop();
        this.paused = false;

        // hide all buttons while the game is on
        document.querySelector('button.userGame').hidden = true;
        document.querySelector('button.chBot').hidden = true;
        document.querySelector('button.mcBot').hidden = true;

        let update = () => {
            this.distanceTravelled += 1;
            this.timeElapsed += this.speedInterval / 1000;

            // move snake one step
            snake.moveSnake();

            // check if head hit the tail
            snake.checkIfHeadHitTail();

            if ( snake.dead ) {
                this.stop();

                // show the reset button when dead
                document.querySelector('button.reset').hidden = false;
            
                let message = document.querySelector('p.message');
                message.innerHTML = `Oops! the snake crashed. Your Ate <span style="color: 
                red;">${this.foodEaten}</span> food <br>with an accuracy of 
                <span style="color:
                 red;">${this.eatingSpeedD}</span> <i>meter per food</i>.`;
        
                return;
            }

            // check if snake got the food
            if ( snake.didSnakeGetFood() ) {
                snake.increaseSnakeSize(snake.prevTailEndX, snake.prevTailEndY);
                food.createFood();
                this.updateInfo();
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

        this.stop();
        let table = document.querySelector('.board').children[0];
        table.remove();

        food = new Food();
        snake = new Snake();
        game = new Game();
    }

    updateInfo() {
        this.foodEaten += 1;
        this.eatingSpeedD = (this.distanceTravelled / this.foodEaten).toFixed();
        this.eatingSpeedT = (this.timeElapsed / this.foodEaten).toFixed(2);

        // if (this.speedInterval > 10) {
        //     this.speedInterval -= 1;
        // }
    }

}