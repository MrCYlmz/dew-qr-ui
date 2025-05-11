
const required = (value: string | number) => !!value || "This field is required"
const price = (value: number) => value >= 0 || "Price must be 0 or greater"
const fileSize = (size:number) =>(file: File | undefined) =>
      !file || file.size <=  size * 1024 || `Image must be less than ${size}KB`
const minLength = (length: number) => (value: string) =>
      value.length >= length || `Minimum length is ${length} characters`
const maxLength = (length: number) => (value: string) =>
      value.length <= length || `Maximum length is ${length} characters`
export const rules = {
        required,
        price,
        fileSize,
        minLength,
        maxLength,
}