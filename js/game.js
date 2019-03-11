function Game(canvas, width, height, num_enemies) {
  this.canvas      = canvas;
  this.ctx         = canvas.getContext('2d');
  this.width       = width;
  this.height      = height;
  this.borders     = null;
  this.state       = 'PLAYING';
  this.KEY_SPACE   = 32;
  this.KEY_LEFT    = 37;
  this.KEY_UP      = 38;
  this.KEY_RIGHT   = 39;
  this.KEY_DOWN    = 40;
  this.BLOCK_WALL  = [0, 0, 0];
  this.BLOCK_WHITE = [255, 255, 255];
  this.BLOCK_ENEMY = [255, 0, 0];
  this.BLOCK_DRAW  = [0, 255, 0];
  this.BLOCK_BLUE  = [0, 0, 155];
  this.BLOCK_FILL  = [100, 100, 100];
  this.filled      = 0;
  this.to_fill     = 0;

  // establecemos el tamaño
  canvas.width  = width;
  canvas.height = height;
  this.to_fill  = (width * height) - (width * 2) - (height * 2) + 4;

  this.enemies = [];
  this.num_enemies = num_enemies;
  for(i=0; i<this.num_enemies; i++) {
    var enemy_x = Math.floor(Math.random() * (this.width - 10))  + 5 ;
    var enemy_y = Math.floor(Math.random() * (this.height - 10)) + 5 ;
    var enemy   = new Enemy(this, enemy_x, enemy_y);
    this.enemies.push( enemy );
  }

  var player_x = Math.floor(this.width / 2);
  var player_y = canvas.height - 1;
  this.player = new Player(this, player_x, player_y);

  this.initboard();
}

Game.prototype.initboard = function() {
  // Limpiamos
  this.ctx.fillStyle = 'black';
  this.ctx.fillRect(0, 0, this.width, this.height);

  this.ctx.fillStyle = 'white';
  this.ctx.fillRect(1, 1, this.width-2, this.height-2);

  this.borders = this.ctx.getImageData(0, 0, this.width, this.height);
}

Game.prototype.flood_fill = function(x, y) {
  var stack = [{x:x, y:y}];
  while (stack.length > 0) {
    var pixel = stack.pop();
    putPixelInBuffer(pixel.x, pixel.y, this.game.BLOCK_WALL, this.borders);
    if (sameColor(getPixelFromBuffer(x, y - 1 , this.borders), this.BLOCK_WHITE)) stack.push({x:x,y:y-1});
    if (sameColor(getPixelFromBuffer(x, y + 1 , this.borders), this.BLOCK_WHITE)) stack.push({x:x,y:y+1});
    if (sameColor(getPixelFromBuffer(x - 1, y , this.borders), this.BLOCK_WHITE)) stack.push({x:x-1,y:y});
    if (sameColor(getPixelFromBuffer(x + 1, y , this.borders), this.BLOCK_WHITE)) stack.push({x:x+1,y:y});
  }
}

Game.prototype.fillArea = function() {
  this.state = 'FILLING';
  for(i=0; i<this.num_enemies; i++) {
    var enemy = this.enemies[i];
    var stack = [{x:enemy.x, y:enemy.y}];
    while (stack.length > 0) {
      var pixel = stack.pop();
      putPixelInBuffer(pixel.x, pixel.y, this.BLOCK_FILL, this.borders);
      if (sameColor(getPixelFromBuffer(pixel.x, pixel.y - 1 , this.borders), this.BLOCK_WHITE)) stack.push({x:pixel.x,  y:pixel.y-1});
      if (sameColor(getPixelFromBuffer(pixel.x, pixel.y + 1 , this.borders), this.BLOCK_WHITE)) stack.push({x:pixel.x,  y:pixel.y+1});
      if (sameColor(getPixelFromBuffer(pixel.x - 1, pixel.y , this.borders), this.BLOCK_WHITE)) stack.push({x:pixel.x-1,y:pixel.y});
      if (sameColor(getPixelFromBuffer(pixel.x + 1, pixel.y , this.borders), this.BLOCK_WHITE)) stack.push({x:pixel.x+1,y:pixel.y});
    }
  }
  for (var x=0; x<this.width; x++) {
    for (var y=0; y<this.height; y++) {
      var pixel = getPixelFromBuffer(x, y, this.borders);
      if (sameColor(pixel, this.BLOCK_FILL)) {
        putPixelInBuffer(x, y, this.BLOCK_WHITE, this.borders);
      } else if (sameColor(pixel, this.BLOCK_DRAW) || sameColor(pixel, this.BLOCK_WHITE)) {
        putPixelInBuffer(x, y, this.BLOCK_WALL, this.borders);
        this.filled++;
      }
    }
  }
  this.ctx.putImageData(this.borders, 0, 0);
  this.state = 'PLAYING';
}

Game.prototype.render = function() {
  // Draw texts
  var percent = (this.filled / this.to_fill) * 100;
  this.ctx.putImageData(this.borders, 0, 0);
  this.ctx.font='20px verdana';
  this.ctx.fillStyle = 'black';
  this.ctx.strokeStyle = 'red';
  this.ctx.lineWidth = 1;

  // Draw background
  this.ctx.strokeText(percent.toFixed(2) + '%', 15, 20);

  // Draw enemies
  for(i=0; i<this.num_enemies; i++) {
    var enemy = this.enemies[i];
    enemy.draw();
  } 

  // Draw player
  this.player.draw();
}

Game.prototype.update = function() {
  this.player.checkKeys();
  this.player.move();
  for(i=0; i<this.num_enemies; i++) {
    var enemy = this.enemies[i];
    enemy.move();
  }
  if (this.state !== 'DEAD') window.setTimeout(() => { this.update(); }, 10);
}

Game.prototype.frame = function() {
  if (this.state == 'PLAYING') {
    //this.update();
    this.render();
  }
  if (this.state == 'DEAD') {
    alert("Se acabó");
  } else {
    requestAnimationFrame(this.frame.bind(this));
  }
}

Game.prototype.start = function() {
  this.frame();
  this.update();
}