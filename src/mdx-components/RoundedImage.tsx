import Image, { ImageProps } from "next/image";

export function RoundedImage(props: ImageProps) {
  return (
    <Image
      {...props}
      alt={props.alt}
      className="rounded-lg w-full h-auto"
      width={0}
      height={0}
      sizes="100vw"
      style={{ width: "100%", height: "auto" }}
    />
  );
}
