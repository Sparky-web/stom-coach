import { BlocksRenderer } from "@strapi/blocks-react-renderer";
import { api } from "~/trpc/server";

export default async function Privacy() {
  const data = await api.strapi.getPrivacyPolicy.query();

  return (
    <div className="grid gap-8 container py-16 highlight-links">
      <h1 className="font-semibold text-3xl">Политика обработки персональных данных</h1>
      <div className="bg-muted rounded-2xl p-8">
        <BlocksRenderer content={data.attributes.text} />
      </div>
    </div>
  )
}