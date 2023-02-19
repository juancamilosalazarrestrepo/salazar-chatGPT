export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  const { prompt } = req.body
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is Required' })
  }

  try {
    console.log('apikey', process.env.OPENAI_API_KEY)
    const response = await fetch('https://api.openai.com/v1/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'text-davinci-003',
        prompt: `Responde como si fueras la inteligencia artificial conversacion ChatGPT. El usuario te escribe un prompt y tú debes contestar de forma natural. el prompt es:\n\n${prompt}`,
        temperature: 0.7,
        max_tokens: 256,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0
      })
    })

    if (!response.ok) {
      console.log(response.statusText)
      return res.status(500).json({ error: 'OpenAI API Error' })
    }

    const json = await response.json()

    res.status(200).json({ response: json.choices[0].text })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: e })
  }
}
