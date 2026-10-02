import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import * as v from 'valibot'

import { createCourse } from '@/api/courses'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export const Route = createFileRoute('/courses/new')({
  component: NewCoursePage,
})

const courseSchema = v.object({
  title: v.pipe(
    v.string(),
    v.minLength(3, 'Title must be at least 3 characters'),
  ),

  instructor: v.pipe(
    v.string(),
    v.minLength(
      2,
      'Instructor name must be at least 2 characters',
    ),
  ),
})

function NewCoursePage() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const mutation = useMutation({
    mutationFn: createCourse,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['courses'],
      })

      await navigate({
        to: '/courses',
      })
    },
  })

  const form = useForm({
    defaultValues: {
      title: '',
      instructor: '',
    },

    validators: {
      onChange: courseSchema,
    },

    onSubmit: async ({ value }) => {
      mutation.mutate(value)
    },
  })

  return (
    <div className="mx-auto max-w-md p-6">
      <h1 className="mb-6 text-2xl font-bold">
        Create Course
      </h1>

      <form
        className="space-y-5"
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
      >
        <form.Field name="title">
          {(field) => (
            <div className="space-y-2">
              <Label htmlFor={field.name}>
                Course Title
              </Label>

              <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) =>
                  field.handleChange(e.target.value)
                }
                placeholder="React Basics"
              />

              {!field.state.meta.isValid && (
                <p className="text-sm text-red-500">
                  {field.state.meta.errors
                    .map((error) => error?.message)
                    .join(', ')}
                </p>
              )}
            </div>
          )}
        </form.Field>

        <form.Field name="instructor">
          {(field) => (
            <div className="space-y-2">
              <Label htmlFor={field.name}>
                Instructor
              </Label>

              <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) =>
                  field.handleChange(e.target.value)
                }
                placeholder="Ahmed"
              />

              {!field.state.meta.isValid && (
                <p className="text-sm text-red-500">
                  {field.state.meta.errors
                    .map((error) => error?.message)
                    .join(', ')}
                </p>
              )}
            </div>
          )}
        </form.Field>

        <form.Subscribe
          selector={(state) => [
            state.canSubmit,
            state.isSubmitting,
          ]}
        >
          {([canSubmit, isSubmitting]) => (
            <Button
              type="submit"
              disabled={
                !canSubmit ||
                isSubmitting ||
                mutation.isPending
              }
              className="w-full"
            >
              {mutation.isPending
                ? 'Creating...'
                : 'Create Course'}
            </Button>
          )}
        </form.Subscribe>

        {mutation.isError && (
          <p className="text-sm text-red-500">
            Failed to create course.
          </p>
        )}
      </form>
    </div>
  )
}