"use client";

import Image from "next/image";
import { cn } from "src/shared/utils";
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'

interface ImageInfo {
  src: string;
  alt?: string;
}

interface ImageGalleryProps {
  images: ImageInfo[];
  fullWidth?: boolean;
  fullHeight?: boolean;
}

export function ImageGallery({
  images,
  fullWidth = false,
  fullHeight = false,
}: ImageGalleryProps) {
  const getGridCols = (length: number) => {
    if (length === 1)
      return "justify-center flex " + (fullWidth ? "w-full" : "");
    if (length === 2) return "grid grid-cols-2";
    return "grid grid-cols-2 lg:grid-cols-3";
  };

  return (
    <div className="w-full flex justify-center my-8">
      <div
        className={cn(
          `w-full max-w-4xl gap-6`,
          fullWidth && "w-full",
          getGridCols(images.length)
        )}
      >
        {images.map((image, index) => (
          <div key={index} className="w-full">
            <div className="relative aspect-auto max-h-full overflow-hidden">
              <Zoom>
                <Image
                  src={image.src}
                  alt={image.alt || `Image ${index + 1}`}
                  className="rounded-xl w-full h-auto object-contain shadow-md transition-all duration-300 hover:shadow-lg"
                  width={0}
                  height={0}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  style={{
                    width: "100%",
                    height: "auto",
                    maxHeight: fullHeight ? "100%" : "500px",
                  }}
                />
              </Zoom>
            </div>
            {image.alt && (
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-3 !mb-0 text-center font-medium">
                {image.alt}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
