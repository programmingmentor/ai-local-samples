import readline from 'node:readline'

import OpenAI from 'openai'

// OpenAI Cloud
// const openai = new OpenAI()

// Local API
const openai = new OpenAI({
  baseURL: 'http://localhost:1234/v1',
  apiKey: 'not-needed',
})

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

const newMessage = async (history, message) => {
  const chatCompletion = await openai.chat.completions.create({
    messages: [...history, message],
    model: 'gpt-3.5-turbo',
    // model: 'gpt-4',
  })

  return chatCompletion.choices[0].message
}

const formatMessage = (userInput) => ({ role: 'user', content: userInput })

const chat = () => {
  const history = [
    {
      role: 'system',
      content: `You are a helpful AI assistant. Answer the user's questions to the best of you ability.`,
    },
  ]
  const start = () => {
    rl.question('You: ', async (userInput) => {
      if (userInput.toLowerCase() === '/exit') {
        rl.close()
        return
      }

      const userMessage = formatMessage(userInput)

      const startTime = process.hrtime()
      const response = await newMessage(history, userMessage)
      const endTime = process.hrtime(startTime)

      history.push(userMessage, response)

      console.log(`\n\nAI: ${response.content}\n\n`)
      console.log(`Time to respond: ${endTime[0]}s ${endTime[1] / 1000000}ms`)
      start()
    })
  }

  start()
  console.log('\n\nAI: How can I help you today?\n\n')
}

console.log("Chatbot initialized. Type '/exit' to end the chat.")
chat()
