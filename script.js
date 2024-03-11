const canvas = document.getElementById('heartCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particles = [];
const colors = ['#ff6b6b', '#ffe66d', '#4ecdc4'];

function heartShape(t, scale) {
    return {
        x: scale * (16 * Math.pow(Math.sin(t), 3)),
        y: scale * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t))
    };
}

const scale = Math.min((canvas.width - 100) / 32, (canvas.height * 0.65) / 26);
const maxHearts = Math.floor(scale * 5);
const heartSize = scale / 3;

for (let i = 0, hearts = 0; hearts < maxHearts; i += Math.PI*Math.random(), hearts++) {
    const position = heartShape(i, scale);
    // random maxT between 0.01 and 0.005 and can be negative
    const maxT = (Math.random() * 0.008 + 0.00005) * (Math.random() > 0.5 ? 1 : -1)
    particles.push({
        //inital position
        t: i,
        speedT: 0,
        maxT: maxT,
        scale: scale,
        x: position.x + canvas.width / 2,
        y: -position.y + canvas.height / 2,
        size: Math.random() * heartSize + 5,
        speedX: 0,
        speedY: 0,
        color: colors[Math.floor(Math.random() * colors.length)]
    });
}

function drawParticles() {
    particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
    });
}

function updateParticles() {
    particles.forEach(p => {
        p.t += p.speedT;
        const position = heartShape(p.t, p.scale);
        p.x = position.x + canvas.width / 2;
        p.y = -position.y + canvas.height / 2;
    });
    console.log(particles[0].x, particles[0].y, particles[0].speedT);
}

let animationID;
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#ffcfcf";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawParticles();
    animationID = requestAnimationFrame(animate);
    // console.log(particles[0].x, particles[0].y);
}

let heartAnimateID;

function heartAnimate() {
    updateParticles();
    heartAnimateID = requestAnimationFrame(heartAnimate);
}

let speedupID;
function speedUp(){
    particles.forEach(p => {
        if (p.maxT > 0){
            p.speedT = Math.min(p.maxT, p.speedT + (p.maxT - p.speedT) / 150);
        } else {
            p.speedT = Math.max(p.maxT, p.speedT + (p.maxT - p.speedT) / 150);
        }
    });
    speedupID = requestAnimationFrame(speedUp);
}

let slowDownID;

function slowDown(){
    particles.forEach(p => {
        p.speedT *= 0.99;
    });
    slowDownID = requestAnimationFrame(slowDown);
}

function explode(){
    particles.forEach(p => {
        p.x += p.speedX;
        p.y += p.speedY;
    });
    console.log(particles[0].x, particles[0].y);
    requestAnimationFrame(explode);
}

function monthDifference(date1, date2) {
    let months;
    months = (date2.getFullYear() - date1.getFullYear()) * 12;
    months -= date1.getMonth();
    months += date2.getMonth();
    return months <= 0 ? 0 : months;
}

function updateMonthCount() {
    const startDate = new Date("03/12/2019");
    const currentDate = new Date();
    let monthCount = 0;

    if (currentDate.getDate() >= startDate.getDate()) {
        monthCount = monthDifference(startDate, currentDate);
    } else {
        const prevMonthDate = new Date(currentDate);
        prevMonthDate.setMonth(prevMonthDate.getMonth() - 1);
        monthCount = monthDifference(startDate, prevMonthDate);
    }

    document.getElementById('month').innerHTML = `${monthCount}`;
}

updateMonthCount();

animate();
heartAnimate();

setTimeout(() => {
    particles.forEach(p => {    
        p.speedT = p.maxT/50;
    });
    speedUp();
}, 500);

setTimeout(() => { 
    cancelAnimationFrame(speedupID);
}, 2000);

setTimeout(() => {
    slowDown();
}, 6000);


function heartShapeDerivative(t, scale) {
    return {
        x: scale * (48 * Math.pow(Math.sin(t), 2) * Math.cos(t)),
        y: scale * (-13 * Math.sin(t) + 10 * Math.sin(2 * t) + 6 * Math.sin(3 * t) + 4 * Math.sin(4 * t))
    };
}

setTimeout(() => {
    cancelAnimationFrame(heartAnimateID);
    cancelAnimationFrame(slowDownID);
    particles.forEach(p => {
        p.speedX = (Math.random() - 0.5) * 10;
        p.speedY = (Math.random() - 0.5) * 10;
    });
    explode();
    document.getElementById('sentence').style.bottom = '50%';
    document.getElementById('sentence').style.opacity = '1';
    document.getElementById('sentence').style.fontSize = '24px';
}, 8000);