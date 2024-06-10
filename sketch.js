let grid = [];
let w;


let cols, rows;
let hueValue = 200


function make2DArray(cols, rows){
    //making 1D array and rounding the number of collumns
    let arr = new Array(round(cols));
    for (let i = 0; i<arr.length; i++){
        //for every entry in the first col array, make another dimension for rows
        arr[i] = new Array(round(rows))
        for(let j=0; j<arr[i].length; j++){
            arr[i][j]=0;
        }
    }
    return arr;
    //arr is now formatted arr[x][y]
}

function preload(){
    font = loadFont("src/TiemposHeadline-Black.woff")
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    colorMode(HSB, 360, 255, 255)

    let msg = "SELECTS", txtX=0, txtY=0;
    if(width<720){
        w=5;
        fontSize=95;
        points = font.textToPoints(msg, txtX, txtY, fontSize, {sampleFactor: .09});
    }else{
        w=10;
        fontSize=300;
        points = font.textToPoints(msg, txtX, txtY, fontSize, {sampleFactor: .06});
    }

    let bounds = font.textBounds(msg, txtX, txtY, fontSize);


    // Center text around the origin based on the bounding box.
    for (let pt of points) {
        pt.x = (pt.x - bounds.x - bounds.w/2)+width/2;
        pt.y = (pt.y - bounds.y - bounds.h/2)+height/2;
    }

    cols = round(width/w);
    rows = round(height/w);
    grid = make2DArray(cols, rows);
    for (let i=0; i<cols; i++){
        for(let j=0; j<rows; j++){
            //setting every entry in the array to 0
            grid[i][j] = 0; 
        }
    }
}

function mouseDragged(){
    let mouseCol = floor(mouseX/w);
    let mouseRow = floor(mouseY/w);
    let matrix = 20;
    let extent = floor(matrix/2);
    for(let i=-extent; i<extent; i++){
        for(let j=-extent; j<extent; j++){
                if(random(1)>.75){
                    col = mouseCol+i;
                    row = mouseRow+j;
                    if(col>=0 && col<=cols-1 && row >= 0 && row<=rows-1 &&grid[col][row]!=-1){
                        grid[col][row]=hueValue;
                    }
            }
        }    
    }
    if(hueValue>250){
        hueValue=200
    }else{
        hueValue+=1
    }
    

}



function draw(){    
    background(0);
    noStroke();
    for (let i=0; i<cols; i++){
        for(let j=0; j<rows; j++){
            if(grid[i][j]>0){
                fill(grid[i][j],255,255)
                let x = i*w;
                let y = j*w;
                //making colored squares at every x&y of rows and cols
                square(x,y,w)
            }
            if(grid[i][j]<0){
                fill(255,0,255)
                let x = i*w;
                let y = j*w;
                //making colored squares at every x&y of rows and cols
                square(x,y,w)
            }
        }
    }

    let nextGrid = make2DArray(cols, rows);
    for(let i = 0; i<cols; i++){
        for(let j = 0; j<rows; j++){
            for(let pt of points){
                if((pt.x-w)<(i*w)&&(pt.x+w)>(i*w)&&(pt.y-w)<(j*w)&&(pt.y+w)>(j*w)){
                    nextGrid[i][j]=-1
                }
            }

            let state = grid[i][j];
            if(state>0){
                let below = grid[i][j+1]
                let dir = random([-1,1]);
                let belowA, belowB;
                if(i+dir>=0 && i+dir<=cols-1 ){
                    belowA = grid[i+dir][j+1]
                }else if(i-dir>=0 && i-dir<=cols-1 ){
                    belowB = grid[i-dir][j+1]
                }

                if(below === 0){
                    nextGrid[i][j+1]=state;
                }else if(belowA===0){
                    nextGrid[i+dir][j+1]=state;
                }else if(belowB===0){
                    nextGrid[i-dir][j+1]=state;
                }else{
                    nextGrid[i][j]=state
                }
            }
        }
    }

    grid = nextGrid;
}