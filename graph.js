class Graph {
    constructor() {
        this.GRIDSIZE = TABLESIZE;
    }

    makeGraph() {
        let cnt = 0;
        let A = [], g = {};

        for (let i = 0; i < this.GRIDSIZE; i++) {
            let row = [];
            for (let j = 0; j < this.GRIDSIZE; j++) {
                row.push(cnt);
                cnt++;
            }
            A.push(row);
        }

        cnt = 0
        for (let i = 0; i < this.GRIDSIZE; i++) {
            for (let j = 0; j < this.GRIDSIZE; j++) {
                g[cnt] = [];
                for (let x of [-1, 0, 1]) {
                    if (x === 0) {
                        for (let y of [-1, 1]) {
                            if (A[i+x]!==undefined && A[i+x][j+y]!==undefined) {
                                g[cnt].push(A[i+x][j+y]);
                            }
                        }
                    } else {
                        if (A[i+x]!==undefined && A[i+x][j]!==undefined) {
                            g[cnt].push(A[i+x][j]);
                        }
                    }
                }
                cnt++;
            }
        }
        return g;
    }

    generateEdges() {
        edges = [];
        for (let vertex of Object.keys(this.graph)) {
            vertex = +vertex;
            for (let neighbour of this.graph[vertex]) {
                neighbour = +neighbour;
                let dup = false;
                for (let edge of edges) {
                    if(edge[0]===neighbour && edge[1]===vertex){
                        dup = true;
                        break;
                    }
                }
                if (!dup) {
                    edges.push([vertex, neighbour]);
                }
            }
        }

        dedges = []
        for (let [k, v] of edges) {
            d = {};
            d[k] = v;
            dedges.push(d);
        }
        return dedges
    }

    vertices() {
        return Object.keys(this.graph).map(el => +el);
    }

    edges() {
        return this.generateEdges();
    }

    addVertex(vertex) {
        if (!(vertex in this.graph)) {
            this.graph[vertex] = []
        }
    }

    addEdge(edge) {
        let vertex1, vertex2;
        [vertex1, vertex2] = edge;
        if (vertex1 in this.graph) {
            this.graph[vertex1].push(vertex2);
        } else {
            this.graph[vertex1] = [vertex2]
        }
    }

    removeVertex(vertex) {
        delete this.graph[vertex];
    }

    removeEdge(edge) {
        let vert, neig;
        [vert, neig] = edge;
        let idx = this.graph[vert].indexOf(neig);
        this.graph[vert].splice(idx, 1);
    }

    findPath(start_vertex, end_vertex, path=null) {
        if (path === null) {
            path = [];
        }
        let graph = this.graph;
        path.push(start_vertex);
        if (start_vertex === end_vertex) {
            return path;
        } 
        if (!(start_vertex in graph)) {
            return null;
        }
        for (let vertex of graph[start_vertex]) {
            if ( !(path.includes(vertex)) ) {
                let extended_path = 
                        this.findPath(vertex, end_vertex, path);
                if (extended_path) {
                    return extended_path;
                }
            }
        }
        return null;
    }
    
    findAllPaths(start_vertex, end_vertex, path=[]) {
        let graph = this.graph;
        path.push(start_vertex);
        if (start_vertex === end_vertex) {
            return [path];
        } 
        if (!(start_vertex in graph)) {
            return [];
        }
        let paths = []
        for (let vertex of graph[start_vertex]) {
            if ( !(path.includes(vertex)) ) {
                let extended_paths = 
                    this.findAllPaths(vertex, end_vertex, path.slice());
                for (let p of extended_paths) {
                    paths.push(p);
                }
            }
        }
        return paths;
    }

    shortestPath(start_vertex, end_vertex) {
        let paths = this.findAllPaths(start_vertex, end_vertex);
        return paths.sort((a, b) => a.length - b.length)[0];
    }
}