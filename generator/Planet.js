//picoplanet
//CC-BY bleeptrack

const LINEBORDER = 5;
const STRKW = 6;

//lets make a planet at a point with a certain radius
//type can be:
//0: sun
//1: continens
//2: stripes
function createPlanet(point, radius, type){
    let planet = new Path.Circle(point, radius);
    planet.strokeWidth = STRKW;
    planet.strokeColor = 'red';
    
    let planetborder = PaperOffset.offsetStroke(planet, STRKW/2);
    
    let cutout = new Path.Circle(point, radius+LINEBORDER*2);
    cutout.fillColor = 'green';
    
    let style;
    if(typeof type !== 'undefined' ){
        style = type;
    }else{
        style = randInt(0,2);
    }
    
    switch(style){
        case 0:
            cutout.remove();
            cutout = sun(planet);
            break;
        case 1:
            let decocut = earth(planet, planetborder);
            let newcut = decocut.unite(cutout);
            decocut.remove();
            cutout.remove();
            cutout = newcut;
            planet.remove();
            break;
        case 2:
            let decocut2 = stripes(planet, planetborder);
            let newcut2 = decocut2.unite(cutout);
            decocut2.remove();
            cutout.remove();
            cutout = newcut2;
            planet.remove();
            break;
    }
    cutout.fillColor = 'blue';
    cutout.opacity = 0.5;
    
    return cutout;
}

//adds decoration to existing planet
function addDeco(planet, planetborder, filling){
    let deco = randInt(0,2);
    if(deco == 0){
        return moons(planet, planetborder, filling);
        
    }else if(deco==1){
        let double = randInt(0,2);
        let cutout = rings(planet);
        if(double == 0){
            let cutout2 = rings(planet);
            let newcut = cutout.unite(cutout2);
            cutout.remove();
            cutout2.remove();
            return newcut;
        }
        return cutout;
    }
    return new Path();
}

//creates continent/earth filling for planet
function earth(planet, planetborder){
    let nrContinents = randInt(2,4);
    let w = planet.bounds.width;
    let h = planet.bounds.height;
    let continents = new Path();
    for(let i = 0; i<nrContinents; i++){
        let continent = new Path.Ellipse(planet.position, new Size(randInt(w/3, w*2/3), randInt(h/3,h*2/3)));
        continent.strokeColor = 'red';
        continent = offsetPoints(randInt(5,10), continent, Math.min(w/4,h/4));
        continent.smooth({type: 'continuous'});
        continent.fillColor = 'red';
        
        let place = Point.random().multiply(new Point(w,h));
        continent.position = planet.bounds.topLeft.add(place);
        rotateScaleVariation(continent);
        
        let cutconti = continent.intersect(planet);
        continent.remove();
        let newContis = continents.unite(cutconti);
        continents.remove();
        cutconti.remove();
        continents = newContis;
    }
    planetsF.push(planet);
    planetsF.push(continents);
    
    return addDeco(planet, planetborder, continents);
}

//creates stripe/line filling for planet
function stripes(planet, planetborder){
    let lines = createAllLines(planet);
    let stripes = cutLines(lines, planet, 0.4);
    stripes.strokeColor = null;
    stripes.fillColor = 'red';
    
    planetsF.push(stripes);
    planetsF.push(planetborder);
    
    //return new Path();
    return addDeco(planet, planetborder, stripes);
}

//creates sun rings for planet
function sun(planet){
    planet.fillColor = 'red';
    
    let startRadius = planet.bounds.width/2 + 2;
    let numRings = randInt(1,3);
    for(let i = 0; i<numRings; i++){
        startRadius += (numRings-i+2)* 1.8;
        let ring = new Path.Circle(planet.position, startRadius);
        ring.strokeColor = 'red';
        ring.strokeWidth = (numRings-i)+1;
        
        planetsF.push(ring);
    }
    
    planetsF.push(planet);
    
    
    return new Path.Circle(planet.position, startRadius+LINEBORDER*2);
    //ToDo sun splots
    //ToDo erruptions?
}

