import Link from "next/link";
import { Checkbox } from "~/components/ui/checkbox";

export default function PersonalInfoCheckbox(props: { value: boolean, onChange: (value: boolean) => void }) {
  return (
    <div className="content-start highlight-links">
      <Checkbox id="terms" className="transform-[translateY(0.5rem)]"
        checked={props.value}
        onCheckedChange={(e) => {
          props.onChange(e)
        }} />
      <label
        htmlFor="terms"
        className="text-sm font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ml-2 "
      >
        Согласен с условиями <Link href="https://docs.google.com/document/d/1JHTxriSUbvL4hVF1QajdIjizfwl1slOs/" target="_blank">Договора публичной оферты
        </Link> и <Link href="/privacy" target="_blank">политикой в отношении обработки персональных данных</Link>
      </label>
    </div>
  )
}