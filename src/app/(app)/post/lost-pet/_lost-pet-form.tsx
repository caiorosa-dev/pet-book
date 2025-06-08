'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { Calendar as CalendarIcon, Camera, Clipboard, Dog } from 'lucide-react'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
// import { prisma } from '@/lib/prisma'
import { cn } from '@/lib/utils'

export const formSchema = z.object({
  pet: z.string(),
  datetimeLastSeen: z.date(),
  lastTimeSeenDescription: z.string(),
  images: z.array(z.string()).optional(), // url apontando para as imagens anexadas
})

export function LostPetForm({ onSubmit }: { onSubmit: any }) {
  const [previews, setPreviews] = useState<string[]>([])

  // const userPets = await prisma.pet.findMany({
  //   where: {
  //     owner: current_user.id,
  //   },
  // })
  const userPets = []

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="pet"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="!text-black">
                Qual pet você perdeu
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <div className="flex items-center gap-2 w-full">
                      <Dog className="w-4 h-4 text-primary" />
                      <SelectValue placeholder="Select a verified email to display" />
                    </div>
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="pretinha">Pretinha</SelectItem>
                  {userPets.map((pet) => (
                    <SelectItem key={pet.id} value={pet.id}>
                      {pet.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="datetimeLastSeen"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="!text-black">
                Quando foi visto por último
              </FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full text-left font-normal justify-start gap-2', // <-- ajuste aqui
                        !field.value && 'text-muted-foreground',
                      )}
                    >
                      <CalendarIcon className="h-4 w-4 text-primary" />
                      {field.value ? (
                        format(field.value, 'PPP')
                      ) : (
                        <span>Selecione uma data</span>
                      )}
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date('1900-01-01')
                    }
                    captionLayout="dropdown"
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lastTimeSeenDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="!text-black">
                Aonde foi visto por último?
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Clipboard className="absolute left-3 top-3 text-primary w-5 h-5" />
                  <Textarea
                    placeholder="Eu vi ele por último na Rua Graça N 295, quem ver ele por favor me chama aqui pela plataforma 😫"
                    className="resize-none pl-10"
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="images"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="!text-black">Selecione fotos</FormLabel>
              <FormControl>
                <label className="w-40 h-40 rounded-md border-[3px] border-dashed flex items-center justify-center cursor-pointer hover:bg-muted/50">
                  <Camera className="w-6 h-6 text-muted-foreground" />
                  <Input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => {
                      const files = Array.from(e.target.files || [])
                      field.onChange(e.target.files)

                      const filePreviews = files.map((file) =>
                        URL.createObjectURL(file),
                      )
                      setPreviews(filePreviews)
                    }}
                  />
                </label>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {previews}
        <Button className="w-full" type="submit">
          Criar post
        </Button>
      </form>
    </Form>
  )
}
