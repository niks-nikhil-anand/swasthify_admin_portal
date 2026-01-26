import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function uploadToS3(
  file: File | Buffer,
  fileName: string,
  contentType: string
): Promise<string> {
  const fileBuffer = file instanceof File ? Buffer.from(await file.arrayBuffer()) : file;

  const params = {
    Bucket: process.env.AWS_BUCKET,
    Key: fileName,
    Body: fileBuffer,
    ContentType: contentType,
    // ACL: 'public-read', // Adjust based on your bucket policy
  };

  const command = new PutObjectCommand(params);

  try {
    await s3Client.send(command);
    // Construct the URL manually or use a specific domain if configured (e.g. CloudFront)
    // Standard format: https://<bucket-name>.s3.<region>.amazonaws.com/<key>
    return `https://${process.env.AWS_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
  } catch (error) {
    console.error("Error uploading to S3:", error);
    throw new Error("Failed to upload file to S3");
  }
}
