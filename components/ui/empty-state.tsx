import { LucideIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
}

export const EmptyState = ({ 
  icon: Icon, 
  title, 
  description, 
  action,
  className = "" 
}: EmptyStateProps) => (
  <Card className={`border-dashed ${className}`}>
    <CardContent className="pt-12 pb-12">
      <div className="flex flex-col items-center justify-center text-center space-y-4">
        <div className="rounded-full bg-muted p-4">
          <Icon className="h-8 w-8 text-muted-foreground" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-sm text-muted-foreground max-w-sm">{description}</p>
        </div>
        {action && (
          <Button onClick={action.onClick} className="mt-4">
            {action.label}
          </Button>
        )}
      </div>
    </CardContent>
  </Card>
)

