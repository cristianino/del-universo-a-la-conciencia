attribute vec2 a_posicion;

void main() {
  gl_Position = vec4(a_posicion, 0.0, 1.0);
}
