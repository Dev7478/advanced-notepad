"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Image,
  Link,
  Code,
  Save,
  Share,
  Download,
  Sparkles,
  Undo,
  Redo,
  AlignLeft,
  AlignCenter,
  AlignRight,
  ChevronDown,
  CheckSquare,
  Lightbulb,
  AlertCircle,
} from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { AIAssistantPanel } from "@/components/ai-assistant-panel"
import { TextChecker } from "@/components/text-checker"
import { AISuggestions } from "@/components/ai-suggestions"
import { useCloudSync } from "@/components/cloud-sync-provider"
import { SyncStatus } from "@/components/sync-status"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function NoteEditor() {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [isEditing, setIsEditing] = useState(true)
  const [activeAITool, setActiveAITool] = useState<"none" | "assistant" | "checker" | "suggestions">("none")
  const [autoSaveTimer, setAutoSaveTimer] = useState<NodeJS.Timeout | null>(null)
  const { toast } = useToast()
  const { currentNote, saveNote } = useCloudSync()
  const contentRef = useRef(content)

  // Update content ref when it changes
  useEffect(() => {
    contentRef.current = content
  }, [content])

  // Load the current note when it changes
  useEffect(() => {
    if (currentNote) {
      setTitle(currentNote.title)
      setContent(currentNote.content)
    } else {
      setTitle("")
      setContent("")
    }
  }, [currentNote])

  // Set up auto-save
  useEffect(() => {
    // Clear any existing timer
    if (autoSaveTimer) {
      clearTimeout(autoSaveTimer)
    }

    // Only set up auto-save if we have a current note and changes
    if (currentNote && (title !== currentNote.title || content !== currentNote.content)) {
      const timer = setTimeout(() => {
        handleSave()
      }, 3000) // Auto-save after 3 seconds of inactivity

      setAutoSaveTimer(timer)
    }

    // Clean up the timer when component unmounts
    return () => {
      if (autoSaveTimer) {
        clearTimeout(autoSaveTimer)
      }
    }
  }, [title, content, currentNote])

  const handleSave = async () => {
    if (!currentNote) return

    try {
      await saveNote({
        ...currentNote,
        title,
        content: contentRef.current,
        lastModified: new Date(),
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save your note. Please try again.",
        variant: "destructive",
      })
    }
  }

  const toggleAITool = (tool: "assistant" | "checker" | "suggestions") => {
    setActiveAITool((prev) => (prev === tool ? "none" : tool))
  }

  const handleApplyChanges = (newContent: string) => {
    setContent(newContent)
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      <div className="border-b p-4">
        <div className="flex items-center justify-between mb-2">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-xl font-medium border-none px-0 focus-visible:ring-0"
            placeholder="Note title"
          />
          <div className="flex items-center gap-2">
            <SyncStatus />
            <Button variant="outline" size="sm" onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center space-x-1">
            <Button variant="ghost" size="icon">
              <Bold className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Italic className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Underline className="h-4 w-4" />
            </Button>
            <Separator orientation="vertical" className="mx-1 h-6" />
            <Button variant="ghost" size="icon">
              <AlignLeft className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <AlignCenter className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <AlignRight className="h-4 w-4" />
            </Button>
            <Separator orientation="vertical" className="mx-1 h-6" />
            <Button variant="ghost" size="icon">
              <List className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <ListOrdered className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <CheckSquare className="h-4 w-4" />
            </Button>
            <Separator orientation="vertical" className="mx-1 h-6" />
            <Button variant="ghost" size="icon">
              <Image className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Link className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Code className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon">
              <Undo className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Redo className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="edit" className="flex-1 flex flex-col">
        <div className="border-b px-4">
          <TabsList>
            <TabsTrigger value="edit" onClick={() => setIsEditing(true)}>
              Edit
            </TabsTrigger>
            <TabsTrigger value="preview" onClick={() => setIsEditing(false)}>
              Preview
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="edit" className="flex-1 p-0 m-0">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-full resize-none p-4 border-none focus-visible:ring-0 rounded-none"
            placeholder="Start writing your note..."
          />
        </TabsContent>

        <TabsContent value="preview" className="flex-1 p-4 m-0 overflow-auto prose dark:prose-invert max-w-none">
          <div dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }} />
        </TabsContent>
      </Tabs>

      <div className="border-t p-4 flex justify-between">
        <div className="flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Sparkles className="mr-2 h-4 w-4" />
                AI Tools
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => toggleAITool("assistant")}>
                <Sparkles className="mr-2 h-4 w-4" />
                {activeAITool === "assistant" ? "Hide AI Assistant" : "Show AI Assistant"}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toggleAITool("checker")}>
                <AlertCircle className="mr-2 h-4 w-4" />
                {activeAITool === "checker" ? "Hide Text Checker" : "Check Spelling & Grammar"}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toggleAITool("suggestions")}>
                <Lightbulb className="mr-2 h-4 w-4" />
                {activeAITool === "suggestions" ? "Hide AI Suggestions" : "Get Writing Suggestions"}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setContent(content.replace(/- /g, "- ✅ "))
                }}
              >
                <CheckSquare className="mr-2 h-4 w-4" />
                Add Checkboxes
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Share className="mr-2 h-4 w-4" />
            Share
          </Button>
        </div>
      </div>

      {activeAITool === "assistant" && (
        <div className="border-t p-4">
          <AIAssistantPanel content={content} onApplyChanges={handleApplyChanges} />
        </div>
      )}

      {activeAITool === "checker" && (
        <div className="border-t p-4">
          <TextChecker content={content} onApplyCorrection={handleApplyChanges} />
        </div>
      )}

      {activeAITool === "suggestions" && (
        <div className="border-t p-4">
          <AISuggestions content={content} onApplySuggestion={handleApplyChanges} />
        </div>
      )}
    </div>
  )
}

// Simple markdown renderer (in a real app, you'd use a proper markdown library)
function renderMarkdown(markdown: string) {
  // This is a very simplified markdown renderer
  let html = markdown
    .replace(/^# (.*$)/gm, "<h1>$1</h1>")
    .replace(/^## (.*$)/gm, "<h2>$1</h2>")
    .replace(/^### (.*$)/gm, "<h3>$1</h3>")
    .replace(/\*\*(.*)\*\*/gm, "<strong>$1</strong>")
    .replace(/\*(.*)\*/gm, "<em>$1</em>")
    .replace(
      /- ✅ (.*)/gm,
      "<li class='flex items-center'><span class='inline-block w-4 h-4 mr-2 bg-green-500 rounded-sm'></span>$1</li>",
    )
    .replace(/- (.*)/gm, "<li>$1</li>")
    .replace(/\n\n/gm, "<br/>")

  // Wrap lists
  html = html.replace(/<li>.*?<\/li>/gs, (match) => {
    return `<ul>${match}</ul>`
  })

  return html
}

