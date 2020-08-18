class Bot {
    constructor(botName) {
        this.botName = botName;
        this.bot = null;
        this.position = null;
        this.timerId = null;
        this.firstCall = true;

        // only for mccBot
        this.tailLength = 1;
        this.path = [];

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

    mccBot_possibleNeighbours(vertex) {
        let n = graph.GRIDSIZE;
        let row = Math.floor(vertex / graph.GRIDSIZE);
        let col = vertex % graph.GRIDSIZE;

        if (row === 0 && col === 0) {
            return [1, n];
        } else if ( row === 0 && col === n-1) {
            return [-1, n];
        } else if (row === n-1 && col === 0) {
            return [1, -n];
        } else if (row === n-1 && col === n-1) {
            return [-1, -n];
        } else if (row === 0) {
            return [-1, n, 1];
        } else if (row === n-1) {
            return [-1, -n, 1];
        } else if (col === 0) {
            return [-n, 1, n];
        } else if (col === n-1) {
            return [-n, -1, n];
        } else {
            return [-1, 1, -n, n];
        }
    }

    mccBot_openPath(vertex) {
        // add vertex to the graph
        graph.addVertex(vertex);

        /*add new edges*/

        let possibleNeighbours = this.mccBot_possibleNeighbours(vertex);

        for (let el of possibleNeighbours) {
            if (vertex + el in graph.graph) {
                graph.addEdge([vertex, vertex + el]);
                graph.addEdge([vertex + el, vertex]);
            }
        }
    }

    mccBot_closePath(vertex) {
        // remove vertex from graph
        graph.removeVertex(vertex);

        /*remove all connections of this vertex from graph*/

        let possibleNeighbours = this.mccBot_possibleNeighbours(vertex);

        for (let el of possibleNeighbours) {
            if (vertex + el in graph.graph) {
                let neigs = graph.graph[vertex + el];
                neigs.forEach(neig => {
                    if (neig === vertex) {
                        graph.removeEdge([vertex + el, neig]);
                    }
                })
            }
        }
    }

    mccBot_initializeGraph() {
        // make graph
        graph.graph = graph.makeGraph();

        // remove vertex from graph where tail is present
        for (let i = 0; i < snake.tailX.length; i++) {
            let tailVertex = snake.tailX[i] * graph.GRIDSIZE + snake.tailY[i];
            graph.removeVertex(tailVertex);

            // remove all connections of this vertex from graph

            let possibleNeighbours = this.mccBot_possibleNeighbours(tailVertex);

            for (let el of possibleNeighbours) {
                if (tailVertex + el in graph.graph) {
                    let neigs = graph.graph[tailVertex + el];
                    neigs.forEach(neig => {
                        if (neig === tailVertex) {
                            graph.removeEdge([tailVertex + el, neig]);
                        }
                    })
                }
            }
        }
    }

    mccBot_calculatePath() {
        let headVertex = snake.headX * graph.GRIDSIZE + snake.headY;
        let foodVertex = food.foodX * graph.GRIDSIZE + food.foodY;  

        /*find the shortest path from head to food, e.g. path = [1, 2, 6].
        and step the snake accordingly*/
        this.path = graph.findShortestPathBFS(headVertex, foodVertex);
        if (this.path.length >= 1) {
            this.path.pop();
        }
    }

    mccBot() {
        /* initializes graph when called first-time */
        if (this.firstCall) {
            this.mccBot_initializeGraph();
            this.firstCall = false;
        }

        if (this.path.length === 0) {
            this.mccBot_calculatePath();
        }

        let headVertex = snake.headX * graph.GRIDSIZE + snake.headY;
        let cell = this.path.pop();

        if (cell === headVertex + 1) {
            snake.moveRight();
        } else if (cell === headVertex - 1) {
            snake.moveLeft();
        } else if (cell === headVertex + graph.GRIDSIZE) {
            snake.moveDown();
        } else if (cell === headVertex - graph.GRIDSIZE) {
            snake.moveUp();
        }

        // snake has moved one cell
        this.mccBot_closePath(headVertex);

        if (this.tailLength === snake.tailX.length) {
            let tailEnd = snake.tailX[snake.tailX.length-1] * graph.GRIDSIZE
                             + snake.tailY[snake.tailY.length-1]; 
            // add tailEndVertex to the graph
            this.mccBot_openPath(tailEnd);
        } else {
            this.tailLength = snake.tailX.length;
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
            this.bot();

            if (snake.dead) {
                bot.stop();
                return;
            }

            this.timerId = setTimeout(play, game.updateInterval);
        }
        
        this.timerId = setTimeout(play, 0);
    }

    pause() {
        clearTimeout(this.timerId);
        game.pause();
    }

    stop() {
        clearTimeout(this.timerId);
        game.stop();
    }
}