import { createClient } from '@/lib/supabase/server'

/**
 * Throws unless the request comes from a logged-in admin.
 * Server actions can be called by a direct POST request, not only from the admin UI,
 * so every admin action must call this first (see Next.js "Mutating data" docs).
 */
export async function requireAdmin() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        throw new Error('Non autorisé : veuillez vous reconnecter.')
    }
    return user
}
