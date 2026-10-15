'use client'

import { createContext, useCallback, useContext, useEffect, useRef, useState, startTransition, type ReactNode } from 'react'
import { CheckCircle2, CircleAlert, Info, Undo2, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const DEFAULT_DURATION_MS = 3000
const UNDO_DELAY_MS = 5000

type ToastTone = 'success' | 'error' | 'info'

type ToastItem = {
    id: number
    message: string
    tone: ToastTone
    duration: number
    /** Set on "undo" toasts: shows an Annuler button and a countdown bar. */
    onUndo?: () => void
}

type ScheduleDeleteOptions = {
    /** Unique key of the item being deleted, e.g. "vehicle-12". */
    key: string
    /** Shown while the deletion can still be undone. */
    pendingMessage: string
    /** Shown once the deletion actually went through. */
    doneMessage: string
    run: () => Promise<void>
}

type ToastContextValue = {
    toast: (message: string, options?: { tone?: ToastTone; duration?: number }) => void
    /**
     * Hides the item right away and only really deletes it after a few seconds,
     * so the admin can still change their mind with the Annuler button.
     */
    scheduleDelete: (options: ScheduleDeleteOptions) => void
    isPendingDelete: (key: string) => boolean
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function useToast() {
    const context = useContext(ToastContext)
    if (!context) throw new Error('useToast must be used inside <ToastProvider>')
    return context
}

export default function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<ToastItem[]>([])
    const [pendingDeletes, setPendingDeletes] = useState<ReadonlySet<string>>(new Set())
    const nextId = useRef(0)
    const deleteTimers = useRef(new Map<string, ReturnType<typeof setTimeout>>())

    const dismiss = useCallback((id: number) => {
        setToasts((current) => current.filter((item) => item.id !== id))
    }, [])

    const push = useCallback((item: Omit<ToastItem, 'id'>) => {
        const id = nextId.current++
        setToasts((current) => [...current, { ...item, id }])
        return id
    }, [])

    const toast = useCallback<ToastContextValue['toast']>(
        (message, options) => {
            push({ message, tone: options?.tone ?? 'success', duration: options?.duration ?? DEFAULT_DURATION_MS })
        },
        [push],
    )

    const setPending = useCallback((key: string, pending: boolean) => {
        setPendingDeletes((current) => {
            const next = new Set(current)
            if (pending) next.add(key)
            else next.delete(key)
            return next
        })
    }, [])

    const scheduleDelete = useCallback<ToastContextValue['scheduleDelete']>(
        ({ key, pendingMessage, doneMessage, run }) => {
            if (deleteTimers.current.has(key)) return
            setPending(key, true)

            const toastId = push({
                message: pendingMessage,
                tone: 'info',
                duration: UNDO_DELAY_MS,
                onUndo: () => {
                    clearTimeout(deleteTimers.current.get(key))
                    deleteTimers.current.delete(key)
                    setPending(key, false)
                    dismiss(toastId)
                    toast('Suppression annulée', { tone: 'info', duration: 2000 })
                },
            })

            const timer = setTimeout(() => {
                deleteTimers.current.delete(key)
                dismiss(toastId)
                startTransition(async () => {
                    try {
                        await run()
                        // The key stays in the pending set: the row is gone for good, and
                        // removing it could flash the row back before the page refreshes.
                        toast(doneMessage)
                    } catch {
                        setPending(key, false)
                        toast('La suppression a échoué. Réessayez.', { tone: 'error', duration: 5000 })
                    }
                })
            }, UNDO_DELAY_MS)
            deleteTimers.current.set(key, timer)
        },
        [dismiss, push, setPending, toast],
    )

    const isPendingDelete = useCallback((key: string) => pendingDeletes.has(key), [pendingDeletes])

    return (
        <ToastContext.Provider value={{ toast, scheduleDelete, isPendingDelete }}>
            {children}
            <div
                aria-live="polite"
                className="pointer-events-none fixed top-5 right-5 z-50 flex w-[calc(100%-2rem)] max-w-sm flex-col gap-2 max-[850px]:top-16 max-[850px]:right-4"
            >
                {toasts.map((item) => (
                    <Toast key={item.id} item={item} onDismiss={dismiss} />
                ))}
            </div>
        </ToastContext.Provider>
    )
}

const TONE_ICON = { success: CheckCircle2, error: CircleAlert, info: Info }
const TONE_ICON_CLASS = { success: 'text-green-600', error: 'text-destructive', info: 'text-muted-foreground' }

function Toast({ item, onDismiss }: { item: ToastItem; onDismiss: (id: number) => void }) {
    const Icon = TONE_ICON[item.tone]

    // Undo toasts are closed by the provider when the delay runs out.
    useEffect(() => {
        if (item.onUndo) return
        const timer = setTimeout(() => onDismiss(item.id), item.duration)
        return () => clearTimeout(timer)
    }, [item, onDismiss])

    return (
        <div
            role={item.tone === 'error' ? 'alert' : 'status'}
            className="pointer-events-auto relative flex items-center gap-3 overflow-hidden rounded-xl border border-border bg-card py-3 pr-3 pl-4 text-sm font-medium text-foreground shadow-lg animate-in fade-in slide-in-from-right-4"
        >
            <Icon className={cn('size-4.5 shrink-0', TONE_ICON_CLASS[item.tone])} />
            <span className="flex-1">{item.message}</span>
            {item.onUndo ? (
                <button
                    type="button"
                    onClick={item.onUndo}
                    className="flex shrink-0 items-center gap-1.5 rounded-lg bg-foreground px-3 py-1.5 text-xs font-semibold text-background transition-opacity hover:opacity-85"
                >
                    <Undo2 className="size-3.5" />
                    Annuler
                </button>
            ) : (
                <button type="button" onClick={() => onDismiss(item.id)} className="shrink-0 text-muted-foreground hover:text-foreground">
                    <X className="size-4" />
                    <span className="sr-only">Fermer</span>
                </button>
            )}
            {item.onUndo && (
                <span
                    aria-hidden
                    className="absolute bottom-0 left-0 h-0.5 w-full origin-left bg-foreground/60"
                    style={{ animation: `toast-countdown ${item.duration}ms linear forwards` }}
                />
            )}
        </div>
    )
}
