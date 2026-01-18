import dotenv from 'dotenv'
import { OpenAI } from "openai"

dotenv.config()

const ai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY,
    defaultHeaders: {
        "HTTP-Referer": "http://localhost:5713",
        "X-Title": "Ai-learing-assistant",
    }
})

if (!process.env.OPENROUTER_API_KEY) {
    console.error('FATAL ERROR: OPENROUTER_API_KEY is not set in the environment variables.')
    process.exit(1)
}

const MODEL_NAME = "google/gemini-3-flash-preview"

const generateOpenRouter = async (prompt) => {
    const completion = await ai.chat.completions.create({
        model: MODEL_NAME,
        messages: [
            { role: "user", content: prompt }
        ]
    })
    return completion.choices[0].message.content
}

/**
 * Generate flashcards from text
 * @param {string} text
 * @param {number} count
 * @return {Promise<Array<{question: string, answer: string, difficulty: string}}
 */

export const generateFlashcards = async (text, count = 10) => {
    const prompt = `Generate exactly ${count} educational flashcards from the following text.
    Format each flashcard as:
    Q: [Clear, specific question]
    A: [Concise, accurate answer]
    D: [Difficulty level: easy, medium, or hard]
    
    Separate each flashcard with "---"
    
    Text:
    ${text.substring(0, 15000)}`

    try {
        const generatedText = await generateOpenRouter(prompt)

        // Parse the response
        const flashcard = []
        const cards = generatedText.split('---').filter(c => c.trim())

        for (const card of cards) {
            const lines = card.trim().split('\n')
            let question = '', answer = '', difficulty = 'medium'

            for (const line of lines) {
                if (line.startsWith('Q:')) {
                    question = line.substring(2).trim()
                } else if (line.startsWith("A:")) {
                    answer = line.substring(2).trim()
                } else if (line.startsWith("D:")) {
                    const diff = line.substring(2).trim().toLowerCase()
                    if (['easy', 'medium', 'hard'].includes(diff)) {
                        difficulty = diff
                    }
                }
            }

            if (question && answer) {
                flashcard.push({ question, answer, difficulty })
            }
        }

        return flashcard.slice(0, count)
    } catch (error) {
        console.error("Gemini API error:", error)
        throw new Error('Failed to generate flashcards')
    }
}

/**
 * Generate quiz questions
 * @param {string} text
 * @param {number} numQuestions
 * @return {Promise<Array<{question: string, options: Array, correctAnswer: string, explanation: string, difficulty: string}}
 */
export const generateQuiz = async (text, numQuestions = 5) => {
    const prompt = `Generate exactly ${numQuestions} multiple choice questions from the followingg text.
    Format each question as:
    Q: [Question]
    O1: [Option 1]
    O2: [Option 2]
    O3: [Option 3]
    O4: [Option 4]
    C: [Correct option - exactly as written above]
    E: [Brief explanation]
    D: [Difficulty: easy, medium, or hard]
    
    Separate question with "---"
    
    Text:
    ${text.substring(0, 15000)}`

    try {
        const generatedText = await generateOpenRouter(prompt)

        const questions = []
        const questionBlocks = generatedText.split('---').filter(q => q.trim())

        for (const block of questionBlocks) {
            const lines = block.trim().split('\n')
            let question = '', options = [], correctAnswer = '', explanation = '', difficulty = 'medium'

            for (const line of lines) {
                const trimmed = line.trim()
                if (trimmed.startsWith("Q:")) {
                    question = trimmed.substring(2).trim()
                } else if (trimmed.match(/^O\d:/)) {
                    options.push(trimmed.substring(3).trim())
                } else if (trimmed.startsWith("C:")) {
                    correctAnswer = trimmed.substring(2).trim()
                } else if (trimmed.startsWith("E:")) {
                    explanation = trimmed.substring(2).trim()
                } else if (trimmed.startsWith("D:")) {
                    const diff = trimmed.substring(2).trim().toLowerCase()
                    if (['easy', 'medium', 'hard'].includes(diff)) {
                        difficulty = diff
                    }
                }
            }
            
            if (question && options.length === 4 && correctAnswer) {
                questions.push({ question, options, correctAnswer, explanation, difficulty})
            }
        }

        return questions.slice(0, numQuestions)
    } catch (error) {
        console.error("Gemini API error:", error)
        throw new Error('Failed to generate quiz')
    }
}

/**
 * Generate document summary
 * @param {string} text
 * @return {Promise<string>}
 */

export const generateSummary = async (text) => {
    const prompt = `Provide a concise summary of the following text, highlighting the key concept, main ideas, and important points. Keep the summary clear and structured.
    
    Text:
    ${text.substring(0, 20000)}`

    try {
        const generatedText = await generateOpenRouter(prompt)
        return generatedText
    } catch (error) {
        console.error("Gemini API error:", error)
        throw new Error('Failed to generate summary')
    }
}

/**
 * Chat with document context
 * @param {string} question
 * @param {Array<Object>} chunks
 * @return {Promise<string>}
 */

export const chatWithContext = async (question, chunks) => {
    const context = chunks.map((c, i) => `[Chunk ${i + 1}]\n${c.content}`).join('\n\n')

    const prompt = `Based on the following context from a document, Analyse the context and answer the user's question. If the answer is not in the context, say so.
    
    Context:
    ${context}
    
    Question: ${question}
    
    Answer:`

    try {
        const generatedText = await generateOpenRouter(prompt)
        return generatedText
    } catch (error) {
        console.error("Gemini API error:", error)
        throw new Error('Failed to process chat request')
    }
}

/**
 * Explain a specific concept
 * @param {string} concept
 * @param {string} context
 * @return {Promise<string>}
 */

export const explainConcept = async (concept, context) => {
    const prompt = `Explain the concept of "${concept}" based on the following context.
    Provide a clear, educational explanation that's easy to understand.
    Include example if relevant.
    
    Context:
    ${context.substring(0, 10000)}`

    try {
        const generatedText = await generateOpenRouter(prompt)
        return generatedText
    } catch (error) {
        console.error("Gemini API error:", error)
        throw new Error('Failed to explain concept')
    }
}