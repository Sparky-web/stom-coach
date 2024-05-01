import axios from "axios"

export default async function getCity(ip?: string) {
  const { data } = await axios.post('https://suggestions.dadata.ru/suggestions/api/4_1/rs/iplocate/address', ip ? { ip } : {}, {
    headers: {
      "Authorization": "Token 4a7011eaf1d840bcfe7435719aa23158748a866b"
    }
  })

  return data?.location?.data?.city || 'Екатеринбург'
}