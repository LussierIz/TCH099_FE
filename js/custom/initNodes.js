//initialisation de nodes.js
//jiayi xu
var nodesjs = new NodesJs({
    id: "nodesCanvas",
    width: window.innerWidth,
    height: window.innerHeight,
    number: 100,
    particleSize: 2,
    lineSize: 1,
    particleColor: [255, 255, 255, 0.3],
    lineColor: "255,255,255",
    backgroundFrom: [10, 25, 100],
    backgroundTo: [25, 50, 150],
    backgroundDuration: 5000,
    speed: 20,
    pointerCircleRadius: 150,
});

window.addEventListener('resize', function () {
    nodesjs.setWidth(window.innerWidth);
    nodesjs.setHeight(window.innerHeight);
});



