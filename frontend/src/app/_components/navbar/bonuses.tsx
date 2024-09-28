import { StarIcon } from 'lucide-react'

interface NavbarBonusPointsProps {
  points: number
}

export default function NavbarBonusPointsIcon({ points = 0 }: NavbarBonusPointsProps) {
  return (
    <div className="inline-flex items-center w-fit justify-center h-8 px-3 rounded-full bg-yellow-500 text-yellow-900 shadow-sm">
      <StarIcon className="w-4 h-4 mr-1" />
      <span className="text-sm font-semibold">{points}</span>
    </div>
  )
}