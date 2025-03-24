"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Lightbulb, Loader2, MessageSquare, Sparkles } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface AISuggestionsProps {
  content: string
  onApplySuggestion: (suggestion: string) => void
}

interface Suggestion {
  id: string
  type: "completion" | "improvement" | "tone" | "clarity"
  text: string
  context?: string
  confidence: number
}

export function AISuggestions({ content, onApplySuggestion }: AISuggestionsProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [autoSuggest, setAutoSuggest] = useState(false)
  const { toast } = useToast()
  const contentRef = useRef(content)
  const autoSuggestRef = useRef(autoSuggest)

  // Update refs when props change
  useEffect(() => {
    contentRef.current = content
    autoSuggestRef.current = autoSuggest
  }, [content, autoSuggest])

  // Generate suggestions when content changes (if autoSuggest is enabled)
  useEffect(() => {
    let debounceTimer: NodeJS.Timeout | null = null

    if (autoSuggest && content.trim().length > 50) {
      debounceTimer = setTimeout(() => {
        generateSuggestions()
      }, 2000)
    }

    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer)
      }
    }
  }, [content, autoSuggest])

  const generateSuggestions = async () => {
    // Use the current content from ref to avoid stale closures
    const currentContent = contentRef.current

    if (!currentContent.trim()) {
      toast({
        title: "Empty Content",
        description: "Please add some text before generating suggestions.",
      })
      return
    }

    setIsGenerating(true)

    try {
      // Simulate API call for generating suggestions
      setTimeout(() => {
        // Mock suggestions for demonstration
        const mockSuggestions: Suggestion[] = [
          {
            id: "1",
            type: "completion",
            text: "Consider adding a section on cross-functional collaboration to ensure project success.",
            confidence: 0.85,
          },
          {
            id: "2",
            type: "improvement",
            text: "For the Mobile App section, you might want to include accessibility features as a priority item.",
            context: "Mobile App",
            confidence: 0.92,
          },
          {
            id: "3",
            type: "tone",
            text: "The note has a professional tone. Consider adding more action-oriented language to inspire urgency.",
            confidence: 0.78,
          },
          {
            id: "4",
            type: "clarity",
            text: "The 'Data Science' section could benefit from more specific metrics or KPIs to track success.",
            context: "Data Science",
            confidence: 0.88,
          },
        ]

        setSuggestions(mockSuggestions)
        setIsGenerating(false)

        if (autoSuggestRef.current) {
          toast({
            title: "New Suggestions Available",
            description: `AI has generated ${mockSuggestions.length} suggestions for your note.`,
          })
        }
      }, 1500)

      // In a real implementation, you would use the AI SDK like this:
      /*
      const { text } = await generateText({
        model: openai("gpt-4o"),
        prompt: `Generate helpful writing suggestions for the following text: ${currentContent}`,
        system: "You are an AI writing assistant. Provide helpful, concise suggestions to improve the text.",
      })
      
      // Parse the response and extract suggestions
      const parsedSuggestions = parseSuggestions(text)
      setSuggestions(parsedSuggestions)
      */
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate suggestions. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleApplySuggestion = (suggestion: Suggestion) => {
    // Use the current content from ref to avoid stale closures
    const currentContent = contentRef.current
    let newText = ""

    switch (suggestion.type) {
      case "completion":
        newText = currentContent + "\n\n" + suggestion.text
        break
      case "improvement":
      case "clarity":
        if (suggestion.context && currentContent.includes(suggestion.context)) {
          // Try to insert the suggestion after the relevant section
          const contextIndex = currentContent.indexOf(suggestion.context)
          const sectionEnd = currentContent.indexOf("\n\n", contextIndex)

          if (sectionEnd !== -1) {
            newText =
              currentContent.substring(0, sectionEnd) + "\n" + suggestion.text + currentContent.substring(sectionEnd)
          } else {
            // If can't find section end, just append
            newText = currentContent + "\n\n" + suggestion.text
          }
        } else {
          // If no context or context not found, just append
          newText = currentContent + "\n\n" + suggestion.text
        }
        break
      case "tone":
        // For tone suggestions, just show a toast with the suggestion
        toast({
          title: "Tone Suggestion",
          description: suggestion.text,
        })
        return
      default:
        newText = currentContent + "\n\n" + suggestion.text
    }

    onApplySuggestion(newText)

    // Remove the applied suggestion
    setSuggestions(suggestions.filter((s) => s.id !== suggestion.id))

    toast({
      title: "Suggestion Applied",
      description: "The AI suggestion has been applied to your note.",
    })
  }

  // Get badge color based on confidence
  const getConfidenceBadge = (confidence: number) => {
    if (confidence >= 0.9) return "bg-green-500"
    if (confidence >= 0.7) return "bg-yellow-500"
    return "bg-blue-500"
  }

  // Get icon based on suggestion type
  const getSuggestionIcon = (type: Suggestion["type"]) => {
    switch (type) {
      case "completion":
        return <MessageSquare className="h-4 w-4" />
      case "improvement":
        return <Sparkles className="h-4 w-4" />
      case "tone":
        return <Lightbulb className="h-4 w-4" />
      case "clarity":
        return <Sparkles className="h-4 w-4" />
      default:
        return <Sparkles className="h-4 w-4" />
    }
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl flex items-center">
            <Lightbulb className="h-5 w-5 mr-2 text-yellow-500" />
            AI Suggestions
          </CardTitle>
          <div className="flex gap-2 items-center">
            <div className="flex items-center space-x-2">
              <label
                htmlFor="auto-suggest"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Auto-suggest
              </label>
              <input
                type="checkbox"
                id="auto-suggest"
                checked={autoSuggest}
                onChange={() => setAutoSuggest(!autoSuggest)}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
            </div>
            <Button variant="outline" size="sm" onClick={generateSuggestions} disabled={isGenerating}>
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Thinking...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Get Suggestions
                </>
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isGenerating ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Generating suggestions...</span>
          </div>
        ) : suggestions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <div className="flex flex-col items-center">
              <Lightbulb className="h-8 w-8 mb-2 text-yellow-500" />
              <p>AI will suggest improvements as you write.</p>
              <p className="text-sm mt-1">Click "Get Suggestions" or enable auto-suggest.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {suggestions.map((suggestion) => (
              <div key={suggestion.id} className="border rounded-md p-3">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center">
                    <span className="mr-2 text-primary">{getSuggestionIcon(suggestion.type)}</span>
                    <span className="font-medium capitalize">{suggestion.type}</span>
                  </div>
                  <Badge variant="outline" className={`${getConfidenceBadge(suggestion.confidence)} text-white`}>
                    {Math.round(suggestion.confidence * 100)}% confidence
                  </Badge>
                </div>

                {suggestion.context && (
                  <div className="mb-2">
                    <p className="text-xs text-muted-foreground">Related to: {suggestion.context}</p>
                  </div>
                )}

                <div className="mb-3">
                  <p className="text-sm">{suggestion.text}</p>
                </div>

                <div className="flex justify-end">
                  <Button size="sm" onClick={() => handleApplySuggestion(suggestion)}>
                    Apply Suggestion
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

