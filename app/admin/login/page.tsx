'use client'

import { useState, type SubmitEvent } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Image from 'next/image'

export default function AdminLoginPage() {
    const router = useRouter()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [sending, setSending] = useState(false)

    const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
        event.preventDefault()
        setError('')
        setSending(true)
        try {
            const supabase = createClient()
            const { error: signInError } = await supabase.auth.signInWithPassword({
                email,
                password,
            })

            if (signInError) {
                setError('Email ou mot de passe incorrect.')
                return
            }
            router.push('/admin')
            router.refresh()
        } finally {
            setSending(false)
        }
    }

    return (
        <div className="flex h-screen overflow-hidden">
            {/* Left: full-height cover photo, hidden on small screens */}
            <div className="relative hidden w-3/5 md:block">
                <Image
                    src="/why-cover.jpg"
                    alt=""
                    fill
                    priority
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 p-10">
                    <span className="text-2xl font-semibold text-white">Planète Auto</span>
                    <span className="max-w-xs text-sm text-white/70">
                        Espace pour gérer les véhicules et les demandes reçues sur le site.
                    </span>
                </div>
            </div>

            {/* Right: login form */}
            <div className="flex w-full flex-col items-center justify-center bg-background px-6 md:w-2/5">
                <div className="w-full max-w-sm">
                    <div className="mb-8 flex flex-col gap-1.5 md:hidden">
                        <span className="text-xl font-semibold text-foreground">Planète Auto</span>
                    </div>

                    <div className="mb-12 flex flex-col gap-3">
                        <h1 className="text-3xl font-semibold text-foreground">Connexion administrateur</h1>
                        <p className="text-base text-muted-foreground">
                            Connectez-vous pour accéder à l&apos;espace de gestion.
                        </p>
                    </div>

                    <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="email" className="text-base">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="h-11 text-base"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="password" className="text-base">Mot de passe</Label>
                            <Input
                                id="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="h-11 text-base"
                            />
                        </div>

                        {error && (
                            <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                                {error}
                            </p>
                        )}

                        <Button type="submit" disabled={sending} className="mt-2 h-11 w-full text-base">
                            {sending ? 'Connexion...' : 'Se connecter'}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    )
}
