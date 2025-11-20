export async function sendMessageToNijix(
  messages: Array<{ role: 'user' | 'assistant'; content: string }>,
  userType?: string
) {
  try {
    const response = await fetch('/api/nijix', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages,
        userType,
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to get response from Nijix')
    }

    return response
  } catch (error) {
    console.error('Error communicating with Nijix:', error)
    throw error
  }
}
