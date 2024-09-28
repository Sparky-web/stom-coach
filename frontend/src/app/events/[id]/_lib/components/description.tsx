'use client'

import Link from "next/link"
import React from "react"

export default function Description({ content }: { content: string }) {
  const [expanded, setExpanded] = React.useState(false)
  return (
    <div>
      <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{
        __html:
          expanded ? content : 
          content.slice(0, 780).substring(0, content.indexOf(" ", 740)) + "..."
      }} />
      <Link href="#" className="mt-4 block underline text-blue-500 hover:text-blue-600 transition" onClick={(e) => {
        e.preventDefault()
        setExpanded(!expanded)
      }}>
        {expanded ? "Скрыть" : "Показать больше"}
      </Link>
    </div>

  )
}