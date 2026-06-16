import { useState } from 'react'

export function Hello(props: { name: string }) {
  const [open, setOpen] = useState(false)
  const greeting = `hi, ${props.name}`
  return (
    <div onClick={() => setOpen(!open)} title={greeting} className="box">
      1
    </div>
  )
}
