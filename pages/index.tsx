import Link from 'next/link'
import Head from 'next/head'

export default function Home() {
  return (
    <div className="container">
      <Head>
        <title>The Author</title>
        <link rel="manifest" href="/manifest.json" />
      </Head>
      <header className="header">
        <h1>The Author</h1>
        <nav className="nav">
          <Link href="/chat"><a>Chat</a></Link>
          <Link href="/image-tools"><a>Image Tools</a></Link>
          <Link href="/writer"><a>Writer</a></Link>
        </nav>
      </header>

      <main>
        <section>
          <h2>Welcome</h2>
          <p>
            This is a Vercel-ready Next.js + TypeScript PWA scaffold for "The Author". Use the
            Chat, Image Tools and Writer tabs to explore.
          </p>
        </section>

        <section>
          <h3>Quick Links</h3>
          <ul>
            <li><Link href="/chat"><a>Chat UI</a></Link></li>
            <li><Link href="/image-tools"><a>Image Tools (Tesseract OCR & Text-to-Image)</a></Link></li>
            <li><Link href="/writer"><a>Writer templates & generation</a></Link></li>
          </ul>
        </section>
      </main>

      <footer>
        <small>Installable PWA. Add GEMINI_API_KEY in Vercel env vars to enable generation.</small>
      </footer>
    </div>
  )
}
