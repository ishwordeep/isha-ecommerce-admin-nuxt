<template>
  <UPageCard class="w-full max-w-md">
    <UAuthForm
      :schema="schema"
      title="Login"
      description="Enter your credentials to access your account."
      :fields="fields"
      @submit="onSubmit"
      :loading="submitting"
    />
  </UPageCard>
</template>

<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent, AuthFormField } from '@nuxt/ui'

definePageMeta({
  layout: 'auth',
})

const toast = useToast()
const auth = useAuth()
const submitting = ref<boolean>()
const fields: AuthFormField[] = [
  {
    name: 'email',
    type: 'email',
    label: 'Email',
    placeholder: 'Enter your email',
    required: true,
  },
  {
    name: 'password',
    label: 'Password',
    type: 'password',
    placeholder: 'Enter your password',
    required: true,
  },
  {
    name: 'remember',
    label: 'Remember me',
    type: 'checkbox',
  },
]

const schema = z.object({
  email: z.email('Invalid email'),
  password: z.string('Password is required').min(8, 'Must be at least 8 characters'),
})

type Schema = z.output<typeof schema>

const onSubmit = async (payload: FormSubmitEvent<Schema>) => {
  submitting.value = true
  const { success } = await auth.login({
    email: payload.data.email,
    password: payload.data.password,
  })

  if (success) {
    navigateTo('/')
    toast.add({
      title: 'Success',
      description: 'You have successfully logged in.',
      type: 'background',
      duration: 5000,
      color: 'success',
      icon: 'i-lucide-check-circle',
    })
    navigateTo('/')
  } else {
    toast.add({
      title: 'Error',
      description: 'Error logging in.',
      type: 'background',
      duration: 5000,
      color: 'error',
      icon: 'i-lucide-x-circle',
    })
    submitting.value = false
  }
}
</script>
