"use client"

import { useFormStatus } from "react-dom"
import LoadingButton from "./LoadingButton"

export default function FormSubmitButton(
  //The Props are recieves as A Button imported from React HTML Attributes
  props: React.ButtonHTMLAttributes<HTMLButtonElement>,
) {
  const { pending } = useFormStatus()
  console.log(pending)
  //props(properties) are spread to the LoadingButton component
  return <LoadingButton {...props} type="submit" loading={pending} />
}
