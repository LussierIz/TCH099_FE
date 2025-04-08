//initialisation de nodes.js
var nodesjs = new NodesJs({
    id: "nodesCanvas",
    width: window.innerWidth,
    height: window.innerHeight,
    number: 120,
    particleSize: 2,
    lineSize: 2,
    particleColor: [20, 20, 20, 1],
    lineColor: "200,210,255", 
    backgroundFrom: [245, 245, 245],
    backgroundTo: [230, 230, 230],
    backgroundDuration: 3000,
    speed: 20,
    pointerCircleRadius: 150,
});

window.addEventListener('resize', function () {
    nodesjs.setWidth(window.innerWidth);
    nodesjs.setHeight(window.innerHeight);
});



