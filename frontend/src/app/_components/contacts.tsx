import { Button } from "~/components/ui/button";
import { Settings } from "~/types/entities";
import { BlocksRenderer, type BlocksContent } from '@strapi/blocks-react-renderer';
import MapComponent from "../events/[id]/map";

export default function Contacts(props: { settings: Settings }) {
  console.log(props.settings)
  return (
    <div className="bg-muted" id="contacts">
      <div className="container py-[32px] grid md:grid-cols-[1fr,2fr] gap-6">
        <div className="p-6 bg-white rounded-xl grid gap-4">
          <h2 className="text-2xl font-semibold">Контакты</h2>
          {/* <p dangerouslySetInnerHTML={{ __html: props.settings?.contacts || '' }} /> */}
          {/* <p>{props.settings?.contacts}</p> */}
          <BlocksRenderer content={props.settings?.contactsText as BlocksContent} />
          <div className="flex gap-3 mt-6">
            <a href={`https://api.whatsapp.com/send/?phone=${props.settings.phone}&text&type=phone_number&app_absent=0`} target="_blank" rel="noreferrer" className="bg-[#25D366] rounded-xl h-[48px] w-[48px] p-1.5">
              <img alt="svgImg" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHg9IjBweCIgeT0iMHB4IiB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAsMCwyNTYsMjU2IgpzdHlsZT0iZmlsbDojMDAwMDAwOyI+CjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtcnVsZT0ibm9uemVybyIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIHN0cm9rZS1saW5lY2FwPSJidXR0IiBzdHJva2UtbGluZWpvaW49Im1pdGVyIiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIHN0cm9rZS1kYXNoYXJyYXk9IiIgc3Ryb2tlLWRhc2hvZmZzZXQ9IjAiIGZvbnQtZmFtaWx5PSJub25lIiBmb250LXdlaWdodD0ibm9uZSIgZm9udC1zaXplPSJub25lIiB0ZXh0LWFuY2hvcj0ibm9uZSIgc3R5bGU9Im1peC1ibGVuZC1tb2RlOiBub3JtYWwiPjxnIHRyYW5zZm9ybT0ic2NhbGUoMTAuNjY2NjcsMTAuNjY2NjcpIj48cGF0aCBkPSJNMTIuMDExNzIsMmMtNS41MDYsMCAtOS45ODgyMyw0LjQ3ODM4IC05Ljk5MDIzLDkuOTg0MzhjLTAuMDAxLDEuNzYgMC40NTk5OCwzLjQ3ODE5IDEuMzMzOTgsNC45OTIxOWwtMS4zNTU0Nyw1LjAyMzQ0bDUuMjMyNDIsLTEuMjM2MzNjMS40NTksMC43OTYgMy4xMDE0NCwxLjIxMzg0IDQuNzczNDQsMS4yMTQ4NGgwLjAwMzkxYzUuNTA1LDAgOS45ODUyOCwtNC40NzkzNyA5Ljk4ODI4LC05Ljk4NDM3YzAuMDAyLC0yLjY2OSAtMS4wMzU4OCwtNS4xNzg0MSAtMi45MjE4NywtNy4wNjY0MWMtMS44ODYsLTEuODg3IC00LjM5MjQ1LC0yLjkyNjczIC03LjA2NDQ1LC0yLjkyNzczek0xMi4wMDk3Nyw0YzIuMTM2LDAuMDAxIDQuMTQzMzQsMC44MzM4IDUuNjUyMzQsMi4zNDE4YzEuNTA5LDEuNTEgMi4zMzc5NCwzLjUxNjM5IDIuMzM1OTQsNS42NTAzOWMtMC4wMDIsNC40MDQgLTMuNTg0MjMsNy45ODYzMyAtNy45OTAyMyw3Ljk4NjMzYy0xLjMzMywtMC4wMDEgLTIuNjUzNDEsLTAuMzM1NyAtMy44MTY0MSwtMC45NzA3bC0wLjY3MzgzLC0wLjM2NzE5bC0wLjc0NDE0LDAuMTc1NzhsLTEuOTY4NzUsMC40NjQ4NGwwLjQ4MDQ3LC0xLjc4NTE2bDAuMjE2OCwtMC44MDA3OGwtMC40MTQwNiwtMC43MTg3NWMtMC42OTgsLTEuMjA4IC0xLjA2NzQxLC0yLjU4OTE5IC0xLjA2NjQxLC0zLjk5MjE5YzAuMDAyLC00LjQwMiAzLjU4NTI4LC03Ljk4NDM3IDcuOTg4MjgsLTcuOTg0Mzd6TTguNDc2NTYsNy4zNzVjLTAuMTY3LDAgLTAuNDM3MDIsMC4wNjI1IC0wLjY2NjAyLDAuMzEyNWMtMC4yMjksMC4yNDkgLTAuODc1LDAuODUyMDggLTAuODc1LDIuMDgwMDhjMCwxLjIyOCAwLjg5NDUzLDIuNDE1MDMgMS4wMTk1MywyLjU4MjAzYzAuMTI0LDAuMTY2IDEuNzI2NjcsMi43NjU2MyA0LjI2MzY3LDMuNzY1NjNjMi4xMDgsMC44MzEgMi41MzYxNCwwLjY2NyAyLjk5NDE0LDAuNjI1YzAuNDU4LC0wLjA0MSAxLjQ3NzU1LC0wLjYwMjU1IDEuNjg1NTUsLTEuMTg1NTVjMC4yMDgsLTAuNTgzIDAuMjA4NDgsLTEuMDg0NSAwLjE0NjQ4LC0xLjE4NzVjLTAuMDYyLC0wLjEwNCAtMC4yMjg1MiwtMC4xNjYwMiAtMC40Nzg1MiwtMC4yOTEwMmMtMC4yNDksLTAuMTI1IC0xLjQ3NjA4LC0wLjcyNzU1IC0xLjcwNTA4LC0wLjgxMDU1Yy0wLjIyOSwtMC4wODMgLTAuMzk2NSwtMC4xMjUgLTAuNTYyNSwwLjEyNWMtMC4xNjYsMC4yNSAtMC42NDMwNiwwLjgxMDU2IC0wLjc4OTA2LDAuOTc2NTZjLTAuMTQ2LDAuMTY3IC0wLjI5MTAyLDAuMTg5NDUgLTAuNTQxMDIsMC4wNjQ0NWMtMC4yNSwtMC4xMjYgLTEuMDUzODEsLTAuMzkwMjQgLTIuMDA3ODEsLTEuMjQwMjRjLTAuNzQyLC0wLjY2MSAtMS4yNDI2NywtMS40NzY1NiAtMS4zODg2NywtMS43MjY1NmMtMC4xNDUsLTAuMjQ5IC0wLjAxMzY3LC0wLjM4NTc3IDAuMTExMzMsLTAuNTA5NzdjMC4xMTIsLTAuMTEyIDAuMjQ4MDUsLTAuMjkxNSAwLjM3MzA1LC0wLjQzNzVjMC4xMjQsLTAuMTQ2IDAuMTY3LC0wLjI1MDAyIDAuMjUsLTAuNDE2MDJjMC4wODMsLTAuMTY2IDAuMDQwNTEsLTAuMzEyNSAtMC4wMjE0OSwtMC40Mzc1Yy0wLjA2MiwtMC4xMjUgLTAuNTQ3NTMsLTEuMzU3NTYgLTAuNzY5NTMsLTEuODUxNTZjLTAuMTg3LC0wLjQxNSAtMC4zODQ1LC0wLjQyNDY0IC0wLjU2MjUsLTAuNDMxNjRjLTAuMTQ1LC0wLjAwNiAtMC4zMTA1NiwtMC4wMDU4NiAtMC40NzY1NiwtMC4wMDU4NnoiPjwvcGF0aD48L2c+PC9nPgo8L3N2Zz4=" />
            </a>
            <a href={`mailto:${props.settings.email}`} target="_blank" rel="noreferrer" >
              <Button className="h-[48px] bg-black text-white rounded-[12px] hover:bg-black hover:opacity-85 uppercase">Написать на почту</Button>
            </a>
          </div>
        </div>
        <div className="rounded-xl overflow-hidden">
          <MapComponent coordinates={props.settings.addressCoordinates.split(',').map(Number)} />
        </div>
      </div>
    </div>
  )
}