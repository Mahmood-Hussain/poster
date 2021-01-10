var mime = require('mime-types');
const isImage = (file) => {
    var type = mime.lookup(file.name);
    switch (type) {
      case 'image/jpeg':
        return true;
      case 'image/gif':
        return true;
      case 'image/bmp':
        return true;
      case 'image/png':
        return true;
      default:
        return false
    }
  }
  
const isVideo = (file) => {
    var type = mime.lookup(file.name);
    switch (type) {
      case 'video/m4v':
        return true;
      case 'video/x-msvideo':
        return true;
      case 'video/mp4':
        return true;
      case 'video/webm':
        return true;
      case 'video/quicktime':
        return true;
      case 'video/x-flv':
        return true;
      case 'video/x-ms-wmv':
        return true;
      case 'video/mpeg':
        return true;
      case 'video/ogg':
        return true;
    default:
        return false
    }
  }

  export {isImage, isVideo}