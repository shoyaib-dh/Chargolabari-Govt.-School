import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from '../firebase';

/**
 * Compresses an image file into a lightweight JPEG/WebP data URL
 * so it works both as a fallback when Firebase Storage isn't provisioned
 * and stays safely below Firestore's document field size limits.
 */
async function compressImageToDataUrl(file: File, maxDim = 960, quality = 0.78): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context unavailable'));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = () => reject(new Error('Invalid image file'));
      img.src = String(reader.result);
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

export async function uploadSchoolAsset(
  file: File,
  folder: string
): Promise<{ url: string; method: 'storage' | 'inline' }> {
  // Attempt Firebase Storage upload first with a short timeout fallback
  try {
    const safeName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
    const storageRef = ref(storage, `school/${folder}/${safeName}`);
    const uploadPromise = uploadBytes(storageRef, file).then((snap) => getDownloadURL(snap.ref));
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Storage upload timeout')), 6000)
    );
    const url = await Promise.race([uploadPromise, timeoutPromise]);
    return { url, method: 'storage' };
  } catch {
    // Graceful fallback if Firebase Storage bucket is not yet activated
    if (file.type.startsWith('image/')) {
      const compressed = await compressImageToDataUrl(file);
      if (compressed.length > 180000) {
        const smaller = await compressImageToDataUrl(file, 640, 0.65);
        return { url: smaller, method: 'inline' };
      }
      return { url: compressed, method: 'inline' };
    }
    if (file.size <= 260000) {
      const base64 = await fileToBase64(file);
      return { url: base64, method: 'inline' };
    }
    throw new Error(
      'ফাইলটির আকার বড় (২৬০ KB-এর বেশি) এবং Firebase Storage সক্রিয় নয়। অনুগ্রহ করে ফাইলটির Google Drive / বাহ্যিক লিংক ব্যবহার করুন অথবা ছোট ফাইল আপলোড করুন।'
    );
  }
}
