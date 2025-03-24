"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Filter, MoreVertical, Star, StarOff, Plus } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { useCloudSync } from "@/components/cloud-sync-provider"
import { useToast } from "@/components/ui/use-toast"

export function NotesList() {
  const { notes, currentNote, setCurrentNote, toggleFavorite, archiveNote, deleteNote, createNote } = useCloudSync()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const { toast } = useToast()

  // Get all unique tags from notes
  const allTags = Array.from(new Set(notes.filter((note) => !note.isDeleted).flatMap((note) => note.tags)))

  // Filter notes based on search term, selected tag, and not deleted
  const filteredNotes = notes
    .filter((note) => !note.isDeleted && !note.isArchived)
    .filter(
      (note) =>
        searchTerm === "" ||
        note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.content.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .filter((note) => selectedTag === null || note.tags.includes(selectedTag))
    .sort((a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime())

  const handleCreateNote = async () => {
    try {
      await createNote("New Note", "# New Note\n\nStart writing here...", ["personal"])
      toast({
        title: "Note Created",
        description: "A new note has been created.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create a new note.",
        variant: "destructive",
      })
    }
  }

  const formatDate = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 1) return "Just now"
    if (diffMins < 60) return `${diffMins} min${diffMins === 1 ? "" : "s"} ago`
    if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`
    if (diffDays < 7) return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`

    return date.toLocaleDateString()
  }

  return (
    <div className="w-80 border-r flex flex-col h-full">
      <div className="p-4 border-b">
        <div className="flex items-center gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search notes..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setSelectedTag(null)}>All Notes</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedTag("work")}>Work</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedTag("personal")}>Personal</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedTag("ideas")}>Ideas</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button size="icon" onClick={handleCreateNote}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          <Badge
            variant={selectedTag === null ? "secondary" : "outline"}
            className="whitespace-nowrap cursor-pointer"
            onClick={() => setSelectedTag(null)}
          >
            All Notes
          </Badge>
          {allTags.map((tag) => (
            <Badge
              key={tag}
              variant={selectedTag === tag ? "secondary" : "outline"}
              className="whitespace-nowrap cursor-pointer"
              onClick={() => setSelectedTag(tag)}
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="divide-y">
          {filteredNotes.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              {searchTerm ? "No notes match your search" : "No notes found"}
            </div>
          ) : (
            filteredNotes.map((note) => (
              <div
                key={note.id}
                className={`p-4 cursor-pointer hover:bg-muted/50 ${currentNote?.id === note.id ? "bg-muted" : ""}`}
                onClick={() => setCurrentNote(note)}
              >
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-medium truncate">{note.title}</h3>
                  <div className="flex items-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleFavorite(note.id)
                      }}
                    >
                      {note.isFavorite ? (
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ) : (
                        <StarOff className="h-4 w-4" />
                      )}
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation()
                            // Implement rename functionality
                            toast({
                              title: "Rename",
                              description: "Rename functionality would be implemented here.",
                            })
                          }}
                        >
                          Rename
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation()
                            // Implement duplicate functionality
                            toast({
                              title: "Duplicate",
                              description: "Duplicate functionality would be implemented here.",
                            })
                          }}
                        >
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation()
                            // Implement share functionality
                            toast({
                              title: "Share",
                              description: "Share functionality would be implemented here.",
                            })
                          }}
                        >
                          Share
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation()
                            archiveNote(note.id)
                          }}
                        >
                          Move to Archive
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteNote(note.id)
                          }}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{note.content.replace(/[#*_]/g, "")}</p>
                <div className="flex justify-between items-center">
                  <div className="flex gap-1">
                    {note.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">{formatDate(new Date(note.lastModified))}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

