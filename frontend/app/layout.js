import './globals.css'

export const metadata = {
  title: 'Job Agent AI',
  description: 'Your AI-powered job hunting assistant',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}