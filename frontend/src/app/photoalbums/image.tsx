"use client";

import Image from "next/image";
import { useState } from "react";
import imageLoader from "~/functions/loader";

export default function PhotoAlbumImage({
  src,
  alt,
  placeholder,
}: {
  src: string;
  alt: string;
  placeholder?: string;
}) {
  return (
      <Image
        loader={imageLoader}
        src={src}
        objectFit="cover"
        placeholder="blur"
        blurDataURL={placeholder}
        alt={alt}
        fill
        className="rounded-lg relative overflow-hidden"
      />
  )
}