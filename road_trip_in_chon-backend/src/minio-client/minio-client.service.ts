import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { MinioService } from "nestjs-minio-client";
import { BufferedFile } from "./file.model";
import { ConfigService } from "@nestjs/config";
import * as crypto from "crypto";
import * as sizeOf from "buffer-image-size";

@Injectable()
export class MinioClientService {
  constructor(
    private readonly minio: MinioService,
    private readonly configService: ConfigService,
  ) {
    this.logger = new Logger(MinioClientService.name);

    const policy = {
      Version: "2012-10-17",
      Statement: [
        {
          Effect: "Allow",
          Principal: {
            AWS: ["*"],
          },
          Action: [
            "s3:ListBucketMultipartUploads",
            "s3:GetBucketLocation",
            "s3:ListBucket",
          ],
          Resource: ["arn:aws:s3:::picture-bucket"], // Change this according to your bucket name
        },
        {
          Effect: "Allow",
          Principal: {
            AWS: ["*"],
          },
          Action: [
            "s3:PutObject",
            "s3:AbortMultipartUpload",
            "s3:DeleteObject",
            "s3:GetObject",
            "s3:ListMultipartUploadParts",
          ],
          Resource: ["arn:aws:s3:::picture-bucket/*"], // Change this according to your bucket name
        },
      ],
    };
    this.client.setBucketPolicy(
      this.configService.get<string>("minio.bucket"),
      JSON.stringify(policy),
      function (err: unknown) {
        if (err) throw err;

        console.log("Bucket policy set");
      },
    );
  }

  private readonly logger: Logger;
  private readonly bucketName = this.configService.get<string>(
    "minio.bucket",
  ) as string;

  public get client() {
    return this.minio.client;
  }

  public async upload(
    file: BufferedFile,
    folder: string = "",
    bucketName: string = this.bucketName,
  ) {
    // Only allow jpeg and png
    if (!(file.mimetype.includes("jpeg") || file.mimetype.includes("png"))) {
      throw new HttpException(
        "File type not supported",
        HttpStatus.BAD_REQUEST,
      );
    }

    // Limited to 5MB
    if (file.size > 5000000) {
      throw new HttpException("File size too large", HttpStatus.BAD_REQUEST);
    }

    // Image Width and Height must be more than 400px
    const dimensions = sizeOf(file.buffer as Buffer);
    if (folder === "profiles/") {
      if (dimensions.width > 400 || dimensions.height > 400) {
        throw new HttpException(
          "Image dimensions too large for profile image.",
          HttpStatus.BAD_REQUEST,
        );
      }
    } else {
      if (dimensions.width < 400 || dimensions.height < 400) {
        throw new HttpException(
          "Image dimensions too small for review or blog image.",
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    const timestamp = Date.now().toString();
    const hashedFileName = crypto
      .createHash("md5")
      .update(timestamp + file.originalname)
      .digest("hex");
    const extension = file.originalname.substring(
      file.originalname.lastIndexOf("."),
      file.originalname.length,
    );
    const metadata = { "Content-type": file.mimetype };
    const fileName = hashedFileName + extension;
    this.client.putObject(
      bucketName,
      folder + fileName,
      file.buffer,
      metadata,
      (err) => {
        if (err) {
          this.logger.error(err);
          throw new HttpException(
            "Error uploading file",
            HttpStatus.BAD_REQUEST,
          );
        }
      },
    );
    return {
      url: `https://minio.${this.configService.get<string>(
        "domain",
      )}/${this.configService.get<string>("minio.bucket")}/${
        folder + fileName
      }`,
    };
  }

  public async uploadMultiple(
    files: BufferedFile[],
    folder: string = "",
    bucketName: string = this.bucketName as string,
  ) {
    const urls: { url: string }[] = [];
    for (const file of files) {
      urls.push(await this.upload(file, folder, bucketName));
    }

    return urls;
  }

  async delete(fileName: string, bucketName: string = this.bucketName) {
    this.client.removeObject(bucketName, fileName, (err) => {
      if (err) {
        throw new HttpException("Error deleting file", HttpStatus.BAD_REQUEST);
      }
    });
  }
}
