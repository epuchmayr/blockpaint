// For building on vercel: https://github.com/Automattic/node-canvas/issues/1779
// Error: /lib64/libz.so.1: version `ZLIB_1.2.9' not found (required by
// /vercel/path0/node_modules/canvas/build/Release/libpng16.so.16)
if (
    process.env.LD_LIBRARY_PATH == null ||
    !process.env.LD_LIBRARY_PATH.includes(
      `${process.env.PWD}/node_modules/canvas/build/Release:`,
    )
) {
    process.env.LD_LIBRARY_PATH = `${
        process.env.PWD
    }/node_modules/canvas/build/Release:${process.env.LD_LIBRARY_PATH || ''}`;
}

module.exports = {
    reactStrictMode: true,
};