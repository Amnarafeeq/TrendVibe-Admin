export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-02-04'

export const dataset = assertValue(
  process.env.NEXT_PUBLIC_SANITY_DATASET,
  'Missing environment variable: NEXT_PUBLIC_SANITY_DATASET'
)

export const projectId = assertValue(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  'Missing environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID'
)

export const token = assertValue(
  "skWzkIdf6xnQygDYEb874fx5I5Mm41XgdJfEVmgoCdN7UWBh7uNqwHDQzkZB11cxsM5TQkM0q0B0CXpbYEnAE0ky9EG8sKC94WoKq6ZA8550BkVAv5vgh4ImAWpN8xAAHzhi0Hq0bjAZVcbKvU6Y6MXsCkBepLzIUZTPNZeOJgwpv8UJCJ0r",
  'Missing environment variable: NEXT_API_TOKEN'
)

function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    throw new Error(errorMessage)
  }

  return v
}
