'use client'

import { Search } from 'lucide-react'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useClientForm } from '@/hooks/use-client-form'

import { search } from '../actions'
import { searchSchema } from '../schema'

export function SearchForm() {
  const form = useClientForm({
    schema: searchSchema,
    handler: search,
  })

  return (
    <Form {...form} className="space-y-6">
      <FormField
        control={form.control}
        name="query"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Input icon={Search} placeholder="Procure algo..." {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </Form>
  )
}
