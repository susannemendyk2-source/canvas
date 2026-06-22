export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ')
}

let counter = 0
export function uid(prefix = 'id'): string {
  counter++
  return `${prefix}-${counter}-${Date.now().toString(36)}`
}
