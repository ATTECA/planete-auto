import './admin.css'

export default function AdminRootLayout({ children }: { children: React.ReactNode}) {
    return <div className="font-sans">{children}</div>
}