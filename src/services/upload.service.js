'use strict';

const cloudinary = require('../configs/cloudinary.config');
const { BadRequestError } = require('../core/error.response');
/////////////////////////
// Uploads an image file
/////////////////////////
const uploadImageUrl = async (imagePath) => {
  // Use the uploaded file's name as the asset's public ID and 
  // allow overwriting the asset with new versions
  const options = {
    use_filename: true,
    unique_filename: false,
    overwrite: true,
    folder: 'uploads'
  };

  try {
    // Upload the image
    const result = await cloudinary.uploader.upload(imagePath, options);
    console.log(result);
    return result.public_id;
  } catch (error) {
    console.error(error);
  }
};

const uploadImageLocalMultipleFiles = async ({ files, folderName = 'uploads' }) => {
  try {

    if (!files.length) {
      return
    }

    const uploadPromises = files.map(file => {
      return cloudinary.uploader.upload(file.path, {
        // public_id: 'thumb',
        folder: folderName,
        // resource_type: 'auto' // This allows any file type
      });
    });

    const results = await Promise.all(uploadPromises);
    return results

  } catch (error) {
    throw new BadRequestError('Upload fail')
  }
}

const uploadImageLocal = async ({ path, folderName = 'uploads' }) => {
  try {
    // Upload the image
    const result = await cloudinary.uploader.upload(path, {
      // public_id: 'thumb',
      folder: folderName
    });
    return {
      image_url: result.secure_url,
      thumb_url: await createImageThumb(result.public_id, {
        height: 100,
        width: 100,
        format: 'jpg'
      })
    }
  } catch (error) {
    throw new BadRequestError('Upload fail')
  }
}

const createImageThumb = (publicId, opts = {
  height: 150,
  width: 150,
  format: 'jpg'
}) => {
  return cloudinary.url(publicId, opts)
}

//////////////////////////////////////////////////////////////
// Creates an HTML image tag with a transformation that
// results in a circular thumbnail crop of the image  
// focused on the faces, applying an outline of the  
// first color, and setting a background of the second color.
//////////////////////////////////////////////////////////////
const createImageTag = (publicId, ...colors) => {

    // Set the effect color and background color
    const [effectColor, backgroundColor] = colors;

    // Create an image tag with transformations applied to the src URL
    let imageTag = cloudinary.image(publicId, {
      transformation: [
        { width: 250, height: 250, gravity: 'faces', crop: 'thumb' },
        { radius: 'max' },
        { effect: 'outline:10', color: effectColor },
        { background: backgroundColor },
      ],
    });

    return imageTag;
};

//////////////////
//
// Main function
//
//////////////////
// (async () => {

//     // Set the image to upload
//     const imagePath = 'https://cloudinary-devs.github.io/cld-docs-assets/assets/images/happy_people.jpg';

//     // Upload the image
//     const publicId = await uploadImage(imagePath);

//     // Get the colors in the image
//     const colors = await getAssetInfo(publicId);

//     // Create an image tag, using two of the colors in a transformation
//     const imageTag = await createImageTag(publicId, colors[0][0], colors[1][0]);

//     // Log the image tag to the console
//     console.log(imageTag);

// })();


module.exports = {
  uploadImageUrl,
  createImageTag,
  uploadImageLocal,
  uploadImageLocalMultipleFiles,
}