"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Heart, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { volunteerForIncident, unvolunteerFromIncident } from "@/lib/contributionApi"

interface VolunteerButtonProps {
  incidentId: string
  isVolunteering?: boolean
  onUpdate?: () => void
  variant?: "default" | "outline" | "secondary"
  size?: "default" | "sm" | "lg"
}

export function VolunteerButton({ 
  incidentId, 
  isVolunteering = false, 
  onUpdate, 
  variant = "default",
  size = "default"
}: VolunteerButtonProps) {
  const [loading, setLoading] = useState(false)
  const [volunteered, setVolunteered] = useState(isVolunteering)
  const { toast } = useToast()

  const handleClick = async () => {
    setLoading(true)
    try {
      if (volunteered) {
        await unvolunteerFromIncident(incidentId)
        setVolunteered(false)
        toast({
          title: "Removed Volunteer Status",
          description: "You've been removed from this incident.",
        })
      } else {
        await volunteerForIncident(incidentId)
        setVolunteered(true)
        toast({
          title: "✓ Volunteered Successfully!",
          description: "You've been added as a volunteer for this incident.",
        })
      }
      
      // Call the onUpdate callback if provided
      if (onUpdate) {
        onUpdate()
      }
    } catch (error: any) {
      console.error('Volunteer action error:', error)
      toast({
        title: "Error",
        description: error.message || "Failed to update volunteer status. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button 
      onClick={handleClick} 
      disabled={loading}
      variant={volunteered ? "outline" : variant}
      size={size}
      className={volunteered ? "border-primary text-primary" : ""}
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : volunteered ? (
        <>
          <Heart className="mr-2 h-4 w-4 fill-current" />
          Volunteering
        </>
      ) : (
        <>
          <Heart className="mr-2 h-4 w-4" />
          Volunteer
        </>
      )}
    </Button>
  )
}

