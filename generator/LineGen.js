const MINDIST = 30;
const MAXDIST = 120;
const LINEDIST = 15;

var linesF = [];
var planetsF = [];
var starsF = [];
var decorationsF = [];
var decorationsCutF = [];

//cuts a compound path to fit a shape
function cutout(shape, lineCP){
    let newshape = lineCP.subtract(shape);
    lineCP.remove();
    shape.remove();
    return newshape;
}

//cuts all shapes in lines array to fit border box with scale factor
//returns all shapes as compoundpath
function cutLines(lines, border, scalefactor){
    let lineGroup = new CompoundPath();
    for(let i = 0; i<lines.length-1; i+=2){
        let shape = lines[i].clone();
        lines[i+1].reverse();
        shape.segments = shape.segments.concat(lines[i+1].segments);
        shape.fillColor = 'blue';
        shape.closed = true;
        
        if(scalefactor){
            shape.scale(scalefactor, border.position);
        }
        
        lineGroup.addChild(shape);
        
    }
    let finalShape = border.intersect(lineGroup);
    finalShape.fillColor = 'purple';
    lineGroup.remove();
    
    lines.forEach(function(line){
        line.remove();
    });
    return finalShape;
}

//creates lines for background
function createAllLines(border){
    //start with one wobbly line in the center
    let midLine = createWobbleLine(border);
    let lines = [midLine];
    //offset last and first line in array
    while(border.intersects(lines[lines.length-1]) || border.intersects(lines[0])){
        lines.push(offsetLine(lines[lines.length-1],  1));
        lines.unshift(offsetLine(lines[0], -1));
    }
    return lines;
}

//offset line. it's a hacky offset that should look dynamic. Not the "standard" offset you
//would expect similat to offset in inkscape ;)
function offsetLine(line, dir){
    let linedist = getRandomInt(LINEDIST-5, LINEDIST+5);
    let wobbleLine = new Path();
    wobbleLine.strokeColor = 'green';
    for(let i = 0; i<line.length; i+=MINDIST){
        let p = line.getPointAt(i);
        let n = line.getNormalAt(i);
        wobbleLine.add(p.add(n.multiply(dir*linedist)));
    }
    wobbleLine.smooth(); 
    
    let sampleLine = new Path({
        strokeColor: 'red'
    });
    sampleLine.add(line.firstSegment.point);
    sampleLine.add(line.lastSegment.point);
    sampleLine.translate(line.firstSegment.point.subtract(line.lastSegment.point).rotate(dir*90).normalize(MAXDIST*2));
    
    let finalLine = new Path();
    finalLine.strokeColor = 'black';
    for(let i = 0; i<sampleLine.length; i+=15){
        let p = sampleLine.getPointAt(i);
        let n = sampleLine.getNormalAt(i).normalize(dir*-MAXDIST*3);
        let testLine = new Path.Line(p, p.add(n));
        testLine.strokeColor = Color.random();
        
        let inters = testLine.getIntersections(wobbleLine);
        if(inters.length>0){
            finalLine.add(inters[0].point);
        }
        testLine.remove();
    }
    sampleLine.remove();
    wobbleLine.remove();
    finalLine.smooth();

    return finalLine;
    
}

//creates a wobbly line inside a border box
function createWobbleLine(border){
    let startLine = new Path.Line(border.bounds.topLeft, border.bounds.bottomRight);
    startLine.strokeColor = 'black';
    startLine.strokeWidth = 3;
    startLine.rotate(getRandomInt(1,360));
    startLine.scale(4);
    
    let wobbleLine = new Path();
    wobbleLine.add(startLine.firstSegment.point);
    wobbleLine.strokeColor = 'blue';
    for(let i = getNextDist(); i<startLine.length-MINDIST; i+=getNextDist()){
        let p = startLine.getPointAt(i);
        let n = startLine.getNormalAt(i);
        wobbleLine.add(p.add(n.multiply(getNextSide())));
    }
    wobbleLine.add(startLine.lastSegment.point);
    wobbleLine.smooth();
    wobbleLine.simplify();  
    
    startLine.remove();
    return wobbleLine;
}

function getNextDist(){
    return getRandomInt(MINDIST, MAXDIST);
}

function getNextSide(){
    return getRandomInt(-MAXDIST/2, MAXDIST/2);
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
