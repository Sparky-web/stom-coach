"use client";

import Image from "next/image";
import { useState } from "react";
import imageLoader from "~/functions/loader";

export default function PhotoAlbumImage({
  src,
  alt
}: {
  src: string;
  alt: string;
}) {
  return (
      <Image
        loader={imageLoader}
        src={src}
        objectFit="cover"

        alt={alt}
        fill
        className="rounded-lg relative overflow-hidden"
      />
  )
}