"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useToast } from "@/components/ui/use-toast"

// Define the types for our notes
export interface Note {
  id: string
  title: string
  content: string
  lastModified: Date
  tags: string[]
  isFavorite: boolean
  isArchived: boolean
  isDeleted: boolean
}

// Define the context type
interface CloudSyncContextType {
  notes: Note[]
  currentNote: Note | null
  setCurrentNote: (note: Note | null) => void
  saveNote: (note: Note) => Promise<void>
  createNote: (title: string, content: string, tags?: string[]) => Promise<Note>
  deleteNote: (id: string) => Promise<void>
  toggleFavorite: (id: string) => Promise<void>
  archiveNote: (id: string) => Promise<void>
  restoreNote: (id: string) => Promise<void>
  syncStatus: "synced" | "syncing" | "error"
  lastSynced: Date | null
  forceSync: () => Promise<void>
}

// Create the context
const CloudSyncContext = createContext<CloudSyncContextType | undefined>(undefined)

// Provider component
export function CloudSyncProvider({ children }: { children: ReactNode }) {
  const [notes, setNotes] = useState<Note[]>([])
  const [currentNote, setCurrentNote] = useState<Note | null>(null)
  const [syncStatus, setSyncStatus] = useState<"synced" | "syncing" | "error">("synced")
  const [lastSynced, setLastSynced] = useState<Date | null>(null)
  const { toast } = useToast()

  // Load notes from localStorage on initial render
  useEffect(() => {
    const loadNotes = () => {
      try {
        const savedNotes = localStorage.getItem("notes")
        if (savedNotes) {
          const parsedNotes = JSON.parse(savedNotes)
          // Convert string dates back to Date objects
          const notesWithDates = parsedNotes.map((note: any) => ({
            ...note,
            lastModified: new Date(note.lastModified),
          }))
          setNotes(notesWithDates)
        } else {
          // Create a sample note if no notes exist
          const sampleNote: Note = {
            id: "1",
            title: "Project Ideas",
            content: `# Project Ideas for Q2

Here's a list of potential projects to work on in the upcoming quarter:

## Web Development
- Redesign the company website
- Implement a new authentication system
- Create a customer portal

## Mobile App
- Add offline support
- Implement push notifications
- Redesign the user profile screen

## Backend
- Optimize database queries
- Set up a caching layer
- Implement rate limiting

## Data Science
- Create a recommendation engine
- Implement analytics dashboard
- Set up A/B testing framework

## DevOps
- Automate deployment pipeline
- Implement infrastructure as code
- Set up monitoring and alerting

Remember to prioritize these projects based on business impact and resource availability.`,
            lastModified: new Date(),
            tags: ["work", "ideas"],
            isFavorite: true,
            isArchived: false,
            isDeleted: false,
          }
          setNotes([sampleNote])
          setCurrentNote(sampleNote)
          localStorage.setItem("notes", JSON.stringify([sampleNote]))
        }
      } catch (error) {
        console.error("Error loading notes:", error)
        toast({
          title: "Error",
          description: "Failed to load your notes. Please refresh the page.",
          variant: "destructive",
        })
      }
    }

    loadNotes()
  }, [toast])

  // Save notes to localStorage whenever they change
  useEffect(() => {
    if (notes.length > 0) {
      localStorage.setItem("notes", JSON.stringify(notes))
    }
  }, [notes])

  // Simulate cloud sync
  const simulateSync = async (): Promise<void> => {
    setSyncStatus("syncing")

    // Simulate network request
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // 90% chance of success
        if (Math.random() > 0.1) {
          setLastSynced(new Date())
          setSyncStatus("synced")
          resolve()
        } else {
          setSyncStatus("error")
          reject(new Error("Failed to sync with cloud"))
        }
      }, 1500)
    })
  }

  // Force a sync
  const forceSync = async (): Promise<void> => {
    try {
      await simulateSync()
      toast({
        title: "Sync Complete",
        description: "Your notes have been synced to the cloud.",
      })
    } catch (error) {
      toast({
        title: "Sync Failed",
        description: "Failed to sync your notes. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Save a note
  const saveNote = async (note: Note): Promise<void> => {
    try {
      setSyncStatus("syncing")

      // Update the note in the notes array
      const updatedNotes = notes.map((n) => (n.id === note.id ? { ...note, lastModified: new Date() } : n))
      setNotes(updatedNotes)

      // Simulate network delay
      await simulateSync()

      toast({
        title: "Note Saved",
        description: "Your note has been saved and synced.",
      })
    } catch (error) {
      setSyncStatus("error")
      toast({
        title: "Save Failed",
        description: "Your note was saved locally but failed to sync to the cloud.",
        variant: "destructive",
      })
    }
  }

  // Create a new note
  const createNote = async (title: string, content: string, tags: string[] = []): Promise<Note> => {
    try {
      setSyncStatus("syncing")

      const newNote: Note = {
        id: Date.now().toString(),
        title,
        content,
        lastModified: new Date(),
        tags,
        isFavorite: false,
        isArchived: false,
        isDeleted: false,
      }

      setNotes([...notes, newNote])
      setCurrentNote(newNote)

      // Simulate network delay
      await simulateSync()

      toast({
        title: "Note Created",
        description: "Your new note has been created and synced.",
      })

      return newNote
    } catch (error) {
      setSyncStatus("error")
      toast({
        title: "Sync Failed",
        description: "Your note was created locally but failed to sync to the cloud.",
        variant: "destructive",
      })

      // Still return the note even if sync failed
      const newNote: Note = {
        id: Date.now().toString(),
        title,
        content,
        lastModified: new Date(),
        tags,
        isFavorite: false,
        isArchived: false,
        isDeleted: false,
      }

      return newNote
    }
  }

  // Delete a note (soft delete)
  const deleteNote = async (id: string): Promise<void> => {
    try {
      setSyncStatus("syncing")

      const updatedNotes = notes.map((note) =>
        note.id === id ? { ...note, isDeleted: true, lastModified: new Date() } : note,
      )

      setNotes(updatedNotes)

      // If the current note is being deleted, set currentNote to null
      if (currentNote && currentNote.id === id) {
        setCurrentNote(null)
      }

      // Simulate network delay
      await simulateSync()

      toast({
        title: "Note Deleted",
        description: "Your note has been moved to trash.",
      })
    } catch (error) {
      setSyncStatus("error")
      toast({
        title: "Delete Failed",
        description: "Failed to sync deletion to the cloud.",
        variant: "destructive",
      })
    }
  }

  // Toggle favorite status
  const toggleFavorite = async (id: string): Promise<void> => {
    try {
      setSyncStatus("syncing")

      const updatedNotes = notes.map((note) => {
        if (note.id === id) {
          return { ...note, isFavorite: !note.isFavorite, lastModified: new Date() }
        }
        return note
      })

      setNotes(updatedNotes)

      // Update currentNote if it's the one being favorited
      if (currentNote && currentNote.id === id) {
        setCurrentNote({ ...currentNote, isFavorite: !currentNote.isFavorite, lastModified: new Date() })
      }

      // Simulate network delay
      await simulateSync()
    } catch (error) {
      setSyncStatus("error")
      toast({
        title: "Sync Failed",
        description: "Failed to sync changes to the cloud.",
        variant: "destructive",
      })
    }
  }

  // Archive a note
  const archiveNote = async (id: string): Promise<void> => {
    try {
      setSyncStatus("syncing")

      const updatedNotes = notes.map((note) =>
        note.id === id ? { ...note, isArchived: true, lastModified: new Date() } : note,
      )

      setNotes(updatedNotes)

      // If the current note is being archived, set currentNote to null
      if (currentNote && currentNote.id === id) {
        setCurrentNote(null)
      }

      // Simulate network delay
      await simulateSync()

      toast({
        title: "Note Archived",
        description: "Your note has been moved to the archive.",
      })
    } catch (error) {
      setSyncStatus("error")
      toast({
        title: "Archive Failed",
        description: "Failed to sync archiving to the cloud.",
        variant: "destructive",
      })
    }
  }

  // Restore a note from trash or archive
  const restoreNote = async (id: string): Promise<void> => {
    try {
      setSyncStatus("syncing")

      const updatedNotes = notes.map((note) =>
        note.id === id ? { ...note, isDeleted: false, isArchived: false, lastModified: new Date() } : note,
      )

      setNotes(updatedNotes)

      // Simulate network delay
      await simulateSync()

      toast({
        title: "Note Restored",
        description: "Your note has been restored.",
      })
    } catch (error) {
      setSyncStatus("error")
      toast({
        title: "Restore Failed",
        description: "Failed to sync restoration to the cloud.",
        variant: "destructive",
      })
    }
  }

  return (
    <CloudSyncContext.Provider
      value={{
        notes,
        currentNote,
        setCurrentNote,
        saveNote,
        createNote,
        deleteNote,
        toggleFavorite,
        archiveNote,
        restoreNote,
        syncStatus,
        lastSynced,
        forceSync,
      }}
    >
      {children}
    </CloudSyncContext.Provider>
  )
}

// Custom hook to use the cloud sync context
export function useCloudSync() {
  const context = useContext(CloudSyncContext)
  if (context === undefined) {
    throw new Error("useCloudSync must be used within a CloudSyncProvider")
  }
  return context
}

