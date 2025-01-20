"use client";

import Image from "next/image";

interface ImageInfo {
  src: string;
  alt?: string;
}

interface ImageGalleryProps {
  images: ImageInfo[];
}

export function ImageGallery({ images }: ImageGalleryProps) {
  const getGridCols = (length: number) => {
    if (length === 1) return "justify-center flex";
    if (length === 2) return "grid grid-cols-2";
    return "grid grid-cols-2 lg:grid-cols-3";
  };

  return (
    <div className="w-full flex justify-center">
      <div className={`w-full max-w-4xl ${getGridCols(images.length)} gap-4`}>
        {images.map((image, index) => (
          <div
            key={index}
            className={images.length === 1 ? "w-3/4 md:w-1/2" : "w-full"}
          >
            <Image
              src={image.src}
              alt={image.alt || `Image ${index + 1}`}
              className="rounded-lg w-full h-auto"
              width={0}
              height={0}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              style={{ width: "100%", height: "auto" }}
            />
            {image.alt && (
              <p className="text-sm text-neutral-600 dark:text-neutral-400 whitespace-nowrap pt-2 !m-0">
                {image.alt}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
