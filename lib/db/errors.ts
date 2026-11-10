type PostgresError = {
  code?: string
  constraint?: string
  cause?: unknown
}

function isPostgresError(value: unknown): value is PostgresError {
  return typeof value === 'object' && value !== null
}

export function getPostgresErrorInfo(
  error: unknown,
): Pick<PostgresError, 'code' | 'constraint'> | undefined {
  const visited = new Set<object>()
  let current = error

  while (isPostgresError(current) && !visited.has(current)) {
    visited.add(current)
    if (typeof current.code === 'string') {
      return {
        code: current.code,
        ...(typeof current.constraint === 'string' && { constraint: current.constraint }),
      }
    }
    current = current.cause
  }

  return undefined
}

export function isProductSlugConflict(error: unknown): boolean {
  const postgresError = getPostgresErrorInfo(error)
  return (
    postgresError?.code === '23505' &&
    postgresError.constraint?.includes('products_slug') === true
  )
}
