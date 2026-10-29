type GeminiResponse = {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string }>
    }
  }>
}

export default defineEventHandler(async (event) => {
  // This temporary check should only run locally.
  if (!import.meta.dev) {
    throw createError({ statusCode: 404 })
  }

  const config = useRuntimeConfig(event)

  if (!config.geminiApiKey) {
    throw createError({
      statusCode: 500,
      statusMessage: 'The Gemini API key is not configured.',
    })
  }

  let response: GeminiResponse

  try {
    response = await $fetch<GeminiResponse>(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent',
      {
        method: 'POST',
        headers: {
          'x-goog-api-key': config.geminiApiKey,
        },
        body: {
          contents: [
            {
              parts: [
                { text: 'Reply with one short sentence confirming you can help write a company insights blog.' },
              ],
            },
          ],
        },
        timeout: 60_000,
        retry: 0,
      },
    )
   } catch (error: unknown) {
    const failure = error as {
      response?: { status?: number }
      data?: { error?: { status?: string } }
      cause?: { code?: string }
    }

    throw createError({
      statusCode: 502,
      statusMessage: 'Gemini connection check failed.',
      data: {
        upstreamStatus: failure.response?.status ?? null,
        providerStatus: failure.data?.error?.status ?? null,
        connectionCode: failure.cause?.code ?? null,
      },
    })
  }

  const text = response.candidates?.[0]?.content?.parts
    ?.map((part) => part.text ?? '')
    .join('')
    .trim()

  if (!text) {
    throw createError({
      statusCode: 502,
      statusMessage: 'Gemini returned no text.',
    })
  }

  return { text }
})