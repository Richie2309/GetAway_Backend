export default interface ICloudinaryService {
  uploadImage(imageDataBase64: string): Promise<string | never>;
  uploadData(mediaDataBase64: string, resourceType: string): Promise<string | never>
}