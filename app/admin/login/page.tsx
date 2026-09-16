'use client'

import { useState, type SubmitEvent } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
        <div className="relative flex min-h-screen items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/30" />
            <Image src="/why-cover.png" alt="" fill priority className="object-cover -z-20" />
            
            <Card className="relative z-10 w-full max-w-sm">
                <CardHeader>
                    <CardTitle>Connexion administrateur</CardTitle>
                </CardHeader>
                <CardContent>
                        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="email">Email</Label>
                                    <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)}/>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="password">Mot de passe</Label>
                                    <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)}/>
                            </div>

                            {error && <p>{error}</p>}
                            <Button type="submit" disabled={sending}>{sending ? 'Connexion..' : 'Se connecter'}</Button>
                        </form>
                </CardContent>
            </Card>
        </div>
    )
}