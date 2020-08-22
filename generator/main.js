var template=`<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!-- Created with Inkscape (http://www.inkscape.org/) -->

<svg
   xmlns:dc="http://purl.org/dc/elements/1.1/"
   xmlns:cc="http://creativecommons.org/ns#"
   xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
   xmlns:svg="http://www.w3.org/2000/svg"
   xmlns="http://www.w3.org/2000/svg"
   xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
   xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"
   width="100.0mm"
   height="100.0mm"
   viewBox="0 0 100.0 100.0"
   version="1.1"
   id="svg8"
   inkscape:version="0.92.5 (2060ec1f9f, 2020-04-08)"
   sodipodi:docname="template.svg">
  <defs
     id="defs2" />
  <sodipodi:namedview
     id="base"
     pagecolor="#ffffff"
     bordercolor="#666666"
     borderopacity="1.0"
     inkscape:pageopacity="0.0"
     inkscape:pageshadow="2"
     inkscape:zoom="0.35"
     inkscape:cx="-100"
     inkscape:cy="560"
     inkscape:document-units="mm"
     inkscape:current-layer="g838"
     showgrid="true"
     inkscape:window-width="1920"
     inkscape:window-height="1050"
     inkscape:window-x="0"
     inkscape:window-y="0"
     inkscape:window-maximized="1"
     borderlayer="true">
    <inkscape:grid
       id="grid816"
       units="mm"
       type="xygrid"
       empspacing="1"
       spacingy="2.54"
       spacingx="2.54" />
  </sodipodi:namedview>
  <metadata
     id="metadata5">
    <rdf:RDF>
      <cc:Work
         rdf:about="">
        <dc:format>image/svg+xml</dc:format>
        <dc:type
           rdf:resource="http://purl.org/dc/dcmitype/StillImage" />
        <dc:title></dc:title>
      </cc:Work>
    </rdf:RDF>
  </metadata>
  <g
     id="g822"
     sodipodi:insensitive="true"
     inkscape:groupmode="layer"
     inkscape:label="[fixed] BG">
    <rect
       id="rect820"
       style="stroke:none;fill-opacity:1;fill:#FFFFFF"
       height="100.0"
       width="100.0"
       y="0"
       x="0" />
  </g>
  <g
     id="g826"
     inkscape:groupmode="layer"
     inkscape:label="B.Cu-disabled" />
  <g
     id="g828"
     inkscape:groupmode="layer"
     inkscape:label="B.Adhes-disabled" />
  <g
     id="g830"
     inkscape:groupmode="layer"
     inkscape:label="F.Adhes-disabled" />
  <g
     id="g832"
     inkscape:groupmode="layer"
     inkscape:label="B.Paste-disabled" />
  <g
     id="g834"
     inkscape:groupmode="layer"
     inkscape:label="F.Paste-disabled" />
  <g
     id="g836"
     inkscape:groupmode="layer"
     inkscape:label="B.SilkS" />
  <g
     id="g844"
     inkscape:groupmode="layer"
     inkscape:label="Dwgs.User-disabled" />
  <g
     id="g846"
     inkscape:groupmode="layer"
     inkscape:label="Cmts.User-disabled" />
  <g
     id="g848"
     inkscape:groupmode="layer"
     inkscape:label="Eco1.User-disabled" />
  <g
     id="g850"
     inkscape:groupmode="layer"
     inkscape:label="Eco2.User-disabled" />
  <g
     id="g852"
     inkscape:groupmode="layer"
     inkscape:label="Edge.Cuts" />
  <g
     id="g854"
     inkscape:groupmode="layer"
     inkscape:label="Margin-disabled" />
  <g
     id="g856"
     inkscape:groupmode="layer"
     inkscape:label="B.CrtYd-disabled" />
  <g
     id="g858"
     inkscape:groupmode="layer"
     inkscape:label="F.CrtYd-disabled" />
  <g
     id="g860"
     inkscape:groupmode="layer"
     inkscape:label="B.Fab-disabled" />
  <g
     id="g862"
     inkscape:groupmode="layer"
     inkscape:label="F.Fab-disabled" />
  <g
     id="g864"
     inkscape:groupmode="layer"
     inkscape:label="Drill" />
`;

