import fs from 'node:fs/promises'
import { OpenAI } from 'openai'

// OpenAI Cloud
// const openai = new OpenAI()

// Local API
const openai = new OpenAI({
  baseURL: 'http://localhost:1234/v1',
  apiKey: 'not-needed',
})

// Image URLs
const imageAddress = './assets/photo-cats.png'

// Function to get base64 image
async function getBase64Img(image) {
  const data = await fs.readFile(image)
  const base64Image = data.toString('base64')
  return base64Image
}

// Function to create completion request
async function createCompletion(imageAddress) {
  const base64Image = await getBase64Img(imageAddress)

  const startTime = process.hrtime()
  const completion = await openai.chat.completions.create({
    model: 'gpt-4-vision-preview',
    temperature: 0,
    max_tokens: 1000,
    messages: [
      {
        role: 'user',
        content: [
          { type: 'text', text: "What's on image" },
          {
            type: 'image_url',
            image_url: {
              url: `data:image/jpeg;base64,${base64Image}`,
            },
          },
        ],
      },
    ],
  })
  const endTime = process.hrtime(startTime)

  console.log(completion.choices[0].message)
  console.log(`Time to respond: ${endTime[0]}s ${endTime[1] / 1000000}ms`)
}

createCompletion(imageAddress).catch(console.error)