//creates saturn-linke rings for planet
function rings(planet){
    let cutout = new Path();
    let rings = [];
    let w = randInt(planet.bounds.width*1.5, planet.bounds.width*2);
    let nr = randInt(1,3);
    var ringGroup = new Group();
    for(let i = 0; i<nr; i++){
        var ring = new Path.Ellipse([0,0], [ w + i*10, planet.bounds.height/2 + i*6]);
        ring.strokeWidth = 3;
        ring.strokeColor = 'red';
        ring.position = planet.position;
        rings.push(ring);
        if(i>0){
            rings[i].bounds.topCenter = rings[0].bounds.topCenter.add( [0,-i*2] );
        }
        
        //add ring to cutout shape
        let ringcut = PaperOffset.offsetStroke(ring, LINEBORDER*2)
        newcut = cutout.unite(ringcut);
        
        cutout.remove();
        ringcut.remove();
        cutout = newcut;
        cutout.fillColor = Color.random();
    }
    
    for(let i = 0; i<nr; i++){
        var inters = rings[i].getIntersections(planet);
        rings[i].splitAt(inters[0]);
        let rest = rings[i].splitAt(inters[1]);
        rings[i].remove();
        ringGroup.addChild(rest);
    }
    let change = rotateScaleVariation(ringGroup, planet.position);
    //cutout.rotate(change.rotation);
    rotateScaleVariation(cutout, planet.position, change);
    
    planetsF.push(ringGroup);
    
    return cutout;
}

//adds moons to planet
function moons(planet, planetborder, filling){
    let nrMoons = randInt(1,3);
    let cutpath = new Path();
    for(let i = 0; i<nrMoons; i++){
        let moon = new Path.Circle(planet.position, randInt(planet.bounds.width/5, planet.bounds.width/10));
        moon.strokeColor = 'red';
        moon.strokeWidth = 3;
        
        //thats a hacky solution but perfectly fine for svg2shenzen: the moon shape is not cut out
        //from the filling. instead the moon just gets a light fill color that svg2shenzen will ignore.
        moon.fillColor = 'white';
        moon.position =  planet.bounds.topLeft.add( Point.random().multiply(new Point(planet.bounds.width, planet.bounds.height) ));
        let behind = randInt(0,1);
        if(planet.intersects(moon)){
            if(behind==1){
                let tmp = moon.subtract(planet);
                moon.remove();
                moon = tmp;
            }else{
                let tmp = planetborder.subtract(moon);
                planetborder.remove();
                planetborder = tmp;
            }
        }
        
        let fillingtmp = filling.subtract(moon);
        filling.remove();
        filling = fillingtmp;
        
        let newcut = PaperOffset.offset(moon.clone(), LINEBORDER*2);
        let cuttmp = cutpath.unite(newcut);
        cuttmp.opacity=0.5;
        cutpath.remove();
        newcut.remove();
        cutpath = cuttmp;
        
        planetsF.push(moon);
    }
    planet.remove();
    
    return cutpath;
}

//Helping Functions
function getPointInCircle(){}

function clamp(value, min, max){
    if(value < min){
        return min;
    }else if(value > max){
        return max;
    }
    return value;
}

function rotateScaleVariation(group, rotpoint, options){
    let rot = randInt(0,360);
    let sc = randInt(0,1);
    if(options){
        rot = options.rotation;
        sc = options.scale;
    }
    if(sc == 0){
        group.scale(-1,1);
    }
    
    if(rotpoint){
        group.rotate(rot, rotpoint);
    }else{
        group.rotate(rot);
    }
    return {rotation: rot, scale: sc};
}

function offsetPoints(nrPoints, path, maxOffs){
    let dist = path.length/nrPoints;
    let newPath = new Path({closed: true});
    for(let i = 0; i<path.length-1; i+=dist){
        let n = path.getNormalAt(i);
        let p = path.getPointAt(i);
        newPath.add(p.add(n.multiply(randInt(-maxOffs/2,maxOffs))));
    }
    path.remove();
    return newPath;
}

//min and max are included
function randInt(min, max){
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
