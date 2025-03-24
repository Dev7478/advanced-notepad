"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, Check, Lightbulb, Loader2, Sparkles, Wand2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface TextCheckerProps {
  content: string
  onApplyCorrection: (newContent: string) => void
}

interface TextIssue {
  id: string
  type: "spelling" | "grammar" | "style"
  text: string
  position: { start: number; end: number }
  suggestions: string[]
  severity: "error" | "warning" | "suggestion"
}

export function TextChecker({ content, onApplyCorrection }: TextCheckerProps) {
  const [isChecking, setIsChecking] = useState(false)
  const [activeTab, setActiveTab] = useState<"all" | "spelling" | "grammar" | "style">("all")
  const [issues, setIssues] = useState<TextIssue[]>([])
  const { toast } = useToast()

  // Function to check text for issues
  const checkText = useCallback(async () => {
    if (!content.trim()) {
      toast({
        title: "Empty Content",
        description: "Please add some text before checking.",
        variant: "destructive",
      })
      return
    }

    setIsChecking(true)
    setIssues([])

    try {
      // Simulate API call for text checking
      setTimeout(() => {
        const mockIssues: TextIssue[] = [
          {
            id: "1",
            type: "spelling",
            text: "teh",
            position: { start: content.indexOf("teh"), end: content.indexOf("teh") + 3 },
            suggestions: ["the", "tech"],
            severity: "error",
          },
          {
            id: "2",
            type: "grammar",
            text: "company website",
            position: {
              start: content.indexOf("company website"),
              end: content.indexOf("company website") + 15,
            },
            suggestions: ["company's website"],
            severity: "warning",
          },
          {
            id: "3",
            type: "style",
            text: "Implement a new authentication system",
            position: {
              start: content.indexOf("Implement a new authentication system"),
              end: content.indexOf("Implement a new authentication system") + 37,
            },
            suggestions: ["Develop a robust authentication system"],
            severity: "suggestion",
          },
        ].filter((issue) => issue.position.start !== -1) // Filter out any issues with invalid positions 

        setIssues(mockIssues)
        setIsChecking(false)

        if (mockIssues.length === 0) {
          toast({
            title: "No Issues Found",
            description: "Your text looks good! No spelling or grammar issues detected.",
          })
        } else {
          toast({
            title: "Check Complete",
            description: `Found ${mockIssues.length} potential issues in your text.`,
          })
        }
      }, 1500)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to check your text. Please try again.",
        variant: "destructive",
      })
      setIsChecking(false)
    }
  }, [content, toast])

  // Filter issues based on active tab
  const filteredIssues = issues.filter((issue) => activeTab === "all" || issue.type === activeTab)

  // Apply a single correction
  const applyCorrection = (issue: TextIssue, suggestion: string) => {
    const { start, end } = issue.position
    const newContent = content.substring(0, start) + suggestion + content.substring(end)
    onApplyCorrection(newContent)

    // Remove the fixed issue from the list
    setIssues(issues.filter((i) => i.id !== issue.id))

    toast({
      title: "Correction Applied",
      description: `Changed "${issue.text}" to "${suggestion}"`,
    })
  }

  // Apply all corrections at once
  const applyAllCorrections = () => {
    let newContent = content

    // Sort issues by position (from end to start to avoid position shifts)
    const sortedIssues = [...issues].sort((a, b) => b.position.start - a.position.start)

    for (const issue of sortedIssues) {
      const { start, end } = issue.position
      const suggestion = issue.suggestions[0] // Use the first suggestion
      newContent = newContent.substring(0, start) + suggestion + newContent.substring(end)
    }

    onApplyCorrection(newContent)
    setIssues([])

    toast({
      title: "All Corrections Applied",
      description: `Fixed ${issues.length} issues in your text.`,
    })
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl flex items-center">
            <Sparkles className="h-5 w-5 mr-2 text-primary" />
            Text Checker
          </CardTitle>
          <Button variant="outline" size="sm" onClick={checkText} disabled={isChecking}>
            {isChecking ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Checking...
              </>
            ) : (
              <>
                <Check className="mr-2 h-4 w-4" />
                Check Text
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="w-full">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="all">All ({issues.length})</TabsTrigger>
            <TabsTrigger value="spelling">Spelling ({issues.filter((i) => i.type === "spelling").length})</TabsTrigger>
            <TabsTrigger value="grammar">Grammar ({issues.filter((i) => i.type === "grammar").length})</TabsTrigger>
            <TabsTrigger value="style">Style ({issues.filter((i) => i.type === "style").length})</TabsTrigger>
          </TabsList>

          {isChecking ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Checking your text...</span>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredIssues.map((issue) => (
                <div key={issue.id} className="border rounded-md p-3">
                  <div className="flex items-start justify-between mb-2">
                    <span className="font-medium capitalize">{issue.type} Issue</span>
                    <Badge variant={issue.severity === "error" ? "destructive" : "outline"}>{issue.severity}</Badge>
                  </div>
                  <p className="text-sm">Found: "{issue.text}"</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {issue.suggestions.map((suggestion, index) => (
                      <Button key={index} variant="outline" size="sm" onClick={() => applyCorrection(issue, suggestion)}>
                        {suggestion}
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Tabs>
      </CardContent>
    </Card>
  )
}
