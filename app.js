let spheres = [];
let centralSphereRadius = 5000;
let numSpheres = 450;
let minSphereRadius = 14;
let maxSphereRadius = 20;

function createSpheres() {
  for (let i = 0; i < numSpheres; i++) {
    let theta = random(0, TWO_PI);
    let phi = random(0, PI);
    let radius = random(minSphereRadius, maxSphereRadius);

    let x = centralSphereRadius * sin(phi) * cos(theta);
    let y = centralSphereRadius * sin(phi) * sin(theta);
    let z = centralSphereRadius * cos(phi);

    spheres.push(new Sphere(x, y, z, radius));
  }
}

class Sphere {
  constructor(x, y, z, radius) {
    this.position = createVector(x, y, z);
    this.radius = radius;
  }

  display() {
    push();

    noStroke();
    translate(this.position.x, this.position.y, this.position.z);
    sphere(this.radius);
    pop();
  }
}

var cam;
var bird;
var go, b, m;
var gO = false;
var pipes = [];
var walls = {
  z: 1   
};
var r, g, b;

function preload(){
  go = loadSound('gameOver.mp3');
  m = loadSound('m.mp3');
}

function setup(){
  createCanvas(windowWidth - 25, windowHeight - 25, WEBGL);
  cam = createCamera();
  bird = new Bird(0, 0, 400, 10);
  pipes.push(new Pipe());
  walls = loadModel("walls2.obj");
  createSpheres();
  //hex 00E714
  walls.z = 1;
  m.play();
}

function draw() {
  background(20);

  ground();

  lights();

  for (let sphere of spheres) {
    sphere.display();
  }

  if(frameCount % 50 == 0){
    pipes.push(new Pipe());
  }

  for (let i = 0; i < pipes.length; i++) {
    pipes[i].show();
    pipes[i].update();

    // Check collision with bird
    if (collisionDetected(bird, pipes[i])) {
      // Collision detected
      // Add your desired actions here
      // For example, you could stop the game by calling noLoop()
      console.log("hit");
      m.stop();
      gO = true;
      m.pause();
    }

    if (pipes[i].offscreen()) {
      pipes.splice(i, 1);
    }
  }

  bird.show();
  bird.update();

  cam.setPosition(bird.x, bird.y, bird.z + 200);

  if(bird.y == 540 || bird.y > 540){
    gO == true
    m.pause();
    noLoop();
  }

  if(bird.y == -height/3 || bird.y < -height/3){
    gO == true
    m.pause();
    noLoop();
  }

  if(gO == true){
    go.play();
    m.pause();
    noLoop();
  }
}

function keyPressed(){
  if(key == ' '){
    bird.up();
  }
}

function collisionDetected(bird, pipe) {
  // Calculate the boundaries of the pipe with buffer zone
  let pipeTop = pipe.z - pipe.top + pipe.w / 2;
  let pipeBottom = pipe.z + pipe.bottom - pipe.w / 2;

  // Calculate the boundaries of the bird with buffer zone
  let birdTop = bird.y - bird.d / 2;
  let birdBottom = bird.y + bird.d / 2;
  let birdFront = bird.z + bird.d / 2;
  let birdBack = bird.z - bird.d / 2;

  // Check collision with bird's position
  if (
    birdFront > pipeTop &&
    birdBack < pipeBottom &&
    (birdTop < pipe.top || birdBottom > height - pipe.bottom)
  ) {
    return true; // Collision detected
  }

  return false; // No collision
}

class Pipe {
  constructor() {
    this.top = random(height/2 + 5);
    this.bottom = random(height/2 + 5);
    this.z = -100;
    this.w = 30;
    this.speed = 2;
  }

  show() {
    push();
    fill("#00E714");
    translate(0, 0, this.z);
    cylinder(this.w, this.top, this.w);
    pop();
    push();
    fill("#00E714");
    translate(0, height - this.bottom, this.z);
    cylinder(this.w, this.bottom, this.w);
    pop();
  }

  update() {
    this.z += this.speed;
  }

  offscreen() {
    if (this.z > 500) {
      return true;
    }
  }
}

function ground() {
  walls.z = walls.z + 1;
  push();
  fill("#00E714");
  translate(0, 550, 0);
  box(600, 0, 7000);
  pop();

  push();
  fill(r, g, b);
  translate(300, 550, walls.z);
  scale(50);
  model(walls);
  pop();
  push();
  fill(r, g, b);
  translate(-300, 550, walls.z);
  scale(50);
  model(walls);
  pop();

  if (walls.z === 4500 || walls.z > 4500) {
    walls.z = 1;
  }

  if (frameCount % 10 == 0) {
    r = random(255);
    g = random(100, 200);
    b = random(100);
  }
}

class Bird {
  constructor(x, y, z, d) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.d = d;

    this.g = 0.1;
    this.v = 10;
  }

  show() {
    translate(this.x, this.y, this.z);
    sphere(this.d);
  }

  update() {
    this.v += this.g;
    this.y += this.v;
    if (this.y === 400 || this.y > 400) {
      //this.v = -0.5
    }
  }

  up() {
    this.v = -3;
  }

  hits(bird) {
    // Calculate the boundaries of the pipe
    let pipeTop = this.z - this.top;
    let pipeBottom = this.z + this.bottom;

    // Calculate the boundaries of the bird
    let birdTop = bird.y - bird.d / 2;
    let birdBottom = bird.y + bird.d / 2;
    let birdFront = bird.x + bird.d / 2;
    let birdBack = bird.x - bird.d / 2;

    // Check collision with bird's position
    if (
      birdFront > pipeTop &&
      birdBack < pipeBottom &&
      (birdTop < this.top || birdBottom > height - this.bottom)
    ) {
      return true; // Collision detected
    }

    return false; // No collision
  }
}

function windowResized() {
  resizeCanvas(windowWidth - 25, windowHeight - 25);
}
