import * as cloudinary from 'cloudinary'
import ICloudinaryService from '../../interface/utils/ICloudinaryService'

const cloudinaryConfig = {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
}

cloudinary.v2.config(cloudinaryConfig)

export default class CloudinaryService implements ICloudinaryService {
  async uploadImage(imageDataBase64: string): Promise<string | never> {
    try {
      const uploadApiResponse: cloudinary.UploadApiResponse = await cloudinary.v2.uploader.upload(imageDataBase64, { folder: 'GetAway' })
      return uploadApiResponse.secure_url
    } catch (err) {
      throw err
    }
  }

  async uploadData(mediaDataBase64: string, resourceType: 'image' | 'video' | 'raw' | 'auto'): Promise<string | never> {
    try {
      const uploadApiResponse: cloudinary.UploadApiResponse = await cloudinary.v2.uploader.upload(mediaDataBase64, {
        folder: 'GetAway',
        resource_type: resourceType
      })
      return uploadApiResponse.secure_url
    } catch (err) {
      throw err
    }
  }
}