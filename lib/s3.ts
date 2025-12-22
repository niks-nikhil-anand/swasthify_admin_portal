import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

/**
 * Uploads a file to the S3 bucket.
 * @param fileBuffer - The file content as a Buffer or Uint8Array.
 * @param fileName - The key (filename) to save the file as.
 * @param contentType - The MIME type of the file.
 * @returns The public URL of the uploaded file.
 */
export async function uploadToS3(
  fileBuffer: Buffer | Uint8Array,
  fileName: string,
  contentType: string
) {
  const params = {
    Bucket: process.env.AWS_BUCKET,
    Key: fileName,
    Body: fileBuffer,
    ContentType: contentType,
    // Add ACL: 'public-read' if your bucket is public, 
    // but usually it's better to keep it private and use CloudFront or signed URLs for reading.
    // For now, consistent with "just save in bucket".
  };

  try {
    const command = new PutObjectCommand(params);
    await s3Client.send(command);
    
    // Constructing the URL manually. 
    // Note: This assumes a standard S3 URL structure.
    return `https://${process.env.AWS_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
  } catch (error) {
    console.error("Error uploading to S3:", error);
    throw error;
  }
}
