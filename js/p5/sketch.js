var easycam;
var word;
var angle = 0;
var x, y;
var rigid;
var angVel;
var forthHeight;
var txtFont;
var txtStd;
var rangeMouseX;
var angVelInDeg;
var frameR;
var speed = document.getElementById("speedSelector");
var autoAnimBtn = document.getElementById('autoAnimBtn');
var showText = document.getElementById('infoSelector');
var fpsCount = document.getElementById('fpsCount');

function preload() {
  txtFont = loadFont("./fonts/SourceSansPro-Regular.otf");
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  setAttributes('antialias', false);
  pixelDensity(pixelDensity() * 0.75);

  forthHeight = height / 4;
  rigid = height * 0.75;
  txtStd = height / 18;

  easycam = createEasyCam();
  easycam = new Dw.EasyCam(this._renderer, {
    distance: height * 1.3,
    center: [0, 0, -forthHeight],
    rotation: [0.793, 0.518, 0.200, -0.247]
  });

  textFont(txtFont);
  textSize(txtStd * 0.9);
  textAlign(CENTER, CENTER);
  noStroke();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  easycam.setViewport([0, 0, windowWidth, windowHeight]);
}

function draw() {
  translate(0, 0, -rigid / 2);
  background(0);

  // ambientLight(255, 255, 255);

  ambientLight(128, 128, 128);
  pointLight(155, 155, 155, 0, 0, height);

  specularMaterial(155, 155, 155);

  // Calculations

  if (angle >= TWO_PI) {
    angle = 0;
  }

  if (showText.value == "show") {
    timeP = (TWO_PI / angVel).toFixed(1);
    if (timeP == "Infinity") {
      timeP == "Infinity";
    } else if (timeP == 1) {
      timeP += " second";
    } else {
      timeP += " seconds";
    }
    angVelInDeg = (map(angVel, 0, TWO_PI, 0, 360)).toFixed(0) + "°";
  }
  angleInDeg = (map(angle, 0, TWO_PI, 0, 360)).toFixed(0) + "°";

  if (frameCount % 10 == 0) {
    fpsCount.innerHTML = "FPS: " + frameRate().toFixed(2);
  }

  if (autoAnimBtn.classList.contains('false')) {
    angVel = 0;
  } else {
    angVel = PI * parseFloat(speed.value);
    angle += angVel / frameRate();
  }

  x = cos(angle) * forthHeight;
  y = -sin(angle) * forthHeight;
  textX = cos(angle - .5) * forthHeight / 2.5;
  textY = -sin(angle - .5) * forthHeight / 2.5;

  // Base
  push();
  translate(0, 0, -txtStd * 2);
  specularMaterial(80, 80, 80);
  box(height * 2, height * 1.25, txtStd / 4);
  pop();

  // Rigid
  push();
  specularMaterial(0, 0, 155);
  translate(0, 0, rigid);
  box(txtStd);
  pop();

  // Mean Position
  sphere(txtStd / 10);

  // Circular path
  torus(forthHeight, txtStd / 9, 50, 10);

  // Angular Bob
  push();
  specularMaterial(0, 155, 0);
  translate(x, y);
  sphere(txtStd / 4);
  pop();

  // Static Angle line
  push();
  translate(forthHeight / 2, 0);
  rotate(HALF_PI);
  cylinder(txtStd / 10, forthHeight);
  pop();

  // Bob path
  push();
  specularMaterial(25, 25, 25, 55);
  cylinder(txtStd / 10, height / 2);
  pop();

  // Dynamic Angle line
  push();
  translate(x / 2, y / 2);
  rotate(-angle + HALF_PI);
  cylinder(txtStd / 10, forthHeight);
  pop();

  // String of the pendulum
  push();
  stringAng1 = createVector(rigid, 0);
  stringAng2 = createVector(0, y);
  translate(0, y / 2, rigid / 2);
  rotateX(-atan(rigid / y));
  specularMaterial(161, 60, 155);
  cylinder(txtStd / 6, stringAng1.dist(stringAng2));
  pop();

  // Real Bob
  push();
  specularMaterial(155, 0, 0);
  translate(0, y);
  sphere(txtStd / 2);
  pop();

  // Horizontal imaginary line
  push();
  translate(x / 2, y);
  specularMaterial(155, 60, 0, 155);
  rotate(HALF_PI);
  cylinder(txtStd / 10, x);
  pop();

  // Displacement indecator
  push();
  translate(height / 3, y / 2);
  textSize(txtStd * .7);
  fill(255);
  plane(txtStd / 10, y);
  text("y", 30, 0);
  pop();

  ambientMaterial(255);
  translate(0, 0, -txtStd * 1.75);

  push();
  translate(textX, textY, txtStd * 3);
  textAlign(LEFT);
  text("θ = " + angleInDeg, 0, 0);
  pop();

  push();
  translate(0, -height / 2.25);
  text("Simple Harmonic Motion", 0, 0);
  text("Coded by: Ranjan Sharma", 0, txtStd);
  pop();

  push();
  translate(height - txtStd * 2, height / 2 + txtStd);
  text("V1.0.2", 0, 0);
  pop();

  if (showText.value == "show") {
    // Extra info
    push();
    translate(0, forthHeight * 1.35);
    text("Swipe around to adjust the view", 0, 0);
    text("Double tap to reset the view", 0, txtStd);
    text("Right click and drag to zoom", 0, txtStd * 2);
    pop();

    push();
    textSize(txtStd * .7);
    textAlign(LEFT);
    translate(-height * 0.9, -forthHeight);
    text("Amplitude = a", 0, 0);
    text("Displacement = y", 0, txtStd);
    text("Angular Velocity (ω) = " + angVelInDeg + "/s", 0, txtStd * 2);
    text("Time Period (T) = " + timeP, 0, txtStd * 3);

    text("      y = a . sin(θ)", 0, txtStd * 5);
    text("      ω = θ/t", 0, txtStd * 6);
    text("So, y = a . sin(ωt)", 0, txtStd * 7);
    pop();
  }
}