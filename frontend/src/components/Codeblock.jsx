import { CopyCheckIcon, CopyIcon } from 'lucide-react'
import { useState } from 'react'
import SyntaxHighlighter from 'react-syntax-highlighter'

const Codeblock = ({ rest, children, match }) => {
    const [isCopied, setIsCopied] = useState(false)

    const value = String(children).replace(/\n$/, '')
    const handleCopy = (val) => {
        if (!isCopied) {
            navigator.clipboard.writeText(val)
            setIsCopied(true)
            setTimeout(() => {
                setIsCopied(false)
            }, 2000)
        }
    }
    return (
        <div className="relative">
            <button onClick={() => handleCopy(value)} className="absolute cursor-pointer top-0 right-0 m-1">
                {isCopied ? <CopyCheckIcon size={18} color="gray" /> : <CopyIcon size={18} color="gray" />}
            </button>
            <SyntaxHighlighter
                {...rest}
                children={value}
                language={match[1]}
            // style={dark}
            />
        </div>
    )
}

export default Codeblock