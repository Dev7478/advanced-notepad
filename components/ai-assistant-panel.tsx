"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { Sparkles, Wand2, FileText, Zap, MessageSquare, Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface AIAssistantPanelProps {
  content: string
  onApplyChanges: (newContent: string) => void
}

export function AIAssistantPanel({ content, onApplyChanges }: AIAssistantPanelProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedContent, setGeneratedContent] = useState("")
  const [activeTab, setActiveTab] = useState("summarize")
  const { toast } = useToast()

  const generateAIContent = async (action: string) => {
    setIsGenerating(true)
    setGeneratedContent("")

    try {
      // Simulate AI generation with different responses based on the action
      setTimeout(() => {
        let result = ""

        switch (action) {
          case "summarize":
            result = `## Summary of Your Note

This note outlines potential projects for Q2 across several domains:

- **Web Development**: Website redesign, authentication system, and customer portal
- **Mobile App**: Offline support, push notifications, and UI redesign
- **Backend**: Database optimization, caching, and rate limiting
- **Data Science**: Recommendation engine, analytics, and A/B testing
- **DevOps**: Deployment automation, infrastructure as code, and monitoring

The note emphasizes prioritizing projects based on business impact and resource availability.`
            break

          case "expand":
            result =
              content +
              `\n\n## Additional Project Ideas

### Web Development
- Implement a progressive web app (PWA) version of the site
- Add internationalization (i18n) support
- Improve site accessibility to WCAG AA standards

### Mobile App
- Add biometric authentication
- Implement dark mode support
- Create a widget for quick access

### Backend
- Set up a GraphQL API layer
- Implement webhook integrations
- Add comprehensive logging and monitoring

### Data Science
- Create personalized user journeys
- Implement predictive analytics
- Set up data visualization dashboards

### DevOps
- Implement blue/green deployments
- Set up disaster recovery procedures
- Create development environment parity`
            break

          case "improve":
            result = content
              .replace(/- /g, "- ✅ ")
              .replace("Remember to prioritize", "**Remember** to prioritize")
              .replace("Web Development", "**Web Development**")
              .replace("Mobile App", "**Mobile App**")
              .replace("Backend", "**Backend**")
              .replace("Data Science", "**Data Science**")
              .replace("DevOps", "**DevOps**")
            break

          case "brainstorm":
            result = `## Brainstorming Session Results

### Key Insights
- The projects span multiple domains, showing a holistic approach to development
- There's a good balance between user-facing and infrastructure improvements
- The list covers both new features and technical debt/improvements

### Suggested Prioritization Framework
1. **Impact vs. Effort Matrix**
   - High Impact, Low Effort: Quick wins (e.g., caching layer)
   - High Impact, High Effort: Strategic projects (e.g., recommendation engine)
   - Low Impact, Low Effort: Fill-in tasks
   - Low Impact, High Effort: Reconsider or postpone

2. **Dependency Mapping**
   - Some projects may unlock others (e.g., authentication system enables customer portal)
   - Create a dependency graph to optimize the sequence

3. **Resource Allocation**
   - Group projects by team/skill requirements
   - Ensure balanced workload across teams

### Next Steps
1. Score each project on impact and effort (1-5 scale)
2. Map dependencies between projects
3. Create a draft timeline with milestones
4. Get stakeholder feedback on priorities`
            break
        }

        setGeneratedContent(result)
        setIsGenerating(false)

        toast({
          title: "AI Content Generated",
          description: `Successfully generated ${action} content.`,
        })
      }, 2000)

      // In a real implementation, you would use the AI SDK like this:
      /*
      const { text } = await generateText({
        model: openai("gpt-4o"),
        prompt: `${getPromptForAction(action, content)}`,
        system: "You are an AI assistant helping with note-taking. Provide helpful, concise responses.",
      })
      setGeneratedContent(text)
      */
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate AI content. Please try again.",
        variant: "destructive",
      })
      setIsGenerating(false)
    }
  }

  const handleApplyChanges = () => {
    onApplyChanges(generatedContent)
    toast({
      title: "Changes Applied",
      description: "AI-generated content has been applied to your note.",
    })
  }

  const handleAppendChanges = () => {
    onApplyChanges(content + "\n\n" + generatedContent)
    toast({
      title: "Content Appended",
      description: "AI-generated content has been appended to your note.",
    })
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <Sparkles className="h-5 w-5 mr-2 text-primary" />
              AI Assistant
            </CardTitle>
            <CardDescription>Let AI help you with your notes</CardDescription>
          </div>
          <Badge variant="outline" className="px-2">
            <Zap className="h-3 w-3 mr-1 text-yellow-500" />
            Powered by AI
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="summarize" onClick={() => setActiveTab("summarize")}>
              <FileText className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Summarize</span>
            </TabsTrigger>
            <TabsTrigger value="expand" onClick={() => setActiveTab("expand")}>
              <Wand2 className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Expand</span>
            </TabsTrigger>
            <TabsTrigger value="improve" onClick={() => setActiveTab("improve")}>
              <Zap className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Improve</span>
            </TabsTrigger>
            <TabsTrigger value="brainstorm" onClick={() => setActiveTab("brainstorm")}>
              <MessageSquare className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Brainstorm</span>
            </TabsTrigger>
          </TabsList>

          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              {activeTab === "summarize" && "Create a concise summary of your note."}
              {activeTab === "expand" && "Generate additional content based on your note."}
              {activeTab === "improve" && "Enhance the formatting and clarity of your note."}
              {activeTab === "brainstorm" && "Generate ideas and insights related to your note."}
            </div>

            <Button onClick={() => generateAIContent(activeTab)} disabled={isGenerating} className="w-full">
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate{" "}
                  {activeTab === "summarize"
                    ? "Summary"
                    : activeTab === "expand"
                      ? "Additional Content"
                      : activeTab === "improve"
                        ? "Improvements"
                        : "Ideas"}
                </>
              )}
            </Button>

            {generatedContent && (
              <div className="mt-4">
                <div className="border rounded-md p-4 bg-muted/30 min-h-[200px] max-h-[300px] overflow-y-auto">
                  <div className="whitespace-pre-wrap">{generatedContent}</div>
                </div>
              </div>
            )}
          </div>
        </Tabs>
      </CardContent>
      {generatedContent && (
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handleAppendChanges}>
            Append to Note
          </Button>
          <Button onClick={handleApplyChanges}>Replace Note Content</Button>
        </CardFooter>
      )}
    </Card>
  )
}

