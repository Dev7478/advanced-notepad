"use client"

import { useCloudSync } from "@/components/cloud-sync-provider"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipProvider,
  TooltipContent,
  TooltipTrigger
} from "@/components/ui/tooltip"
import { CheckCircle2, CloudOff, RefreshCw, Loader2 } from "lucide-react"
import { useState } from "react"

export function SyncStatus() {
  const { syncStatus, lastSynced, forceSync } = useCloudSync()
  const [isSyncing, setIsSyncing] = useState(false)

  const handleSync = async () => {
    setIsSyncing(true)
    try {
      await forceSync()
    } finally {
      setIsSyncing(false)
    }
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={handleSync} disabled={isSyncing}>
            {isSyncing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : syncStatus === "synced" ? (
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            ) : syncStatus === "syncing" ? (
              <RefreshCw className="h-4 w-4 text-yellow-500 animate-spin" />
            ) : (
              <CloudOff className="h-4 w-4 text-destructive" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <div className="text-xs">
            {syncStatus === "synced" && (
              <>
                <p>All changes synced</p>
                {lastSynced && <p className="text-muted-foreground">Last synced: {lastSynced.toLocaleTimeString()}</p>}
              </>
            )}
            {syncStatus === "syncing" && <p>Syncing changes...</p>}
            {syncStatus === "error" && <p>Sync failed. Click to retry.</p>}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
