import { useMemo, useState } from 'react';

type ImageUploadProps = {
  onImagesChange: (urls: string[]) => void;
  maxImages?: number;
};

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024;

export default function ImageUpload({ onImagesChange, maxImages = 5 }: ImageUploadProps) {
  const [images, setImages] = useState<string[]>([]);
  const [uploadingCount, setUploadingCount] = useState(0);
  const [error, setError] = useState('');

  const handleFiles = async (files: FileList | null) => {
    if (!files?.length) return;

    const filesArray = Array.from(files);
    const validFiles = filesArray.filter((file) => {
      if (!ACCEPTED_TYPES.includes(file.type)) {
        setError('Only JPG, PNG, and WebP images are allowed.');
        return false;
      }
      if (file.size > MAX_FILE_SIZE) {
        setError('Each image must be 5MB or smaller.');
        return false;
      }
      return true;
    });

    if (!validFiles.length) return;

    const initialImages = [...images];
    const previewUrls = validFiles.map((file) => URL.createObjectURL(file));
    const nextImages = [...initialImages, ...previewUrls].slice(0, maxImages);

    setError('');
    setUploadingCount(validFiles.length);
    setImages(nextImages);
    onImagesChange(nextImages);

    for (let index = 0; index < validFiles.length; index += 1) {
      const file = validFiles[index];
      const previewIndex = initialImages.length + index;
      try {
        const response = await (await import('../../services/listings.api')).listingsApi.getPresignedUrl(file.name, file.type);
        const uploadUrl = response.data.uploadUrl;
        const uploadResponse = await fetch(uploadUrl, {
          method: 'PUT',
          body: file,
          headers: { 'Content-Type': file.type },
        });

        if (!uploadResponse.ok) {
          throw new Error('Upload failed');
        }

        const finalImages = [...nextImages];
        finalImages[previewIndex] = response.data.fileUrl;
        setImages(finalImages);
        onImagesChange(finalImages);
      } catch {
        setError('One or more images could not be uploaded.');
      } finally {
        setUploadingCount(Math.max(0, validFiles.length - index - 1));
      }
    }

    setUploadingCount(0);
  };

  const removeImage = (urlToRemove: string) => {
    const nextImages = images.filter((image) => image !== urlToRemove);
    setImages(nextImages);
    onImagesChange(nextImages);
  };

  const progressLabel = useMemo(() => {
    if (uploadingCount > 0) {
      return `Uploading ${uploadingCount} of ${maxImages}...`;
    }
    return '';
  }, [uploadingCount, maxImages]);

  return (
    <div className="space-y-3">
      <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-green-400 bg-green-50 p-6 text-center text-sm text-green-800">
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="hidden"
          onChange={(event) => handleFiles(event.target.files)}
        />
        <span className="text-base font-semibold">Click or drag images here</span>
        <span className="mt-1">PNG, JPG, or WebP up to 5MB each</span>
      </label>

      {progressLabel && <div className="text-sm text-green-700">{progressLabel}</div>}
      {error && <div className="text-sm text-red-600">{error}</div>}

      {images.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {images.map((image) => (
            <div key={image} className="relative">
              <img src={image} alt="Preview" className="h-20 w-20 rounded-lg object-cover" />
              <button
                type="button"
                onClick={() => removeImage(image)}
                className="absolute right-1 top-1 rounded-full bg-black/70 px-1.5 py-0.5 text-xs text-white"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