//scalefactor currently not fitting to the KiCAD Board
//I manually scale it in inkscape to 0.95in width!
var scalefactor = 0.55;
let border;

paper.install(window);
window.onload = function() {
	paper.setup('paperCanvas');
    
    
    let borderheight = 450;
    let planetsize = 35;
    let rec = new Rectangle([0,0], [170,450]);
    let planetdist = (borderheight-6*planetsize) / 4;
    
    border = new Path.Rectangle(rec, 20);
    border.fillColor = 'mediumvioletred';
    border.position = view.bounds.center;

    let lines = createAllLines(border);
    let group = cutLines(lines, border);
	let testLayer = new Layer(group);
	testLayer.name = 'testlayer';
	let layer2 = new Layer();
	layer2.name = 'layer2';
    let types = [0, 1, 2];
    types = shuffle(types);
    
    let cutshape1 = createPlanet(border.position.subtract(new Point(0,planetdist+planetsize*2)), 35, types[0]);
    group = cutout(cutshape1, group);
    
    let cutshape2 = createPlanet(border.position, 35, types[1]);
    group = cutout(cutshape2, group);
    
    let cutshape3 = createPlanet(border.position.add(new Point(0,planetdist+planetsize*2)), 35, types[2]);
    group = cutout(cutshape3, group);
    
    let cutshapes = [cutshape1, cutshape2, cutshape3]
    
    for(let i = 0; i<getRandomInt(3,5); i++){
        let cutstar = createStar(border, cutshapes);
        group = cutout(cutstar, group);
        cutshapes.push(cutstar);
    }
    
    cutshapes.push(createRocket(border, cutshapes));
    
    for(let i = 0; i<getRandomInt(15,25); i++){
        cutshapes.push(createSmallStar(border, cutshapes));
    }
    //border.remove();
    linesF.push(group);

}

//create SVG with layer ordering for usual pcb production
function buildPerfectPurle(){
    let str = template;
    str += buildLayer("F.Cu", [...linesF, ...planetsF]);
    str += buildLayer("F.Mask", [...planetsF, ...starsF]);
    //str += buildLayer("B.Mask", starsF);
    //str += buildLayer("B.Mask", [border]);
    str += buildLayer("F.SilkS", decorationsF);
    str += '</svg>';
    return str;
}

//create SVG layer ordering for after-dark like PCBs
function buildAfterDark(){
    let str = template;
    str += buildLayer("F.Cu", [...starsF, ...planetsF]);
    str += buildLayer("F.Mask", [...planetsF, ...linesF, ...decorationsCutF]);
    str += buildLayer("F.SilkS", decorationsF);
    str += `<g
     id="g840"
     inkscape:groupmode="layer"
     inkscape:label="B.Mask" /></svg>`;
    return str;
}

function buildLayer(layername, components){
    str = `<g id="${layername}" inkscape:groupmode="layer" inkscape:label="${layername}">`;
    for(let i = 0; i<components.length; i++){
        str += components[i].exportSVG({asString: true});
    }
    str += '</g>';
    return str;
}

//let user download canvas content as SVG
function downloadSVG(type){
    paper.view.scale(scalefactor);
    //var svg = project.exportSVG({ asString: true, bounds: 'content' });
    var svg;
    if(type == 0){
        svg = buildPerfectPurle();
    }else{
        svg = buildAfterDark();
    }
    var svgBlob = new Blob([svg], {type:"image/svg+xml;charset=utf-8"});
    var svgUrl = URL.createObjectURL(svgBlob);
    var downloadLink = document.createElement("a");
    downloadLink.href = svgUrl;
    downloadLink.download = "planetpcb.svg";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}

function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}
