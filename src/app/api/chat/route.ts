import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? '')

const SYSTEM_PROMPT = `You are ChefMii Assistant, a helpful AI for the ChefMii private chef booking platform.
ChefMii connects clients with professional private chefs for any occasion — from home dinners to corporate events.

You help users:
- Find the right chef for their event
- Understand pricing and packages
- Learn about cuisines and menu options
- Navigate the booking process
- Answer questions about ChefMii services

Be friendly, concise, and professional. Keep responses under 3 sentences unless more detail is needed.
Always suggest booking a chef when appropriate.`

export async function POST(request: NextRequest) {
    try {
        const { message } = await request.json()

        if (!message) {
            return NextResponse.json({ error: 'Message required' }, { status: 400 })
        }

        const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

        const result = await model.generateContent([SYSTEM_PROMPT, message])
        const reply = result.response.text()

        return NextResponse.json({ reply })
    } catch (error) {
        console.error('Gemini chat error:', error)
        return NextResponse.json(
            { reply: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment." },
            { status: 500 }
        )
    }
}
