import React from "react"
import Markdown from "./Markdown"

const Message = React.memo(({ role, message }) => {
    return role == "client" ?
        <div className='max-w-[50vw] bg-gray-200 py-2 self-end px-3 rounded-xl'>
            <Markdown>{message}</Markdown>
        </div>
        :
        <div className='w-full'>
            <Markdown>{message}</Markdown>
        </div>
})

export default Message