/* eslint-disable no-unused-vars */
"use client"
import React, { useRef, useState } from 'react'

import { ArrowUp } from "lucide-react"
const App = () => {
  const [messages, setMessage] = useState([])
  const [m, setM] = useState("")
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
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message: userInput })
    })
    const reader = req.body.getReader()
    const decoder = new TextDecoder("utf-8")

    let done = false
    let allChunks = []

    while (!done) {
      const { value, done: doneReading } = await reader.read()
      done = doneReading
      try {
        let chunk = JSON.parse(decoder.decode(value).replace("data:", ""))
        if (chunk.choices[0].delta.content && chunk.choices[0].delta.content.trim() != "") {
          setM(prev=>prev + chunk.choices[0].delta.content)
        }
      } catch (err) {
        try {
          const val = decoder.decode(value).replace("data:", "")
          let chunks = val.split("\n")
          for (let i = 0; i < chunks.length; i++) {
            let chunk = chunks[i]
            if (chunk.trim() != "") {
              chunk = JSON.parse(chunk)
              if (chunk && chunk.choices[0].delta.content.trim() != "") setM(prev=>prev + chunk.choices[0].delta.content)
            }
          }
        } catch (errr) { /* */ }
      }
    }

    setUserInput("")

    // Here make some reqs
    setLoading(false)
  }

  return (
    <div className='flex relative min-h-screen'>
      <main>
        {m}
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