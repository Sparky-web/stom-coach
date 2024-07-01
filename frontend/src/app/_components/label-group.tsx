export default function LabelGroup({ children, label }: { children: React.ReactNode, label: string }) {
  return (
    <div className="grid gap-1 content-start">
      <span className="text-sm font-semibold text-muted-foreground">
        {label}
      </span>
      {children}
    </div>
  )
}

