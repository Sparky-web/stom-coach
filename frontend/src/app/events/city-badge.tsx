import { ReactNode } from "react";
import { Badge } from "~/components/ui/badge";
import { cn } from "~/lib/utils";

export default function CityBadge(props: { variant: "selected" | "default", children: ReactNode, onClick?: () => void, disabled?: boolean }) {
  const disabled = props.disabled || false

  return (
    <Badge variant={props.variant === "default" ? "default" : "default"}  onClick={!disabled ? props.onClick : undefined} className={
      cn(
        "text-sm font-normal py-1.5 px-4 cursor-pointer",
        props.variant === "default" && "bg-gray-100 text-black hover:bg-gray-200",
        props.variant === 'selected' && "bg-primary text-white",
        disabled && "cursor-default opacity-70 hover:bg-gray-100 bg-gray-100 text-black/70"
      )
    }>{props.children}</Badge>
  )
}