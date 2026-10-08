'use strict';

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function generate() {
  const svgPath = path.join(__dirname, 'assets', 'images', 'favicon.svg');
  const svgBuffer = fs.readFileSync(svgPath);

  console.log('==> Generando PNGs con fondo transparente mediante Sharp...');

  // 1. Generar resoluciones
  const p16 = await sharp(svgBuffer).resize(16, 16).png().toBuffer();
  const p32 = await sharp(svgBuffer).resize(32, 32).png().toBuffer();
  const p48 = await sharp(svgBuffer).resize(48, 48).png().toBuffer();
  const p180 = await sharp(svgBuffer).resize(180, 180).png().toBuffer();

  // Guardar PNGs
  fs.writeFileSync(path.join(__dirname, 'assets', 'images', 'favicon-16x16.png'), p16);
  fs.writeFileSync(path.join(__dirname, 'assets', 'images', 'favicon-32x32.png'), p32);
  fs.writeFileSync(path.join(__dirname, 'assets', 'images', 'favicon-48x48.png'), p48);
  fs.writeFileSync(path.join(__dirname, 'assets', 'images', 'apple-touch-icon.png'), p180);
  fs.writeFileSync(path.join(__dirname, 'apple-touch-icon.png'), p180);

  console.log('✓ favicon-16x16.png guardado');
  console.log('✓ favicon-32x32.png guardado');
  console.log('✓ favicon-48x48.png guardado');
  console.log('✓ apple-touch-icon.png (180x180) guardado');

  // 2. Empaquetar multi-resolución favicon.ico (16, 32, 48) con soporte PNG RGBA
  const frames = [
    { width: 16, height: 16, buffer: p16 },
    { width: 32, height: 32, buffer: p32 },
    { width: 48, height: 48, buffer: p48 }
  ];

  const headerLength = 6;
  const dirEntryLength = 16;
  const numIcons = frames.length;
  let currentOffset = headerLength + numIcons * dirEntryLength;

  // Header ICO
  const headerBuf = Buffer.alloc(headerLength);
  headerBuf.writeUInt16LE(0, 0); // reserved
  headerBuf.writeUInt16LE(1, 2); // icon type
  headerBuf.writeUInt16LE(numIcons, 4); // count

  const dirEntries = [];
  for (const frame of frames) {
    const entryBuf = Buffer.alloc(dirEntryLength);
    entryBuf.writeUInt8(frame.width === 256 ? 0 : frame.width, 0);
    entryBuf.writeUInt8(frame.height === 256 ? 0 : frame.height, 1);
    entryBuf.writeUInt8(0, 2); // color count
    entryBuf.writeUInt8(0, 3); // reserved
    entryBuf.writeUInt16LE(1, 4); // color planes
    entryBuf.writeUInt16LE(32, 6); // bits per pixel
    entryBuf.writeUInt32LE(frame.buffer.length, 8); // size
    entryBuf.writeUInt32LE(currentOffset, 12); // offset
    dirEntries.push(entryBuf);
    currentOffset += frame.buffer.length;
  }

  const icoBuffer = Buffer.concat([
    headerBuf,
    ...dirEntries,
    ...frames.map(f => f.buffer)
  ]);

  fs.writeFileSync(path.join(__dirname, 'favicon.ico'), icoBuffer);
  fs.writeFileSync(path.join(__dirname, 'assets', 'images', 'favicon.ico'), icoBuffer);
  console.log('✓ favicon.ico multi-resolución generado correctamente (tamaño:', icoBuffer.length, 'bytes)');
}

generate().catch(err => {
  console.error('[ERROR]', err);
  process.exit(1);
});
