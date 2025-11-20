import { streamText } from 'ai'

export const runtime = 'nodejs'

interface MessageParam {
  role: 'user' | 'assistant'
  content: string
}

export async function POST(request: Request) {
  try {
    const { messages, userType } = await request.json()

    const systemPrompt = buildSystemPrompt(userType)

    const result = streamText({
      model: 'openai/gpt-5-mini',
      system: systemPrompt,
      messages: messages as MessageParam[],
      temperature: 0.7,
      maxTokens: 1024,
    })

    return result.toUIMessageStreamResponse()
  } catch (error) {
    console.error('[v0] Error in /api/nijix:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to process request' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}

function buildSystemPrompt(userType?: string): string {
  const basePrompt = `You are Nijix, a friendly and professional AI assistant for kids, students, workers, managers, traders, and business owners. You provide personalized advice based on the user's role.`

  const rolePrompts: { [key: string]: string } = {
    kid: `${basePrompt} You are speaking to a child. Keep your language simple, friendly, and age-appropriate. Use examples they can relate to.`,
    student: `${basePrompt} You are speaking to a student. Provide educational insights, study tips, and career guidance. Encourage critical thinking.`,
    worker: `${basePrompt} You are speaking to an employee. Give practical career advice, productivity tips, and professional development guidance.`,
    manager: `${basePrompt} You are speaking to a manager. Focus on leadership, team management, conflict resolution, and organizational skills.`,
    trader: `${basePrompt} You are speaking to a trader. Provide market insights, risk management strategies, and trading best practices.`,
    business: `${basePrompt} You are speaking to a business owner. Offer entrepreneurship advice, business strategy, financial management, and growth tactics.`,
  }

  return rolePrompts[userType?.toLowerCase() || ''] || basePrompt
}
