import { FieldApi } from "@tanstack/react-form";
import i18next from "i18next";
import { z } from "zod";
import { zodI18nMap } from "zod-i18n-map";
import { InputProps, Input } from "~/components/ui/input";
import translation from "zod-i18n-map/locales/ru/zod.json";

export type ClientFormValuesInput = {
  first_name: string;
  last_name: string;
  second_name: string;
  phone: string;
  email: string;
  workplace: string;
  position: string;
  speciality?: string;
  custom_speciality?: string;
  custom_position?: string;
  city?: string;
}

export type ClientFormValuesOutput = {
  first_name: string;
  last_name: string;
  second_name: string;
  phone: string;
  email: string;
  workplace: string;
  position: number;
  speciality?: number;
  custom_speciality?: string;
  custom_position?: string;
  city?: string;
}

i18next.init({
  lng: "ru",
  resources: {
    ru: { zod: translation },
  },
});
z.setErrorMap(zodI18nMap);

export const getErrors = ({ values }: { values: ClientFormValues }) => {
  try {
    const schema = z.object({
      first_name: z.string().min(2).max(50),
      last_name: z.string().min(2).max(50),
      // phone: z.string().min(11).max(11),
      email: z.string().email(),
      workplace: z.string().min(2).max(255),
      // position: z.string(),
    })

    schema.parse(values)

    return []
  } catch (e) {
    if (e instanceof z.ZodError) {
      const errorMessages = e.errors.map(err => err.message);
      return errorMessages
    }
  }
}


export function getFormField({ label, ...rest }: { label: string } & InputProps) {
  return function (field: FieldApi<any, any, any, any, any>) {
    return (
      <div className="grid items-start content-start gap-1 max-h-fit">
        <label className="text-sm font-semibold">{label}</label>
        <Input id={field.name}
          name={field.name}
          value={field.state.value}
          onBlur={field.handleBlur}
          onChange={(e) => field.handleChange(e.target.value)}
          {...rest}
        />
        {field.state.meta.errors && <span className="text-sm text-red-700">
          {field.state.meta.errors.join(', ')}
        </span>}
      </div>
    )
  }
}