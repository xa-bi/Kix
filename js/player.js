function Player(game, x, y) {
  this.game    = game;
  this.x       = x;
  this.y       = y;
  this.x_dir   = 0;
  this.y_dir   = 0;  
  this.drawing = false;
  this.keys    = {};

  document.addEventListener('keydown', this.keydown.bind(this));
  document.addEventListener('keyup',   this.keydown.bind(this));
}

Player.prototype.move = function() {
  var must_update_position = false;

  var new_position_pixel = getPixelFromBuffer( this.x + this.x_dir, this.y + this.y_dir, this.game.borders );
  if (this.drawing) {
    if (sameColor(new_position_pixel, this.game.BLOCK_DRAW)) {
      this.game.state = 'DEAD';
    }
    if (sameColor(new_position_pixel, this.game.BLOCK_WALL)) {
      this.drawing = false;
      this.game.fillArea();
    } else {
      must_update_position = true;
    }
  } else {
    if (sameColor(new_position_pixel, this.game.BLOCK_WALL)) {
      must_update_position = true;
    }
    if (sameColor(new_position_pixel, this.game.BLOCK_WHITE) && this.keys[this.game.KEY_SPACE]) {
      this.keys[this.game.KEY_SPACE] = false;
      this.drawing = true;
      must_update_position = true;
    }
  }

  if (must_update_position) {
    this.x += this.x_dir;
    if (this.x < 0) this.x = 0;
    if (this.x >= (this.game.width - 1)) this.x = (this.game.width - 1);
    this.y += this.y_dir;
    if (this.y < 0) this.y = 0;
    if (this.y >= (this.game.height - 1)) this.y = (this.game.height - 1);
  }

  if (this.drawing) {
    putPixelInBuffer( this.x, this.y, this.game.BLOCK_DRAW, this.game.borders );
  }

}

Player.prototype.draw = function() {
  this.game.ctx.fillStyle = 'blue';
  this.game.ctx.beginPath();
  this.game.ctx.moveTo(this.x, this.y - 3);
  this.game.ctx.lineTo(this.x + 3, this.y);
  this.game.ctx.lineTo(this.x, this.y + 3);
  this.game.ctx.lineTo(this.x - 3, this.y);
  this.game.ctx.fill();
}

Player.prototype.keydown = function(e) {
  this.keys[ e.keyCode ] = e.type == 'keydown';
}

Player.prototype.checkKeys = function() {
  if (this.keys[this.game.KEY_UP]    && !(this.drawing && this.y_dir === +1)) { this.y_dir = -1; this.x_dir = 0;  }
  if (this.keys[this.game.KEY_DOWN]  && !(this.drawing && this.y_dir === -1)) { this.y_dir = +1; this.x_dir = 0;  }
  if (this.keys[this.game.KEY_RIGHT] && !(this.drawing && this.x_dir === -1)) { this.y_dir = 0;  this.x_dir = +1; }
  if (this.keys[this.game.KEY_LEFT]  && !(this.drawing && this.x_dir === +1)) { this.y_dir = 0;  this.x_dir = -1; }
}