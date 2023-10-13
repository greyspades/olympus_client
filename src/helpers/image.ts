export const resizeImage = (imageFile: File) => {
    const maxWidth = 708.67; // Set your desired max width here
    const maxHeight = 545.06; // Set your desired max height here

    const image = new Image();
    image.src = URL.createObjectURL(imageFile);

    image.onload = () => {
      let width = image.width;
      let height = image.height;

      if (width > maxWidth) {
        height *= maxWidth / width;
        width = maxWidth;
      }

      if (height > maxHeight) {
        width *= maxHeight / height;
        height = maxHeight;
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(image, 0, 0, width, height);

      const resizedDataUrl = canvas.toDataURL('image/jpeg');// You can change the format as needed

    //   var result
      
    //   canvas.toBlob((blob) => {
    //     // Convert Blob to File with a name
    //     const resizedImage = new File([blob], 'resized_image.jpg', {
    //       type: 'image/jpeg',
    //     });

    //     result = resizedImage

    //   }, 'image/jpeg');

    //   return result;

    return canvas;
    };
  };