import axios from "axios";
import { env } from "~/env";

export default async function getCity(ip?: string) {
  const { data } = await axios.post(
    "https://suggestions.dadata.ru/suggestions/api/4_1/rs/iplocate/address",
    ip ? { ip } : {},
    {
      headers: {
        Authorization: "Token " + env.NEXT_PUBLIC_DADATA_API_KEY,
      },
    }
  );

  return data?.location?.data?.city || "Екатеринбург";
}
