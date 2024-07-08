export default function LabelGroup({ children, label, ...props }: { children: React.ReactNode, label: string, className?: string }) {
  return (
    <div {...props} className={"grid gap-1 content-start " + props.className || ''}> 
      <span className="text-sm font-medium text-muted-foreground lowercase">
        {label}
      </span>
      {children}
    </div>
  )
}

