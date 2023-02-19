import { useState, useEffect } from 'react'

const useTypingEffect = ({ text }) => {
  const [displayText, setDisplayText] = useState('')
  const [currentIndex, setCurentIndex] = useState(0)
  const [showCursor, setShowCursor] = useState(true)

  useEffect(() => {
    console.log('text.lengt', text)
    if (text) {
      if (!text.length) return
      const randomTime = Math.floor(Math.random() * 40) + 15
      const intervalId = setInterval(() => {
        if (currentIndex >= text.length) {
          clearInterval(intervalId)
          setShowCursor(false)
          return
        }

        const nextIndex = text.indexOf(' ', currentIndex + 1)
        if (nextIndex < 0) {
          setDisplayText(text)
          setCurentIndex(text.length)
          return
        }

        setDisplayText(text.slice(0, nextIndex))
        setCurentIndex(currentIndex + 1)
      }, randomTime)

      return () => clearInterval(intervalId)
    } else {
      console.log('no se')
    }
  }, [text, currentIndex])

  return { displayText, showCursor }
}
export function TypingEffect({ text }) {
  const { displayText, showCursor } = useTypingEffect({ text })
  return (
    <span
      className={`${
        showCursor ? 'after:content-["▋"] after:ml-1 after:animate-typing' : ''
      }`}
    >
      {displayText}
    </span>
  )
}
