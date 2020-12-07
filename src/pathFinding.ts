interface Vector {
    "x": number,
    "y": number
}

class Cell {
    x: number;
    y: number;
    gCost: number;
    hCost: number;
    size: number;//For interface
    isWalkable: boolean;
    pathParent: Cell;
    divRelative: HTMLDivElement;//For interface

    constructor(x: number, y: number, size: number) {
        this.x = x;
        this.y = y;
        this.size = size;                                   //For
        this.divRelative = document.createElement("div");   //
        this.divRelative.style.width = `${this.size}px`;    //
        this.divRelative.style.height = `${this.size}px`;   //
        this.divRelative.classList.add("cell");             //
        this.divRelative.dataset.x = this.x.toString();     //
        this.divRelative.dataset.y = this.y.toString();     //Interface
        this.gCost = 0;
        this.hCost = 0;
        this.isWalkable = true;
    }
    fCost = (): number => {
        return this.gCost + this.hCost;
    }
    getVector = (): Vector => {//Get vector of the cell
        return { x: this.x, y: this.y }
    }
}

class Grid {
    cellSize: number;
    x: number;
    y: number;
    trueSizeX: number;
    trueSizeY: number;
    grid: Cell[][];
    gridEvent: Event;//For interface
    constructor(x: number, y: number, cellSize: number) {
        this.cellSize = cellSize;
        this.x = x;
        this.y = y;
        this.grid = [];
        this.gridEvent = new Event('gridDrawn');//Event for interface
    }

    initializeGrid = () => {
        this.trueSizeX = Math.round(this.x / this.cellSize);
        this.trueSizeY = Math.round(this.y / this.cellSize);
        for (let i = 0; i < this.trueSizeX; i++) {
            this.grid.push([]);
            for (let j = 0; j < this.trueSizeY; j++) {
                this.grid[i][j] = new Cell(i, j, this.cellSize);
            }
        }
    }

    drawGrid = () => {
        this.trueSizeX = Math.round(this.x / this.cellSize);
        this.trueSizeY = Math.round(this.y / this.cellSize);
        let main = document.querySelector("main")
        main.innerHTML = "";
        for (let i = 0; i < this.trueSizeX; i++) {
            this.grid.push([]);
            let row = document.createElement("div");
            row.classList.add("row");

            for (let j = 0; j < this.trueSizeY; j++) {
                this.grid[i][j] = new Cell(i, j, this.cellSize);
                row.append(this.grid[i][j].divRelative);
            }
            main.append(row);
        }
        return document.body.dispatchEvent(this.gridEvent)
    }
    getGrid = (): Cell[][] => {//Get whole grid
        return this.grid;
    }
    getCell = (x: number, y: number): Cell => {//Get the cell by coordianates
        return this.grid[x][y];
    }
    getNeighboringCells = (cell: Cell): Cell[] => {//Get 8 cells around given cell (if in boundaries of the grid)
        let neighbors: Cell[] = [];
        for (let x = -1; x <= 1; x++) {
            for (let y = -1; y <= 1; y++) {
                if (x == 0 && y == 0) continue;
                let neighborX = cell.x + x;
                let neighborY = cell.y + y;

                if (neighborX >= 0 && neighborX < this.trueSizeX && neighborY >= 0 && neighborY < this.trueSizeY) {
                    neighbors.push(mainGrid.getCell(neighborX, neighborY));
                }
            }
        }
        return neighbors;
    }
    getDistanceBetweenCells = (cellA: Cell, cellB: Cell): number => {//Get distance between cells using equation I got from the internet
        let distanceX: number = Math.abs(cellA.x - cellB.x);
        let distanceY: number = Math.abs(cellA.y - cellB.y);

        if (distanceX > distanceY) return (14 * distanceY) + (10 * (distanceX - distanceY));
        return 14 * distanceX + 10 * (distanceY - distanceX);
    }

    retracePath = (startCell: Cell, targetCell: Cell): Cell[] => {//Retrace the path using parent attribute set in algorithm
        let path: Cell[] = [];
        let currentCell: Cell = targetCell;
        while (currentCell != startCell) {
            path.push(currentCell)
            currentCell = currentCell.pathParent;
        }
        path.reverse();//Reverse the path to correct order (now its backwards), important when doing pathfinfing for game or sometihng
        return path;
    }
}

function AStar(start: Vector, target: Vector) {
    const t0 = performance.now();
    const startCell = mainGrid.getCell(start.x, start.y);
    const targetCell = mainGrid.getCell(target.x, target.y);
    let openCells: Cell[] = [startCell];
    let closedCells: Cell[] = [];
    startCell.hCost = mainGrid.getDistanceBetweenCells(startCell, targetCell);

    while (openCells.length > 0) {//Loop until there are no more cells to analyze
        let currentCell: Cell = openCells[0];
        for (let i = 0; i < openCells.length; i++) {//Could be optimized by replacing this awful loop with a heap, but im too lazy to do that
            if (openCells[i].fCost() < currentCell.fCost() || openCells[i].fCost() == currentCell.fCost() && openCells[i].hCost < currentCell.hCost) {//Get cell with lowest fCost
                currentCell = openCells[i];
            }
        }

        if (currentCell != targetCell && currentCell != startCell) {//Color closed cells (For interface)
            currentCell.divRelative.style.backgroundColor = colors.closed;
        }

        openCells.splice(openCells.indexOf(currentCell), 1);//Remove current cell from open cells
        closedCells.push(currentCell);

        if (currentCell == targetCell) {//Yay we found the target cell
            const path = mainGrid.retracePath(startCell, targetCell);
            for (let cell of path) {//mark the path (For interface)
                if (cell != targetCell && cell != startCell) {
                    cell.divRelative.style.backgroundColor = colors.path;
                }
            }
            const t1 = performance.now();//Measure the time (for interface)
            document.querySelector("#time").textContent = `${t1 - t0}ms`//display time (for interface)
            return true;
        }

        for (let neighborCell of mainGrid.getNeighboringCells(currentCell)) {//Iterate over neighboring cells
            if (!neighborCell.isWalkable || closedCells.includes(neighborCell)) {//Cant walk through walls
                continue;
            }

            let moveCostToNeighbour: number = currentCell.gCost + mainGrid.getDistanceBetweenCells(currentCell, neighborCell);//Math
            if (moveCostToNeighbour < neighborCell.gCost || !openCells.includes(neighborCell)) {
                neighborCell.gCost = moveCostToNeighbour;
                neighborCell.hCost = mainGrid.getDistanceBetweenCells(neighborCell, targetCell);
                neighborCell.pathParent = currentCell;

                if (!openCells.includes(neighborCell)) {
                    if (neighborCell.divRelative.style.backgroundColor == colors.cell) {//color open cells (For interface)
                        neighborCell.divRelative.style.backgroundColor = colors.open;
                    }
                    openCells.push(neighborCell);//Nice cell you got there lets add it to the open cell list
                }
            }
        }
    }

    return false;
}

const mainGrid: Grid = new Grid(500, 1000, 30);
mainGrid.drawGrid();