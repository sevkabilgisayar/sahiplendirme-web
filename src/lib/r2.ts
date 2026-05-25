import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID || "09625e242e30495a9ae9b7a88dc24b45";
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID || "9d84abb542b06a297e96718bf311c2b7";
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY || "39312cd408257a52de18ba75c191f5532e9f8216dfaa1cb5e5c27eee168ee534";
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || "sahiplendirme-medya";
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL || "https://medya.sahiplendirme.com";

export const s3Client = new S3Client({
  region: "auto",
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

/**
 * R2'ye dosya yükler ve dosyanın Public URL'sini veya Key'ini döndürür.
 */
export async function uploadToR2(fileBuffer: Buffer, fileName: string, contentType: string) {
  const safeName = fileName.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9.-]/g, "-").toLowerCase();
  const fileKey = `uploads/${Date.now()}-${safeName}`;

  const command = new PutObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: fileKey,
    Body: fileBuffer,
    ContentType: contentType,
  });

  await s3Client.send(command);

  // Dosya public (herkese açık) ise Public URL döndürülür
  return {
    key: fileKey,
    url: `${R2_PUBLIC_URL}/${fileKey}`
  };
}

/**
 * İstenirse (örneğin dosya public URL'den gizli tutuluyorsa) geçici süreli (presigned) URL oluşturur.
 */
export async function getPresignedR2Url(fileKey: string, expiresInSeconds = 3600) {
  const command = new PutObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: fileKey,
  });
  return await getSignedUrl(s3Client, command, { expiresIn: expiresInSeconds });
}

/**
 * R2'den dosya siler
 */
export async function deleteFromR2(fileKey: string) {
  const command = new DeleteObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: fileKey,
  });
  await s3Client.send(command);
  return true;
}
