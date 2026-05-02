import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Using the keys from .env.local
cloudinary.config({
  cloud_name: "doqpmh01f",
  api_key: "284838127547152",
  api_secret: "0mOsFQg2a7yGC20K1mfH9RfQ-cQ",
});

async function testUpload() {
  try {
    const dataUri = "data:text/plain;base64,SGVsbG8gV29ybGQ="; // simple text file base64
    console.log("Attempting upload...");
    const result = await cloudinary.uploader.upload(dataUri, {
      folder: "portfolio",
      resource_type: "auto",
    });
    console.log("Success:", result.secure_url);
  } catch (error) {
    console.error("Cloudinary Error:", error);
  }
}

testUpload();
