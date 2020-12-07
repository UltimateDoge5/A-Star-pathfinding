# A Star pathfinding
A* pathfinding algorithm written in typescript

### Demo
I have made a little demo with alredy compiled code. After you download the project just open the html file in the browser and can play a little. I have commented the parts in pathFinging.ts file wich are only crucial, for the interface of demo and you can safely delete them.

### Installation
Algorithm is written in typescript which you need if you want to edit it and compile to javascript

Install typescirpt (npm package manager needed)
```sh
$ cd *folderWithAlgorithm*
$ npm i
```
### Compilation
If you are proud of your changes and want to compile type 
```sh
tsc -p tsconfig.json
```

### Usage
First create grid using grid class
```
const grid = new Grid(height,width,cellSize);
```
Aftet creating the grid youn need to initialize it. You can do it in 2 ways:
- `grid.initializeGrid();`
    When you need only the grid with no visual representation
- `grid.drawGrid();`
    Will initialize the grid and draw it with divs, then will try to add to html <main> element

Then when you need to find the path use ```AStar()``` and pass starting cell and target cell cooridnates using temlpate
```json
{x:xcoordinate, y:ycoordinate}
```

File interface.ts/js is only for the demo
### Sources
- [Wikipedia](https://en.wikipedia.org/wiki/A*_search_algorithm)
- [Sebastian Lague](https://www.youtube.com/channel/UCmtyQOKKmrMVaKuRXz02jbQ)