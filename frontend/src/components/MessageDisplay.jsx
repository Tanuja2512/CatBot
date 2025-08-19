// src/components/MessageDisplay.jsx
import React, { useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm'; // For GitHub Flavored Markdown (tables, task lists, etc.)
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
// Choose a style for your code blocks. You can explore others from 'react-syntax-highlighter/dist/esm/styles/prism'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import "./style.css"
const MessageDisplay = ({ messages, loading, newRequestLoading }) => {
  const messagesEndRef = useRef(null);

  // Scroll to the bottom of the chat when new messages arrive or loading state changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading, newRequestLoading]);

  return (
    <div className="message-display">
      {messages.length === 0 && !loading && !newRequestLoading ? (
        <div className="no-messages">
          <p>Start a new chat or select an existing one to begin!</p>
        </div>
      ) : (
        messages.map((message, index) => (
          <div key={index} className="chat-bubble">
            <div className="user-question">
              <strong>You:</strong>
              <div className="message-content">{message.question}</div>
            </div>
            <div className="gemini-answer">
              <div className="message-content">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]} // Enable GFM features
                  components={{
                    // Custom component for rendering code blocks with syntax highlighting
                    code({ node, inline, className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || '');
                      return !inline && match ? (
                        <SyntaxHighlighter
                          style={vscDarkPlus} // Apply the chosen code style
                          language={match[1]}
                          PreTag="div"
                          {...props}
                        >
                          {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                      ) : (
                        <code className={className} {...props}>
                          {children}
                        </code>
                      );
                    },
                    // Optional: You can customize other elements like links, paragraphs etc.
                    // a: ({node, ...props}) => <a target="_blank" rel="noopener noreferrer" {...props} />,
                    // p: ({node, ...props}) => <p className="custom-paragraph" {...props} />
                  }}
                >
                  {message.answer}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        ))
      )}

      {(loading || newRequestLoading) && (
        <div className="loading-indicator chat-bubble gemini-answer">
          <div className="message-content">
            <div className="spinner"></div> {/* Simple spinner for now */}
            <p>Generating response...</p>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} /> {/* Element to scroll into view */}
    </div>
  );
};

export default MessageDisplay;