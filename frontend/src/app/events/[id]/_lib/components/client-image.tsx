'use client'
import Image from "next/image"

import imageLoader from "~/functions/loader"

export default function ClientImage({ url, alt, blurDataURL }: { url: string, alt: string, blurDataURL?: string }) {
  return (<Image loader={imageLoader} src={url} width={700} height={700}
    className="object-cover object-top absolute h-full w-full "
    placeholder="blur"
     blurDataURL={blurDataURL}
    alt={alt} />)
}

export const  SpeakerImage = ({ url, alt }: { url: string, alt: string }) => {
  return (<Image loader={imageLoader} src={url} width={70} height={70}
    className="w-16 h-16 rounded-3xl border-3 border-blue-800 object-cover object-top"
    alt={alt} />)
}