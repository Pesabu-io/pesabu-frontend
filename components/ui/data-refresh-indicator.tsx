import { Button } from "@/components/ui/button"
import { Loader2, RefreshCw, CheckCircle2 } from "lucide-react"
// Simple date formatting function (replacing date-fns dependency)
const formatDistanceToNow = (date: Date) => {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)
  
  if (diffMins < 1) return "just now"
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
  return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
}

interface DataRefreshIndicatorProps {
  lastUpdated: Date | null
  isRefreshing?: boolean
  onRefresh?: () => void
  className?: string
}

export const DataRefreshIndicator = ({
  lastUpdated,
  isRefreshing = false,
  onRefresh,
  className = ""
}: DataRefreshIndicatorProps) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {isRefreshing ? (
        <>
          <Loader2 className="h-3 w-3 animate-spin text-primary" />
          <span className="text-xs text-muted-foreground">Refreshing...</span>
        </>
      ) : (
        <>
          <CheckCircle2 className="h-3 w-3 text-green-500" />
          <span className="text-xs text-muted-foreground">
            {lastUpdated 
              ? `Updated ${formatDistanceToNow(lastUpdated, { addSuffix: true })}`
              : "No data"
            }
          </span>
        </>
      )}
      {onRefresh && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onRefresh}
          disabled={isRefreshing}
          className="h-6 px-2"
        >
          <RefreshCw className={`h-3 w-3 ${isRefreshing ? 'animate-spin' : ''}`} />
        </Button>
      )}
    </div>
  )
}
