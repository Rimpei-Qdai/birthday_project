export function createRectUV(x, width, y, height) {
  const uvs = new Float32Array([
    x, y + height,           // bottom-left
    x + width, y + height,   // bottom-right
    x, y,                    // top-left
    x + width, y             // top-right
  ]);
  
  return uvs;
}