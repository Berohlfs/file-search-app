// Libs
import { S3Client } from "@aws-sdk/client-s3"

export const s3 = new S3Client({
    endpoint: process.env.ENDPOINT_S3 as string,
    region: process.env.REGION_S3 as string,
    forcePathStyle: true,
    credentials: {
        accessKeyId: process.env.ACCESS_KEY_ID as string,
        secretAccessKey: process.env.SECRET_ACCESS_KEY as string,
    }
})