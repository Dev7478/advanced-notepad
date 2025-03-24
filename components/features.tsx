import {
  CloudIcon as CloudSync,
  FileText,
  Search,
  Users,
  Sparkles,
  Calendar,
  Palette,
  Wifi,
  Lock,
  Tag,
} from "lucide-react"

export function Features() {
  const features = [
    {
      icon: <CloudSync className="h-6 w-6" />,
      title: "Cloud Sync & Backup",
      description: "Automatic sync across devices with secure cloud backups for easy recovery.",
    },
    {
      icon: <FileText className="h-6 w-6" />,
      title: "Markdown Support",
      description: "Powerful markdown editor with live preview and export to multiple formats.",
    },
    {
      icon: <Tag className="h-6 w-6" />,
      title: "Rich Text Editing",
      description: "Customize fonts, colors, and add multimedia elements to your notes.",
    },
    {
      icon: <Search className="h-6 w-6" />,
      title: "Advanced Search",
      description: "Find notes quickly with filters for date, tags, and keywords.",
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Collaboration",
      description: "Share notes with others for real-time editing with version history.",
    },
    {
      icon: <Sparkles className="h-6 w-6" />,
      title: "AI-Powered Features",
      description: "Auto-summarization, writing suggestions, and insights extraction.",
    },
    {
      icon: <Calendar className="h-6 w-6" />,
      title: "Tasks & Reminders",
      description: "Add tasks with deadlines and get notification reminders.",
    },
    {
      icon: <Palette className="h-6 w-6" />,
      title: "Customization",
      description: "Choose from custom themes and layouts to personalize your experience.",
    },
    {
      icon: <Wifi className="h-6 w-6" />,
      title: "Offline Access",
      description: "Work offline with seamless synchronization when back online.",
    },
    {
      icon: <Lock className="h-6 w-6" />,
      title: "Security",
      description: "End-to-end encryption with biometric or password protection.",
    },
  ]

  return (
    <section id="features" className="py-16 bg-muted/30">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tighter">Advanced Features</h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            Everything you need for efficient note-taking and organization
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-background rounded-lg p-6 shadow-sm border">
              <div className="text-primary mb-4">{feature.icon}</div>
              <h3 className="text-lg font-medium mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

