class Bot {
    constructor(botName) {
        this.botName = botName;
        this.bot = null;
        this.position = null;
        this.timerId = null;
    }

    chBot() {
        if (snake.headX === TABLESIZE - 1 && snake.headY === TABLESIZE - 1) {
            snake.moveLeft();
        }

        if (snake.headY === 0 && snake.headX === TABLESIZE - 1) {
            snake.moveUp();
        }

        if (!this.position) {
            if (snake.headY === TABLESIZE - 1) {
                if (snake.direction === 'right') {
                    snake.moveDown();
                } else if (snake.direction === 'down') {
                    snake.moveLeft();
                } 
            } else if (snake.headY === 0) {
                snake.moveUp();
                this.position = 'correct'
            } 
        } else {
            if (snake.headX === 0) {
                if (snake.direction === 'up') {
                    snake.moveRight()
                } else {
                    snake.moveDown()
                }
            } else if (snake.headX === TABLESIZE - 1) {
                if (snake.direction === 'down') {
                    snake.moveRight()
                } else if (snake.direction === 'right') {
                    snake.moveUp()
                }
            }
        }
    }

    mcBot() {
        if (snake.headX === 0 && snake.headY === 0) {
            (snake.direction === 'up') ? snake.moveRight() : snake.moveDown();
        } else if (snake.headX === 0 && snake.headY === TABLESIZE - 1) {
            (snake.direction === 'right') ? snake.moveDown() : snake.moveLeft();
        } else if (snake.headX === TABLESIZE - 1 && snake.headY === TABLESIZE -1) {
            (snake.direction === 'down') ? snake.moveLeft() : snake.moveUp();
        } else if (snake.headX === TABLESIZE - 1 && snake.headY === 0) {
            (snake.direction === 'left') ? snake.moveUp() : snake.moveRight();
        } else if (snake.headX === 0 && snake.direction === 'up') {
            (food.foodY > snake.headY) ? snake.moveRight() : snake.moveLeft();
        } else if (snake.headY === TABLESIZE - 1 && snake.direction === 'right') {
            (food.foodX > snake.headX) ? snake.moveDown() : snake.moveUp();
        } else if (snake.headX === TABLESIZE - 1 && snake.direction === 'down') {
            (food.foodY > snake.headY) ? snake.moveRight() : snake.moveLeft();
        } else if (snake.headY === 0 && snake.direction === 'left') {
            (food.foodX > snake.headX) ? snake.moveDown() : snake.moveUp();
        } else if (food.foodX === snake.headX) {
            (food.foodY > snake.headY) ? snake.moveRight() : snake.moveLeft();
        } else if (food.foodY === snake.headY) {
            (food.foodX > snake.headX) ? snake.moveDown() : snake.moveUp();
        }
    }

    mccBot() {
        if (snake.headX === 0 && snake.headY === 0) {
            (snake.direction === 'up') ? snake.moveRight() : snake.moveDown();
        } else if (snake.headX === 0 && snake.headY === TABLESIZE - 1) {
            (snake.direction === 'right') ? snake.moveDown() : snake.moveLeft();
        } else if (snake.headX === TABLESIZE - 1 && snake.headY === TABLESIZE -1) {
            (snake.direction === 'down') ? snake.moveLeft() : snake.moveUp();
        } else if (snake.headX === TABLESIZE - 1 && snake.headY === 0) {
            (snake.direction === 'left') ? snake.moveUp() : snake.moveRight();
        } else if (snake.headX === 0 && snake.direction === 'up') {
            (food.foodY > snake.headY) ? snake.moveRight() : snake.moveLeft();
        } else if (snake.headY === TABLESIZE - 1 && snake.direction === 'right') {
            (food.foodX > snake.headX) ? snake.moveDown() : snake.moveUp();
        } else if (snake.headX === TABLESIZE - 1 && snake.direction === 'down') {
            (food.foodY > snake.headY) ? snake.moveRight() : snake.moveLeft();
        } else if (snake.headY === 0 && snake.direction === 'left') {
            (food.foodX > snake.headX) ? snake.moveDown() : snake.moveUp();
        } else if (food.foodX === snake.headX) {
            (food.foodY > snake.headY) ? snake.moveRight() : snake.moveLeft();
        } else if (food.foodY === snake.headY) {
            (food.foodX > snake.headX) ? snake.moveDown() : snake.moveUp();
        }


    }

    start() {
        game.start();

        switch (this.botName) {
            case 'chBot':
                this.bot = this.chBot;
                break;
            case 'mcBot':
                this.bot = this.mcBot;
                break;
            case 'mccBot':
                this.bot = this.mccBot;
                break;

        }

        let play = () => {
            this.bot()
            this.timerId = setTimeout(play, game.speedInterval);
        }
        
        this.timerId = setTimeout(play, 0);
    }

    stop() {
        clearTimeout(this.timerId);
        game.stop()
    }
}