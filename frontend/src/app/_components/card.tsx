export default function Card({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={`p-6 rounded-2xl card bg-primary/5 ${className || ''}`}>
      {children}
    </div>
  )
}