"use client"
import React, { useState } from 'react'

import { ArrowUp } from "lucide-react"
const App = () => {
  const [messages, setMessage] = useState([])
  const [userInput, setUserInput] = useState("")
  const [loading, setLoading] = useState(false)

  const handleButtonClick = async () => {
    setLoading(true)
    setMessage([...messages, {
      role: "client",
      message: userInput
    }])

    const base_url = "http://127.0.0.1:5000"

    const req = await fetch(`${base_url}/ai`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json' // Declare the content type
      },
      body: JSON.stringify({ message: userInput })
    })
    const res = await req.json()
    console.log(res)

    setUserInput("")

    // Here make some reqs
    setLoading(false)
  }

  return (
    <div className='flex relative min-h-screen'>
      <main>

      </main>
      <div className='absolute bottom-5 w-full flex justify-center'>
        <div className='w-[80vw] h-12 relative'>
          <input value={userInput} onChange={(e) => { setUserInput(e.target.value) }} placeholder='Ask Anything' className='w-full h-[80%] p-5.5 rounded-2xl border' />
          <button disabled={loading} onClick={handleButtonClick} className={`bg-black ${loading && "opacity-80"} absolute -right-0.5 p-3 -top-0.5 rounded-full cursor-pointer`}><ArrowUp color='white' /></button>
        </div>
      </div>
    </div>
  )
}

export default App