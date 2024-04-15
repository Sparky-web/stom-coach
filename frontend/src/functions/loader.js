import { env } from "~/env"

// @ts-ignore
const imageLoader = ({ src, width, quality }) => {
  return `${env.NEXT_PUBLIC_STRAPI_URL}${src}?w=${width}&q=${quality || 75}`
}

export default imageLoader

