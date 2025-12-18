import { AlertCircle, RefreshCw, HelpCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useState } from "react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

interface ErrorStateProps {
  title?: string
  message: string
  error?: Error | string
  onRetry?: () => void
  showDetails?: boolean
  className?: string
}

export const ErrorState = ({
  title = "Something went wrong",
  message,
  error,
  onRetry,
  showDetails = true,
  className = ""
}: ErrorStateProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const errorMessage = error instanceof Error ? error.message : error

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-destructive" />
          <CardTitle>{title}</CardTitle>
        </div>
        <CardDescription>{message}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {errorMessage && showDetails && (
          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2">
                <HelpCircle className="h-4 w-4" />
                {isOpen ? "Hide" : "Show"} error details
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <Alert variant="destructive" className="mt-2">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error Details</AlertTitle>
                <AlertDescription className="font-mono text-xs mt-2">
                  {errorMessage}
                </AlertDescription>
              </Alert>
            </CollapsibleContent>
          </Collapsible>
        )}

        <div className="flex gap-2">
          {onRetry && (
            <Button onClick={onRetry} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
          )}
          <Button variant="outline" onClick={() => window.location.reload()}>
            Refresh Page
          </Button>
        </div>

        <div className="text-sm text-muted-foreground space-y-1">
          <p className="font-medium">What you can do:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Check your internet connection</li>
            <li>Verify the data is available</li>
            <li>Try again in a few moments</li>
            {onRetry && <li>Contact support if the issue persists</li>}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}

