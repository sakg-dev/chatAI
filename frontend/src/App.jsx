/* eslint-disable no-unused-vars */
"use client"
import { useState } from 'react'
import { ArrowUp } from "lucide-react"
import Markdown from './components/Markdown'

const App = () => {
  const [messages, setMessages] = useState([])
  const [userInput, setUserInput] = useState("")
  const [loading, setLoading] = useState(false)

  // useEffect(() => {
  //   console.log(messages)
  // }, [messages])

  // useEffect(() => {
  //   navigator.clipboard.writeText("test test test")
  // }, [])

  const addAIMessage = (setMessages, chunk) => {
    setMessages(prev => {
      if (prev[prev.length - 1].role == "client") {
        return [...prev, {
          role: "ai",
          message: chunk.choices[0].delta.content
        }]
      } else {
        const newMessages = prev.map((val, idx) => {
          if (idx == prev.length - 1) {
            return { role: "ai", message: val.message + chunk.choices[0].delta.content }
          } else {
            return val
          }
        })
        return newMessages
      }
    })
  }

  const handleButtonClick = async () => {
    setLoading(true)
    setUserInput("")

    // Add client message to the messages state
    setMessages(prev => [
      ...prev,
      {
        role: "client",
        message: userInput
      }
    ])

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

    // Get all stream messages
    while (!done) {
      const { value, done: doneReading } = await reader.read()
      done = doneReading
      try {
        let chunk = JSON.parse(decoder.decode(value).replace("data:", ""))
        if (chunk.choices[0].delta.content && chunk.choices[0].delta.content.trim() != "") {
          // setM(prev => prev + chunk.choices[0].delta.content)
          addAIMessage(setMessages, chunk)
        }
      } catch (err) {
        try {
          const val = decoder.decode(value).replace("data:", "")
          let chunks = val.split("\n")
          for (let i = 0; i < chunks.length; i++) {
            let chunk = chunks[i]
            if (chunk.trim() != "") {
              chunk = JSON.parse(chunk)
              if (chunk && chunk.choices[0].delta.content.trim() != "") addAIMessage(setMessages, chunk)
            }
          }
        } catch (errr) { /* */ }
      }
    }
    setLoading(false)
  }

  return (
    <div className='flex relative min-h-screen'>
      <main className='convo-area flex flex-col w-[70vw] min-h-screen m-auto pt-4 pb-[10vh] gap-4'>
        {messages.map((val, idx) => {
          if (val.role == "client") {
            return <div key={idx} className='max-w-[50vw] bg-gray-200 py-2 self-end px-3 rounded-xl'>
              <Markdown>{val.message}</Markdown>
            </div>
          } else {
            return <div key={idx} className='w-full'>
              <Markdown>{val.message}</Markdown>
            </div>
          }
        })}
      </main>
      <div className='fixed bottom-5 w-full flex justify-center'>
        <input value={userInput} onChange={(e) => { setUserInput(e.target.value) }} placeholder='Ask Anything' className='w-[80vw] h-12 p-5.5 rounded-2xl border bg-white' onKeyDown={(e) => { if (e.code == "Enter" || e.code == "NumpadEnter") handleButtonClick() }} />
        <div className='flex justify-between items-center w-[80vw] h-12 px-1 z-20 absolute pointer-events-none'>
          <div></div>
          <button disabled={loading} onClick={handleButtonClick} className={`bg-black pointer-events-auto ${loading && "opacity-80"} p-1.5 rounded-xl cursor-pointer`}><ArrowUp color='white' /></button>
        </div>
      </div>
    </div>
  )
}

export default App