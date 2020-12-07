"use strict";
class Cell {
    constructor(x, y, size) {
        this.fCost = () => {
            return this.gCost + this.hCost;
        };
        this.getVector = () => {
            return { x: this.x, y: this.y };
        };
        this.x = x;
        this.y = y;
        this.size = size;
        this.divRelative = document.createElement("div");
        this.divRelative.style.width = `${this.size}px`;
        this.divRelative.style.height = `${this.size}px`;
        this.divRelative.classList.add("cell");
        this.divRelative.dataset.x = this.x.toString();
        this.divRelative.dataset.y = this.y.toString();
        this.gCost = 0;
        this.hCost = 0;
        this.isWalkable = true;
    }
}
class Grid {
    constructor(x, y, cellSize) {
        this.initializeGrid = () => {
            this.trueSizeX = Math.round(this.x / this.cellSize);
            this.trueSizeY = Math.round(this.y / this.cellSize);
            for (let i = 0; i < this.trueSizeX; i++) {
                this.grid.push([]);
                for (let j = 0; j < this.trueSizeY; j++) {
                    this.grid[i][j] = new Cell(i, j, this.cellSize);
                }
            }
        };
        this.drawGrid = () => {
            this.trueSizeX = Math.round(this.x / this.cellSize);
            this.trueSizeY = Math.round(this.y / this.cellSize);
            let main = document.querySelector("main");
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
            return document.body.dispatchEvent(this.gridEvent);
        };
        this.getGrid = () => {
            return this.grid;
        };
        this.getCell = (x, y) => {
            return this.grid[x][y];
        };
        this.getNeighboringCells = (cell) => {
            let neighbors = [];
            for (let x = -1; x <= 1; x++) {
                for (let y = -1; y <= 1; y++) {
                    if (x == 0 && y == 0)
                        continue;
                    let neighborX = cell.x + x;
                    let neighborY = cell.y + y;
                    if (neighborX >= 0 && neighborX < this.trueSizeX && neighborY >= 0 && neighborY < this.trueSizeY) {
                        neighbors.push(mainGrid.getCell(neighborX, neighborY));
                    }
                }
            }
            return neighbors;
        };
        this.getDistanceBetweenCells = (cellA, cellB) => {
            let distanceX = Math.abs(cellA.x - cellB.x);
            let distanceY = Math.abs(cellA.y - cellB.y);
            if (distanceX > distanceY)
                return (14 * distanceY) + (10 * (distanceX - distanceY));
            return 14 * distanceX + 10 * (distanceY - distanceX);
        };
        this.retracePath = (startCell, targetCell) => {
            let path = [];
            let currentCell = targetCell;
            while (currentCell != startCell) {
                path.push(currentCell);
                currentCell = currentCell.pathParent;
            }
            path.reverse();
            return path;
        };
        this.cellSize = cellSize;
        this.x = x;
        this.y = y;
        this.grid = [];
        this.gridEvent = new Event('gridDrawn');
    }
}
function AStar(start, target) {
    const t0 = performance.now();
    const startCell = mainGrid.getCell(start.x, start.y);
    const targetCell = mainGrid.getCell(target.x, target.y);
    let openCells = [startCell];
    let closedCells = [];
    startCell.hCost = mainGrid.getDistanceBetweenCells(startCell, targetCell);
    while (openCells.length > 0) {
        let currentCell = openCells[0];
        for (let i = 0; i < openCells.length; i++) {
            if (openCells[i].fCost() < currentCell.fCost() || openCells[i].fCost() == currentCell.fCost() && openCells[i].hCost < currentCell.hCost) {
                currentCell = openCells[i];
            }
        }
        if (currentCell != targetCell && currentCell != startCell) {
            currentCell.divRelative.style.backgroundColor = colors.closed;
        }
        openCells.splice(openCells.indexOf(currentCell), 1);
        closedCells.push(currentCell);
        if (currentCell == targetCell) {
            const path = mainGrid.retracePath(startCell, targetCell);
            for (let cell of path) {
                if (cell != targetCell && cell != startCell) {
                    cell.divRelative.style.backgroundColor = colors.path;
                }
            }
            const t1 = performance.now();
            document.querySelector("#time").textContent = `${t1 - t0}ms`;
            return true;
        }
        for (let neighborCell of mainGrid.getNeighboringCells(currentCell)) {
            if (!neighborCell.isWalkable || closedCells.includes(neighborCell)) {
                continue;
            }
            let moveCostToNeighbour = currentCell.gCost + mainGrid.getDistanceBetweenCells(currentCell, neighborCell);
            if (moveCostToNeighbour < neighborCell.gCost || !openCells.includes(neighborCell)) {
                neighborCell.gCost = moveCostToNeighbour;
                neighborCell.hCost = mainGrid.getDistanceBetweenCells(neighborCell, targetCell);
                neighborCell.pathParent = currentCell;
                if (!openCells.includes(neighborCell)) {
                    if (neighborCell.divRelative.style.backgroundColor == colors.cell) {
                        neighborCell.divRelative.style.backgroundColor = colors.open;
                    }
                    openCells.push(neighborCell);
                }
            }
        }
    }
    return false;
}
const mainGrid = new Grid(500, 1000, 30);
mainGrid.drawGrid();
