const canvas=document.getElementById("gameCanvas")
console.log(canvas,'canvas')
window.focus()
console.log('are we here?')



canvas.width=800;
canvas.height=600;
let isRunning=false;
document.getElementById("game-wrapper").style.display = 'flex'
const ctx = canvas.getContext("2d");
document.getElementById("button").addEventListener("click",(e)=>{
    e.target.style.display = 'none'
    console.log(e, 'event')
mainAnimaition();
})
const world={
    ground:200,
    gravity:0.2
}
function drawGround(x, y, count = 1) {

    drawRect(x, y, 32 * count, canvas.height - y, "#684027");
    drawRect(x, y, 32 * count, 10, "green");
    //   level.addLevel(shapes.rect(0, 0, 100, 100, "red"), shapes.triangle("blue")
  }
  function drawRect(x, y, width, height, color) {
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.rect(x, y, width, height);
    ctx.fill();
    ctx.closePath();
  }
function mainAnimaition (time){
    ctx.clearRect(0, 0, canvas.width,canvas.height)
    drawGround(0, world.ground, 80)
    requestAnimationFrame(mainAnimaition);
    
}



