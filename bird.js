class Bird{
    
    constructor(x,y,z,d){
        this.x = x
        this.y = y
        this.z = z
        this.d = d

        this.g = 0.1
        this.v = 10
    }
    show(){
        translate(this.x,this.y,this.z)
        sphere(this.d)
    }
    update(){
        this.v += this.g
        this.y += this.v
        if(this.y === 400 || this.y > 400){
            //this.v = -0.5
          }
    }
    up(){
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

//hex 00E714