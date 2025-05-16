/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useState, useTransition } from 'react'
import {
  useForm,
  UseFormHandleSubmit,
  UseFormProps,
  UseFormReturn,
} from 'react-hook-form'
import { z } from 'zod'

type UseActionFormProps<Input extends z.ZodType<any, any>, Output> = Omit<
  UseFormProps<z.infer<Input>>,
  'resolver'
> & {
  schema: Input
  action: (values: z.infer<Input>) => Promise<Output>
  onSubmitStart?: (data: z.input<Input>) => void
  onSubmitError?: (error: any) => void
  onSubmitSuccess?: (result: Output) => void
  onSubmitStatusChange?: (isSubmitting: boolean) => void
}

type UseActionFormReturn<Input extends z.ZodType<any, any>, Output> = Omit<
  UseFormReturn<z.infer<Input>>,
  'handleSubmit'
> & {
  isPending: boolean
  response: Output | null
  error: any
  handleSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>
  handleSubmitOrigin: UseFormHandleSubmit<z.infer<Input>>
  triggerSubmit?: () => void
}

export const useActionForm = <Input extends z.ZodType<any, any>, Output>({
  schema,
  action,
  onSubmitError,
  onSubmitSuccess,
  onSubmitStart,
  defaultValues,
  ...formOptions
}: UseActionFormProps<Input, Output>): UseActionFormReturn<Input, Output> => {
  const form = useForm<z.infer<Input>>({
    resolver: zodResolver(schema),
    ...formOptions,
    defaultValues,
  })

  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<any>(null)
  const [response, setResponse] = useState<Output | null>(null)

  const parseResultWithDefaultValue = (data: z.input<Input>) => {
    const result = {
      ...defaultValues,
      ...data,
    } as z.infer<Input>

    return result
  }

  const handleSubmit = form.handleSubmit(async (data: z.input<Input>) => {
    if (onSubmitStart) onSubmitStart(data)

    const parsedData = parseResultWithDefaultValue(data)

    setError(null)

    startTransition(async () => {
      try {
        const result = await action(parsedData)

        setResponse(result)
        if (onSubmitSuccess) onSubmitSuccess(result)
      } catch (error: any) {
        setError(error)

        if (onSubmitError) onSubmitError(error)
        console.error(error)
      }
    })
  })

  const triggerSubmit = () => {
    form.handleSubmit(handleSubmit)()
  }

  return {
    ...form,
    handleSubmit,
    triggerSubmit,
    handleSubmitOrigin: form.handleSubmit,
    error,
    isPending,
    response,
  }
}
