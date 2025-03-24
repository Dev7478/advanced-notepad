import { NotesList } from "@/components/notes-list"
import { NoteEditor } from "@/components/note-editor"
import { CloudSyncProvider } from "@/components/cloud-sync-provider"

export default function NotesPage() {
  return (
    <CloudSyncProvider>
    <div className="flex h-full">
      <NotesList />
      <NoteEditor />
    </div>
    </CloudSyncProvider>
  )
}
