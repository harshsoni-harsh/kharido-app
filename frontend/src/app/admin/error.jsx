'use client'
 
import { useEffect } from 'react'
 
export default function Error({
  error,
  reset,
}) {
  useEffect(() => {
    console.error(error)
  }, [error])
 
  return (
    <div className='size-full flex flex-col justify-center items-center'>
      <h2>Something went wrong!</h2>
      <button
        onClick={
          () => reset()
        }
      >
        Try again
      </button>
    </div>
  )
}