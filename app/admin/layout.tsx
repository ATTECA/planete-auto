import './admin.css'

export default function AdminRootLayout({ children }: { children: React.ReactNode}) {
    return <div className="admin-app font-sans">{children}</div>
}