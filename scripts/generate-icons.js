import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

function createPNG(width, height, r, g, b, accentR, accentG, accentB) {
  // Create raw RGBA image data with scanlines
  const rowBytes = width * 4 + 1; // +1 for filter byte (0)
  const rawData = Buffer.alloc(rowBytes * height);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowBytes;
    rawData[rowOffset] = 0; // Filter type: None

    for (let x = 0; x < width; x++) {
      const pixelOffset = rowOffset + 1 + x * 4;
      
      // Calculate distance to center
      const cx = width / 2;
      const cy = height / 2;
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const maxR = width * 0.42;

      // Draw background rounded box / circle
      const isInner = dist < maxR;
      const isCore = dist < maxR * 0.45;
      const isBorder = dist >= maxR - 6 && dist <= maxR;

      if (isCore) {
        rawData[pixelOffset] = accentR;
        rawData[pixelOffset + 1] = accentG;
        rawData[pixelOffset + 2] = accentB;
        rawData[pixelOffset + 3] = 255;
      } else if (isBorder) {
        rawData[pixelOffset] = 56;
        rawData[pixelOffset + 1] = 189;
        rawData[pixelOffset + 2] = 248; // Sky blue
        rawData[pixelOffset + 3] = 255;
      } else if (isInner) {
        rawData[pixelOffset] = 15;
        rawData[pixelOffset + 1] = 23;
        rawData[pixelOffset + 2] = 42; // Slate 900
        rawData[pixelOffset + 3] = 255;
      } else {
        rawData[pixelOffset] = r;
        rawData[pixelOffset + 1] = g;
        rawData[pixelOffset + 2] = b;
        rawData[pixelOffset + 3] = 255;
      }
    }
  }

  // Compress with deflate
  const compressed = zlib.deflateSync(rawData);

  // PNG Header
  const signature = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);

  // IHDR chunk
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // bit depth
  ihdrData[9] = 6; // color type: RGBA
  ihdrData[10] = 0; // compression
  ihdrData[11] = 0; // filter
  ihdrData[12] = 0; // interlace

  const ihdrChunk = createChunk('IHDR', ihdrData);
  const idatChunk = createChunk('IDAT', compressed);
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function createChunk(type, data) {
  const typeBuf = Buffer.from(type, 'ascii');
  const len = data.length;
  const chunk = Buffer.alloc(12 + len);
  
  chunk.writeUInt32BE(len, 0);
  typeBuf.copy(chunk, 4);
  data.copy(chunk, 8);

  const crc = crc32(Buffer.concat([typeBuf, data]));
  chunk.writeUInt32BE(crc, 8 + len);

  return chunk;
}

// Standard CRC32 table
const crcTable = [];
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    if (c & 1) c = 0xedb88320 ^ (c >>> 1);
    else c = c >>> 1;
  }
  crcTable[n] = c;
}

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

// Generate PWA icons into public/
const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// 192x192
const pwa192 = createPNG(192, 192, 14, 165, 233, 245, 158, 11);
fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), pwa192);

// 512x512
const pwa512 = createPNG(512, 512, 15, 23, 42, 245, 158, 11);
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), pwa512);

// 512x512 maskable (has 15% safe padding)
const pwaMaskable = createPNG(512, 512, 15, 23, 42, 245, 158, 11);
fs.writeFileSync(path.join(publicDir, 'pwa-maskable-512x512.png'), pwaMaskable);

// apple-touch-icon 180x180
const appleTouch = createPNG(180, 180, 2, 132, 199, 245, 158, 11);
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), appleTouch);

// favicon.ico
fs.writeFileSync(path.join(publicDir, 'favicon.ico'), appleTouch);

console.log('Successfully generated all PWA PNG icons in /public!');
