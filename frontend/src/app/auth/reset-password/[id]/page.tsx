import { api } from "~/trpc/server"
import ResetCard from "./_lib/reset-card"

export default async function Page({ params }: { params: { id: string } }) {
  const token = params.id
  const {email} = await api.auth.checkToken.query({token})

  return (<div className="container flex justify-center py-[48px]">
    <ResetCard email={email} token={token} />
  </div>)
}