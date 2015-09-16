import processing.video.*;
//PMovie myMovie;
//PVideo myMovie;
Movie myMovie;
PShader shader;

void setup() {
  //size(640, 360, P2D);
  size(500, 500, P2D);
  noStroke();

  myMovie = new Movie(this, "bo_trimmed2.mov");
  myMovie.loop();
  //size(720, 1280, P2D);
  //fullScreen();
  shader = loadShader("shader.frag");
}

void draw() {
  //tint(255, 20);
  

  shader.set("u_resolution", float(width), float(height));
  //shader.set("u_mouse", float(mouseX), float(mouseY));
  //shader.set("u_time", millis() / 1000.0);
  
  //rect(0,0,width,height);
  

  
  pushMatrix();
  rotate (HALF_PI);
  image(myMovie, -50, -width - 150);
  popMatrix();
  
  
  
}


// Called every time a new frame is available to read
void movieEvent(Movie m) {
 m.read();
}