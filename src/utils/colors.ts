export interface RGB {
    r: number;
    g: number;
    b: number;
  }
  
  export function getAverageRGB(imgEl: HTMLImageElement): RGB {
    const blockSize = 5; // only visit every 5 pixels
    const defaultRGB: RGB = { r: 0, g: 0, b: 0 }; // for non-supporting envs
    const canvas = document.createElement('canvas');
    const context = canvas.getContext && canvas.getContext('2d');
    let data: ImageData;
    let width: number;
    let height: number;
    let i = -4;
    let length: number;
    const rgb: RGB = { r: 0, g: 0, b: 0 };
    let count = 0;
  
    if (!context) {
      console.info('no context');
      return defaultRGB;
    }
  
    height = canvas.height = imgEl.naturalHeight || imgEl.offsetHeight || imgEl.height;
    width = canvas.width = imgEl.naturalWidth || imgEl.offsetWidth || imgEl.width;
  
    context.drawImage(imgEl, 0, 0);
  
    try {
      data = context.getImageData(0, 0, width, height);
    } catch (e) {
      /* security error, img on diff domain */
      console.log(e);
      return defaultRGB;
    }
  
    length = data.data.length;
  
    while ((i += blockSize * 4) < length) {
      ++count;
      rgb.r += data.data[i];
      rgb.g += data.data[i + 1];
      rgb.b += data.data[i + 2];
    }
  
    // ~~ used to floor values
    rgb.r = ~~(rgb.r / count);
    rgb.g = ~~(rgb.g / count);
    rgb.b = ~~(rgb.b / count);
  
    return rgb;
  }