import React, { PropsWithChildren } from 'react'

export default function Card({ children, ...rest }: PropsWithChildren<Record<string, unknown>>){
  return (
    <div className="card" {...rest}>
      {children}
    </div>
  )
}
