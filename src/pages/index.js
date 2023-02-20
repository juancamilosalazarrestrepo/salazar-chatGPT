import { Avatar } from '@/components/Avatar'
import { ChatGPTLogo, PlusIcon, SendIcon } from '@/components/Icons'
import { TypingEffect } from '@/components/TypingEffect'
import { useMessageStore } from '@/store/messages'
import Head from 'next/head'
import { useRef } from 'react'

function Layout({ children }) {
  return (
    <>
      <Head>
        <title>Salazar chat GPT</title>
      </Head>
      <div className='w-full relative bg-gptgray h-screen'>
        <Aside />
        {children}
      </div>
    </>
  )
}

function Aside() {
  return (
    <aside className='bg-gptdarkgray fixed flex w-64 [260px] h-screen flex-col max-sm:hidden'>
      <nav className='flex flex-col flex-1 h-full p-2 space-y-1'>
        <button className='flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm mb-2 flex-shrink-0 border border-white/20'>
          <PlusIcon />
          New chat
        </button>
      </nav>
    </aside>
  )
}

function UserAvatar() {
  return (
    <img src='https://scontent-bog1-1.xx.fbcdn.net/v/t39.30808-6/299932715_10228779162406493_6505065453662478578_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=09cbfe&_nc_ohc=SSU56hvGlacAX9C1uFk&_nc_ht=scontent-bog1-1.xx&oh=00_AfBwCenbv3CCJzfwLkHKSKvgWughGo2fbnUmbonnSZMiug&oe=63F6C625' />
  )
}

function Message({ ia, message }) {
  const avatar = ia ? <ChatGPTLogo /> : <UserAvatar />
  const textElement = ia ? <TypingEffect text={message} /> : message

  return (
    <div className={` ${ia ? 'bg-gptlightgray' : 'bg-gptgray'}`}>
      <article className='flex gap-4 p-6 m-auto max-w-3xl'>
        <Avatar>{avatar}</Avatar>
        <div className='min-h-[20px] flex flex-1 flex-col items-start gap-4'>
          <div className='prose-invert w-full break-words'>
            <p className='text-gray-300'>{textElement}</p>
          </div>
        </div>
      </article>
    </div>
  )
}
function MobileNavBar() {
  return (
    <div className='sticky top-0 z-10 flex items-center w-full border-b border-white/20 bg-gptgray  pt-1 text-gray-200 pl-1 md:hidden'>
      <button
        type='button'
        className='-ml-0.5 -mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-md hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white dark:hover:text-white'
      >
        <span className='sr-only'>Open sidebar</span>
        <svg
          stroke='currentColor'
          fill='none'
          strokeWidth='1.5'
          viewBox='0 0 24 24'
          strokeLinecap='round'
          strokeLinejoin='round'
          className='h-6 w-6'
          height='1em'
          width='1em'
          xmlns='http://www.w3.org/2000/svg'
        >
          <line x1='3' y1='12' x2='21' y2='12' />
          <line x1='3' y1='6' x2='21' y2='6' />
          <line x1='3' y1='18' x2='21' y2='18' />
        </svg>
      </button>
      <h1 className='flex-1 text-center text-base font-normal'>
        Escribe tu pregunta.
      </h1>
      <button type='button' className='px-3'>
        <svg
          stroke='currentColor'
          fill='none'
          strokeWidth='1.5'
          viewBox='0 0 24 24'
          strokeLinecap='round'
          strokeLinejoin='round'
          className='h-6 w-6'
          height='1em'
          width='1em'
          xmlns='http://www.w3.org/2000/svg'
        >
          <line x1='12' y1='5' x2='12' y2='19' />
          <line x1='5' y1='12' x2='19' y2='12' />
        </svg>
      </button>
    </div>
  )
}

function Chat() {
  const messages = useMessageStore((state) => state.messages)

  return (
    <div className='flex flex-col h-full flex-1 pl-64 max-sm:pl-0 max-sm:pr-0'>
      <main className='h-full'>
        <MobileNavBar />
        <div className='snap-y pb-32 bg-gptgray'>
          {messages.map((entry) => (
            <Message key={entry.id} {...entry} />
          ))}
        </div>
      </main>

      <ChatForm />
    </div>
  )
}

function ChatForm() {
  const sendPrompt = useMessageStore((state) => state.sendPrompt)
  const textAreaRef = useRef()

  const handleSubmit = (event) => {
    event.preventDefault()
    const { value } = textAreaRef.current
    sendPrompt({ prompt: value })
    textAreaRef.current.value = ''
  }

  const handleChange = () => {
    const el = textAreaRef.current
    const scrollHeight = el.scrollHeight
    el.style.height = scrollHeight + 'px'
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }
  return (
    <section className='fixed bottom-0 sm:left-0 sm:right-0  w-full ml-32 max-sm:ml-0 max-sm:w-11/12 max-sm:self-center'>
      <form
        onSubmit={handleSubmit}
        onKeyDown={handleKeyDown}
        className='flex flex-row max-w-3xl pt-6 m-auto mb-6'
      >
        <div className='relative flex flex-col flex-grow w-full px-4 py-3 text-white border rounded-md shadow-lg bg-gptlightgray border-gray-900/50'>
          <textarea
            onChange={handleChange}
            ref={textAreaRef}
            rows={1}
            tabIndex={0}
            defaultValue=''
            className='w-full h-[24px] resize-none bg-transparent m-0 border-0 outline-none'
          />
          <button
            type='submit'
            className='absolute p-1 rounded-md bottom-2.5 right-2.5'
          >
            <SendIcon />
          </button>
        </div>
      </form>
    </section>
  )
}

export default function Home() {
  return (
    <Layout>
      <Chat />
    </Layout>
  )
}
