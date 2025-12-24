import { BlocksRenderer } from "@strapi/blocks-react-renderer";
import { api } from "~/trpc/server";

import type { Metadata } from "next";
import Link from "next/link";
import Card from "../_components/card";
import { Paperclip } from "lucide-react";
import { env } from "~/env";

export const metadata: Metadata = {
  title: "Образовательная программа | STOMCOACH",
};

export default async function StudyInfo() {
  const data = await api.strapi.getStudyDocuments.query();

  return (
    <div className="grid gap-8 container py-16 highlight-links">
      <h1 className="font-semibold text-3xl">Образовательные программы</h1>

      <div className="grid gap-6 md:grid-cols-[1fr,1fr] content-start items-start">
        {data.map((document) => (
          <DownloadableLink
            key={document.id}
            href={document.attributes.file.data.attributes.url}
          >
            {document.attributes.title}
          </DownloadableLink>
        ))}
      </div>
    </div>
  );
}

function DownloadableLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link href={env.NEXT_PUBLIC_STRAPI_URL + href} target="_blank" download>
      <Card className="cursor-pointer border-none p-4 shadow-md transition-all hover:bg-muted/50 hover:shadow-md">
        <div className="flex items-center gap-4">
          <Paperclip className="h-5 w-5 min-w-5 text-primary" />
          <div className="truncate text-lg">{children}</div>
        </div>
      </Card>
    </Link>
  );
}
