import { randomBytes } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const MAX_BYTES = 5 * 1024 * 1024;

export async function saveUploadedImage(file: File, folder = "products") {
  if (!ALLOWED.has(file.type)) {
    throw new Error("نوع الملف غير مدعوم. استخدم JPEG أو PNG أو WebP أو GIF.");
  }
  if (file.size > MAX_BYTES) {
    throw new Error("حجم الصورة أكبر من 5MB.");
  }

  const ext =
    file.type === "image/jpeg"
      ? "jpg"
      : file.type === "image/png"
        ? "png"
        : file.type === "image/webp"
          ? "webp"
          : "gif";

  const name = `${Date.now()}-${randomBytes(6).toString("hex")}.${ext}`;
  const relDir = path.join("uploads", folder);
  const absDir = path.join(process.cwd(), "public", relDir);
  await mkdir(absDir, { recursive: true });

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(absDir, name), buffer);

  return `/${relDir.replace(/\\/g, "/")}/${name}`;
}
