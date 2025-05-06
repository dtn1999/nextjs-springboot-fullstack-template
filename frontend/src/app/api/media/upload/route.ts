import { NextRequest, NextResponse } from "next/server";

import { UploadApiErrorResponse, v2 as cloudinary } from "cloudinary";
import { env } from "@/env";
import { auth } from "@/server/auth";
import { ResultAsync } from "neverthrow";

cloudinary.config({
  cloud_name: env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

export const POST = async (req: NextRequest) => {
  const authToken = await auth();

  if (!authToken) {
    return NextResponse.json({
      error: {
        status: 401,
        title: "Unauthorized",
        detail: "You must be logged in to upload media.",
      },
    });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (file) {
    const buffer = new Uint8Array(await file.arrayBuffer());
    const resultAsync = ResultAsync.fromPromise(
      new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({}, (err, callResult) => {
            if (err) {
              reject(err);
              return;
            }
            resolve(callResult);
          })
          .end(buffer);
      }),
      (error: any) => {
        const uploadError = error as UploadApiErrorResponse;
        console.error("Error uploading to Cloudinary", uploadError);
        if (uploadError) {
          return {
            ...uploadError,
          };
        }

        return {
          message: `Error when uploading to Cloudinary. ${error.message}`,
        };
      }
    );

    const result = await resultAsync;

    if (result.isErr()) {
      console.error("upload error", result);
      return NextResponse.json({
        error: {
          status: 500,
          title: "Media upload failed",
          detail:
            result.error.message ??
            "An error occurred while uploading the media file.",
        },
      });
    }

    return NextResponse.json({
      data: result.value,
    });
  } else {
    return NextResponse.json({
      error: {
        status: 400,
        title: "Bad request",
        detail: "The request did not contain a file to upload.",
      },
    });
  }
};
