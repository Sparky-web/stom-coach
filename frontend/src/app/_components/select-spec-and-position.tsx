'use client'
import { FormApi } from "@tanstack/react-form";
import { useEffect } from "react";
import { toast } from "sonner";
import { Input } from "~/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "~/components/ui/select";
import { api } from "~/trpc/react";

interface SelectProps {
  form: FormApi<any>
}

export default function SelectSpecAndPosition({ form }: SelectProps) {
  const { data, error } = api.strapi.getSpecsAndPositions.useQuery(undefined)

  useEffect(() => {
    if(error) {
      console.log(error)
      toast.error("Ошибка загрузки специальностей и должностей")
    }
  }, [error])

  return (
    <>
      {
        data?.positions && <form.Field name="position">
          {(field) => (
            <div className="grid gap-3 content-start">
              <div className="grid gap-1">
                <label className="text-sm font-semibold">Должность</label>
                <Select value={field.state.value} onValueChange={val => {
                  if (data.positions.find(e => e.id === +val)?.attributes.enableSpeciality === false) {
                    field.form.setFieldValue('speciality', '')
                    field.form.setFieldValue('custom_speciality', '')
                  }

                  if (!(data.positions.find(e => e.id === +field.state.value)?.attributes.name === 'Другое')) {
                    field.form.setFieldValue('custom_position', '')
                  }
                  field.handleChange(val)
                }}>
                  <SelectTrigger className="text-left text-sm">
                    <SelectValue placeholder="Выберите должность" />
                  </SelectTrigger>
                  <SelectContent >
                    {data.positions.map((e) => (
                      <SelectItem key={e.id} value={e.id.toString()}>
                        {e.attributes.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {
                data.positions.find(e => e.id === +field.state.value)?.attributes.name === 'Другое' && <form.Field name="custom_position">
                  {(field) => (
                    <div className="grid gap-1">
                      <label className="text-sm font-semibold">Название должности</label>
                      <Input value={field.state.value} onBlur={field.handleBlur} onChange={(e) => field.handleChange(e.target.value)} />
                    </div>
                  )}
                </form.Field>
              }
            </div>
          )}
        </form.Field>
      }

      {
        data?.specs && <form.Field name="speciality">
          {(field) => {
            return (
              <form.Subscribe
                selector={(state) => [state.values.position]}
              >
                {(_form) => {
                  return (
                    <div className="grid gap-3 content-start">
                      <div className="grid gap-1 content-start">
                        <label className="text-sm font-semibold">Специальность</label>
                        <Select value={field.state.value} onValueChange={e => {

                          if (data.specs.find(e => e.id === +field.state.value)?.attributes.name !== 'Другое') {
                            field.form.setFieldValue('custom_speciality', '')
                          }

                          field.handleChange(e)
                        }}
                          disabled={
                            data.positions.find(e => e.id === +field.form.getFieldValue('position'))?.attributes.enableSpeciality === false
                          }
                        >
                          <SelectTrigger className="text-left text-sm">
                            <SelectValue placeholder="Выберите специальность" />
                          </SelectTrigger>
                          <SelectContent>
                            {data.specs.map((e) => (
                              <SelectItem key={e.id} value={e.id.toString()}>
                                {e.attributes.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {
                        data.specs.find(e => e.id === +field.state.value)?.attributes.name === 'Другое' && <form.Field name="custom_speciality">
                          {(field) => (
                            <div className="grid gap-1">
                              <label className="text-sm font-semibold">Название специальности</label>
                              <Input value={field.state.value} onBlur={field.handleBlur} onChange={(e) => field.handleChange(e.target.value)} />
                            </div>
                          )}
                        </form.Field>
                      }
                    </div>
                  )
                }}
              </form.Subscribe>
            )
          }}
        </form.Field>
      }
    </>
  )

}