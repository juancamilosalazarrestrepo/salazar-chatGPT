import { create } from 'zustand'

export const useMessageStore = create((set, get) => ({
  messages: [],
  error: null,
  sendPrompt: async ({ prompt }) => {
    // actualizar los estados de los mensajes con el mensaje del usuario y crear un mensaje de la ia vacion minetras hacemos el fetching de datos
    const messageIAid = get().messages.length + 1

    set((state) => ({
      messages: [
        ...state.messages,
        {
          id: state.messages.length,
          ia: false,
          message: prompt
        },
        {
          id: state.messages.length + 1,
          ia: true,
          message: ''
        }
      ]
    }))

    // fetching de datos
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt })
      })

      const json = await response.json()

      // actualizar el mensaje de la IA que estaba vacion con el texto completo

      set((state) => ({
        messages: state.messages.map((entry) => {
          if (entry.id === messageIAid) {
            return {
              ...entry,
              message: json.response
            }
          }
          return entry
        })
      }))
    } catch (error) {
      console.error(error)
    }
  }
}))
