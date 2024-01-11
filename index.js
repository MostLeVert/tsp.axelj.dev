const c = document.getElementById("myCanvas");
var cssScaleX = c.width / c.offsetWidth;  
var cssScaleY = c.height / c.offsetHeight;
var ctx = c.getContext("2d");

const shouldQuitElement = document.getElementById("point-entry-mode-toggle");
const statusElement = document.getElementById("status");
const clearElement = document.getElementById("clear");

const RECT_SIZE = 30;
const RECT_OFFSET = (RECT_SIZE / 2);
ctx.lineWidth = 10;

var points = [];

function clearCanvas() {
    points = [];
    ctx.clearRect(0, 0, c.width, c.height);
}
function refreshCanvas() {
    ctx.clearRect(0, 0, c.width, c.height);
    points.forEach((point) => {
        ctx.fillStyle = "black";
        ctx.fillRect(point[0] - RECT_OFFSET, point[1] - RECT_OFFSET, RECT_SIZE, RECT_SIZE);
    })
}

clearElement.addEventListener("click", clearCanvas);

c.addEventListener("click", (e) => {
    var x = e.clientX * cssScaleX;
    var y = e.clientY * cssScaleY;
    ctx.fillStyle = "black";
    ctx.fillRect(x - RECT_OFFSET, y - RECT_OFFSET, RECT_SIZE, RECT_SIZE);
    points.push([x, y]);
    const entry = getRandPoint();
    refreshCanvas();
    solve(entry, points);
})

function getRandPoint() {
    const index = Math.floor(Math.random() * points.length);
    return points[index];
}

function solve(currentPoint, pointsCpy) {
    if (pointsCpy.length === 0) {
        return;
    }
    var distance = Infinity;
    var bestPoint = null;

    pointsCpy.forEach((point) => {
        const distanceNew = Math.sqrt(Math.pow(currentPoint[0] - point[0], 2) + Math.pow(currentPoint[1] - point[1], 2));
        if ((distanceNew < distance) && !(point[0] === currentPoint[0] && point[1] === currentPoint[1])) {
            distance = distanceNew;
            bestPoint = { coords: point, distance: distance };
        }
    })

    ctx.beginPath();
    ctx.moveTo(currentPoint[0], currentPoint[1]);
    ctx.lineTo(bestPoint.coords[0], bestPoint.coords[1]);
    ctx.stroke();
    ctx.closePath();

    pointsCpy = pointsCpy.filter(point => !(point[0] === bestPoint.coords[0] && point[1] === bestPoint.coords[1]));
    solve(bestPoint.coords, pointsCpy);
}