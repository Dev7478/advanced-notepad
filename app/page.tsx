import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { Features } from "@/components/features"
import { PricingSection } from "@/components/pricing-section"


export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl">
            <span className="text-primary">NoteSync</span>
          </div>
          <nav className="hidden md:flex gap-6">
            <Link href="#features" className="text-sm font-medium hover:underline underline-offset-4">
              Features
            </Link>
            <Link href="#pricing" className="text-sm font-medium hover:underline underline-offset-4">
              Pricing
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Log in
              </Button>
            </Link>
            <Link href="/login">
              <Button size="sm">Sign up</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="py-20 md:py-32 bg-gradient-to-b from-background to-muted/30">
          <div className="container px-4 md:px-6 text-center">
            <div className="space-y-4 md:space-y-6 max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tighter">Your ideas deserve the best notepad</h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                Capture, organize, and collaborate on your notes with our advanced notepad application. Featuring cloud
                sync, markdown support, and AI-powered features.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/login">
                  <Button size="lg" className="w-full sm:w-auto">
                    Get Started <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/app/notes">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    Try Demo
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <Features />
        <PricingSection />
      </main>
      <footer className="border-t py-6 md:py-10">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="text-sm text-muted-foreground">© 2024 NoteSync. All rights reserved.</div>
          <nav className="flex gap-4 text-sm text-muted-foreground">
            <Link href="#" className="hover:underline underline-offset-4">
              Terms
            </Link>
            <Link href="#" className="hover:underline underline-offset-4">
              Privacy
            </Link>
            <Link href="#" className="hover:underline underline-offset-4">
              Contact
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}

