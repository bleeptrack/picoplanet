//creates the shine-through star
function createStar(border, nogoarr){
    let star = new Path();
    star.add(new Segment([-5,0], [4,0], [4,0]));
    star.add(new Segment([0,5], [0,-4], [0,-4]));
    star.add(new Segment([5,0], [-4,0], [-4,0]));
    star.add(new Segment([0,-5], [0,4], [0,4]));
    star.fillColor = 'khaki';
    star.closed = true;
    star.strokeWidth = 3;
    star.strokeJoin = 'round';
    star.strokeColor = 'khaki';

    star.scale(getRandomInt(2,5),getRandomInt(2,5));
    
    star.position = border.bounds.topLeft.add( Point.random().multiply(border.bounds.size) );
    while(!checkPosition(star, border, nogoarr)){
        star.position = border.bounds.topLeft.add( Point.random().multiply(border.bounds.size) );
    }
    starsF.push(star);
    
    let cutshape = new Path();
    for(let i = 0; i<star.length; i++){
        let p = star.getPointAt(i);
        let n = star.getNormalAt(i);
        cutshape.add(p.add(n.multiply(LINEBORDER*2)));
    }
    
    return createStarCutshape(star.clone());
}

//creates small stars and circles for print
function createSmallStar(border, nogoarr){
    let shape = getRandomInt(0,1);
    let star;
    if(shape==0){
        let size = Math.random()*5 + 3;
        star = new CompoundPath();
        star.addChild(new Path.Line([-size,0], [size,0]));
        star.addChild(new Path.Line([0,-size], [0,size]));
        star.strokeCap = 'round';
    }else{
        let size = Math.random()*5 + 3;
        star = new Path.Circle(border.position, size);
    }
    star.strokeWidth = 3;
    star.strokeColor = 'black';
    star.position = border.position;
    
    star.position = border.bounds.topLeft.add( Point.random().multiply(border.bounds.size) );
    while(!checkPosition(star, border, nogoarr)){
        star.position = border.bounds.topLeft.add( Point.random().multiply(border.bounds.size) );
    }
    decorationsF.push(star);
    let cl = star.clone();
    //cl.strokeColor = 'white';
    cl.strokeWidth = cl.strokeWidth*2;
    //cl.moveToBack();
    decorationsCutF.push(cl);
    return star;
}

//creates slightly larger area for star to remove copper around it
function createStarCutshape(star){
    let shapes = [star];
    for(let i = 0; i<4; i++){
        let cutline1 = new Path({segments: [star.segments[i], star.segments[(i+1)%4]]});
        cutline1.lastSegment.handleOut = null;
        let outer = PaperOffset.offsetStroke(cutline1, LINEBORDER, {cap: 'round'});
        shapes.push(outer);
    }
    
    let cutpath = new Path();
    shapes.forEach(function(shape){
        let tmp = cutpath.unite(shape);
        cutpath.remove();
        shape.remove();
        cutpath = tmp;
    });
    
    cutpath.fillColor = 'green';
    return cutpath;
}

//creates a rocket shape
function createRocket(border, nogoarr){
    let rocketbody = new Path({fillColor: 'orange', closed: true});
    let handle = new Point(getRandomInt(12,30), 0);
    handle = handle.rotate(getRandomInt(10,45));
    let handle2 = handle.rotate( (90-handle.angle)*2 );
    rocketbody.add([-6,0]);
    rocketbody.add(new Segment([0,-55], handle2, handle));
    rocketbody.add([6, 0]);
    rocketbody.position = border.position;
    
    let wingcurve = getRandomInt(0,20);
    let wings = new Path({fillColor: 'orange', closed: true});
    wings.add([-16,0]);
    wings.add(new Segment([0,-rocketbody.bounds.height/2], [-wingcurve,0], [wingcurve,0]));
    wings.add([16, 0]);
    wings.bounds.bottomCenter = rocketbody.bounds.bottomCenter.subtract([0,5]);
    
    let eye = new Path.Circle(rocketbody.bounds.topCenter.add([0,rocketbody.bounds.height/3]), rocketbody.bounds.width/4);
    eye.fillColor = 'black';
    
    let tmp = rocketbody.unite(wings);
    let rocket = tmp.subtract(eye);
    rocketbody.remove();
    wings.remove();
    eye.remove();
    tmp.remove();
    rocket.fillColor = 'black';
    rocket.rotate(getRandomInt(1,360));
    
    rocket.position = border.bounds.topLeft.add( Point.random().multiply(border.bounds.size) );
    while(!checkPosition(rocket, border, nogoarr)){
        rocket.rotate(getRandomInt(1,360));
        rocket.position = border.bounds.topLeft.add( Point.random().multiply(border.bounds.size) );
    }
    
    decorationsF.push(rocket);
    let cl = rocket.clone();
    cl.strokeWidth = 6;
    decorationsCutF.push(cl);
    return rocket;
    
}


//check for invalid intersections
function checkPosition(path, border, nogoarr){
    let testborder = border.clone();
    testborder.scale(0.95);
    if(path.intersects(testborder) || path.intersects(border)){
        testborder.remove();
        return false;
    }
    testborder.remove();
    
    for(let i = 0; i<nogoarr.length; i++){
       if(nogoarr[i].intersects(path) || nogoarr[i].contains(path.position)){
           return false;
       }
    }
    return true;
}
