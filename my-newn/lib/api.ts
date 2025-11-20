export async function sendMessageToNijix(message: string, userType?: string) {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        userType,
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to get response from Nijix')
    }

    const data = await response.json()
    return data.reply
  } catch (error) {
    console.error('Error communicating with Nijix:', error)
    throw error
  }
}
