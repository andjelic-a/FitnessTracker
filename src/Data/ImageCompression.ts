import Compressor from "compressorjs";

export default function compressImage(
  image: File,
  quality: number = 0.6,
  maxWidth: number = 750,
  maxHeight: number = 750,
  debug: boolean = false
) {
  return new Promise<string>((resolve) => {
    if (debug)
      console.log(`${image.size / 1024 / 1024} MB (${performance.now()} ms)`);

    new Compressor(image, {
      quality: quality,
      convertTypes: ["image/png", "image/webp", "image/gif"],
      maxWidth: maxWidth,
      maxHeight: maxHeight,
      convertSize: 734003, //0.7 MB
      success: (res) => {
        if (debug)
          console.log(`${res.size / 1024 / 1024} MB (${performance.now()} ms)`);

        resolve(blobToBase64(res));
      },
    });
  });
}

function blobToBase64(blob: Blob) {
  return new Promise<string>((resolve, _) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.readAsDataURL(blob);
  });
}
