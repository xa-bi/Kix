function getPixelFromBuffer (x, y, buffer) {
  var pos = y * (buffer.width * 4) + x * 4;
  var value = [ buffer.data[pos],
                buffer.data[pos + 1],
                buffer.data[pos + 2] ];
  return value;
}

function putPixelInBuffer (x, y, color, buffer) {
  var pos = y * (buffer.width * 4) + x * 4;
  buffer.data[pos + 0] = color[0];
  buffer.data[pos + 1] = color[1];
  buffer.data[pos + 2] = color[2];
}

function sameColor( color1, color2 ) {
  return color1.length === color2.length &&
          color1.every(function(value, index) { return value === color2[index] })
}