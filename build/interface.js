"use strict";
document.body.addEventListener("gridDrawn", assingListenersToCells);
const colors = {
    cell: "white",
    start: "lime",
    finish: "red",
    wall: "#202020",
    path: "dodgerblue",
    open: "yellow",
    closed: "orange"
};
let mode = "start";
let start;
let finish;
function assingListenersToCells() {
    document.querySelectorAll(".cell").forEach(cell => {
        cell.addEventListener("click", function () {
            if (mode == "start") {
                if (start != undefined) {
                    start.divRelative.style.backgroundColor = colors.cell;
                }
                start = mainGrid.getCell(parseInt(this.dataset.x), parseInt(this.dataset.y));
                start.divRelative.style.backgroundColor = colors.start;
            }
            else if (mode == "target") {
                if (finish != undefined) {
                    finish.divRelative.style.backgroundColor = colors.cell;
                }
                finish = mainGrid.getCell(parseInt(this.dataset.x), parseInt(this.dataset.y));
                finish.divRelative.style.backgroundColor = colors.finish;
            }
            else {
                let cell = mainGrid.getCell(parseInt(this.dataset.x), parseInt(this.dataset.y));
                if (cell.isWalkable == true) {
                    console.log("siciana");
                    cell.isWalkable = false;
                    cell.divRelative.style.backgroundColor = colors.wall;
                }
                else if (cell.isWalkable == false) {
                    console.log("nie siciana");
                    cell.isWalkable = true;
                    cell.divRelative.style.backgroundColor = colors.cell;
                }
                console.log(cell);
            }
        });
    });
}
document.querySelector("#find").addEventListener("click", () => {
    for (let row of mainGrid.getGrid()) {
        for (let cell of row) {
            if (cell.isWalkable == true) {
                if (cell == start || cell == finish) {
                    continue;
                }
                cell.divRelative.style.backgroundColor = colors.cell;
            }
        }
    }
    if (start != undefined && finish != undefined) {
        AStar(start.getVector(), finish.getVector());
    }
});
document.querySelector("#start").addEventListener("click", function () {
    document.querySelector("#tool").textContent = this.id;
    mode = this.id;
});
document.querySelector("#target").addEventListener("click", function () {
    document.querySelector("#tool").textContent = this.id;
    mode = this.id;
});
document.querySelector("#wall").addEventListener("click", function () {
    document.querySelector("#tool").textContent = this.id;
    mode = this.id;
});
document.querySelector("#gridControl").addEventListener("click", function () {
    mainGrid.x = parseInt(document.querySelector("#height").value);
    mainGrid.y = parseInt(document.querySelector("#width").value);
    mainGrid.cellSize = parseInt(document.querySelector("#cell").value);
    mainGrid.drawGrid();
});
