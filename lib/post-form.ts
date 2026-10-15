const GARAGE_PHONE = '04 67 82 54 12'
const TIMEOUT_MS = 60_000

/**
 * Sends a form to one of our /api routes and throws an Error whose message tells the
 * visitor what actually went wrong (no connection, too slow, files too heavy, server error…).
 * JSON bodies are sent as JSON, FormData as multipart.
 */
export async function postForm(url: string, body: Record<string, unknown> | FormData): Promise<void> {
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    throw new Error('Vous semblez hors ligne. Vérifiez votre connexion internet puis réessayez.')
  }

  let response: Response
  try {
    response = await fetch(url, {
      method: 'POST',
      ...(body instanceof FormData
        ? { body }
        : { headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    })
  } catch (error) {
    if (error instanceof DOMException && error.name === 'TimeoutError') {
      throw new Error(
        `Le serveur met trop de temps à répondre. Votre connexion est peut-être lente : réessayez, ou appelez-nous au ${GARAGE_PHONE}.`,
      )
    }
    throw new Error('Impossible de joindre notre serveur. Vérifiez votre connexion internet puis réessayez.')
  }

  if (response.ok) return

  if (response.status === 413) {
    throw new Error('Vos fichiers sont trop lourds pour être envoyés. Retirez quelques photos et réessayez.')
  }

  const result = (await response.json().catch(() => null)) as { error?: unknown } | null
  if (result && typeof result.error === 'string') throw new Error(result.error)

  if (response.status >= 500) {
    throw new Error(
      `Notre serveur rencontre un problème (erreur ${response.status}). Réessayez dans quelques minutes ou appelez-nous au ${GARAGE_PHONE}.`,
    )
  }
  throw new Error(`Votre demande a été refusée (erreur ${response.status}). Rechargez la page et réessayez.`)
}
