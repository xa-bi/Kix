function Enemy(game, x, y) {
  this.game  = game;
  this.x     = x;
  this.y     = y;
  this.x_dir = Math.floor(Math.random() * 2) ? -1 : 1;
  this.y_dir = Math.floor(Math.random() * 2) ? -1 : 1;
}

Enemy.prototype.move = function() {
  // Cogemos el pixel de la nueva posición
  var new_position_pixel = getPixelFromBuffer( this.x + this.x_dir, this.y + this.y_dir, this.game.borders);

  var new_position_pixel_x = getPixelFromBuffer( this.x + this.x_dir, this.y, this.game.borders ); // Nueva posición en X
  var new_position_pixel_y = getPixelFromBuffer( this.x, this.y + this.y_dir, this.game.borders); // Nueva posición en Y
  if (!sameColor(new_position_pixel_x, this.game.BLOCK_WHITE)) this.x_dir *= -1; // Hay que cambiar de dirección X?
  if (!sameColor(new_position_pixel_y, this.game.BLOCK_WHITE)) this.y_dir *= -1; // Hay que cambiar de dirección Y?

  if (sameColor(new_position_pixel, this.game.BLOCK_DRAW)) this.game.state = 'DEAD';

  // Movemos
  this.x += this.x_dir;
  this.y += this.y_dir;
}

Enemy.prototype.draw = function() {
  this.game.ctx.fillStyle = 'red';
  this.game.ctx.beginPath();
  this.game.ctx.arc(this.x, this.y, 2, 0, Math.PI * 4, 0);
  this.game.ctx.fill();
}