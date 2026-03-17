import ReactMarkdown from "react-markdown"
import remarkGfm from 'remark-gfm'
// import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import Codeblock from "./Codeblock"

const Markdown = ({ children }) => {

  return <ReactMarkdown
    remarkPlugins={[remarkGfm]}
    components={{
      code(props) {
        const { children, className, ...rest } = props
        const match = /language-(\w+)/.exec(className || '')
        return match ? (
          <Codeblock rest={rest} children={children} match={match} />
        ) : (
          <code {...rest} className={className}>
            {children}
          </code>
        )
      }
    }}
  >
    {children}
  </ReactMarkdown>
}

export default Markdown