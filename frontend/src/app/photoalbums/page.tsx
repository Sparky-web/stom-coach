import { api } from "~/trpc/server"
import PhotoAlbumImage from "./image";
import { Button } from "~/components/ui/button";
import Link from "next/link";


export const dynamic = "force-dynamic";

export default async function PhotoAlbums() {

  const photoAlbums = await api.strapi.getPhotoAlbums.query();



  return (<div className="h-full">
    <div className="container my-16 grid gap-8">
      <h1 className="text-3xl font-semibold ">
        Фотоальбомы
      </h1>

      <div className="grid gap-6 lg:grid-cols-[1fr,1fr,1fr] content-start items-start">
        {photoAlbums.map(album => {

          const cover = album.attributes.cover.data?.attributes.url
          return (
            <Link key={album.id} href={album.attributes.link} target="_blank" rel="noreferrer">
              <div key={album.id} className="rounded-2xl relative overflow-hidden h-[250px] photoalbum">

                <div className="content relative z-10 p-6 h-full grid gap-4 content-end text-white">
                  <h2 className="text-3xl font-semibold">{album.attributes.name}</h2>
                  <p className="text-gray-100">{album.attributes.description}</p>
                </div>

                {cover && <PhotoAlbumImage src={cover} alt={album.attributes.name} />}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[rgba(0,0,0,0.8)]"></div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  </div>)
}