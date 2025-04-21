export default function ensureJpgExtension(url) {
    try {
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split('/');
      let filename = pathParts.pop();
  
      
      filename = filename.replace(/\.\w+$/, '') + '.jpg';
  
      
      pathParts.push(filename);
      urlObj.pathname = pathParts.join('/');
  
      return urlObj.toString();
    } catch (error) {
      console.error('Invalid URL:', url);
      return null;
    }
  }
  