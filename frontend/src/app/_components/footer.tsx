export default function Footer() {
  return (
    <div className={'bg-gray-950 text-white'}>
      <div className="container py-[32px] grid gap-2">
        {/* <span className="text-2xl font-semibold"></span> */}
        <div className=" text-white/40">
          STOMCOACH&nbsp;&nbsp;—&nbsp;&nbsp;Учебный центр для стоматологов и зубных техников
        </div>
        <div className="text-white/40">
          © 2015-{new Date().getFullYear()}. Копирование и перезапись контента запрещены.
        </div>
      </div>
    </div >
  )
}