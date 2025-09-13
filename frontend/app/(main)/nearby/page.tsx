"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { Footer } from "@/components/footer"
import { MapPin, Clock, Users, Heart, ArrowLeft, CheckCircle, Navigation } from "lucide-react"
import Link from "next/link"

// Mock data for nearby incidents
const nearbyIncidents = [
  {
    id: 1,
    type: "Fire",
    description: "House fire on Oak Street - multiple units responding",
    location: "123 Oak Street",
    coordinates: { lat: 40.7128, lng: -74.006 },
    distance: "0.5 miles",
    timeReported: "15 minutes ago",
    status: "In Progress",
    severity: "high",
    volunteersNeeded: 3,
    volunteersAssigned: 1,
    isVolunteering: false,
  },
  {
    id: 2,
    type: "Power Outage",
    description: "Power outage affecting downtown area - traffic lights down",
    location: "Downtown District",
    coordinates: { lat: 40.7589, lng: -73.9851 },
    distance: "1.2 miles",
    timeReported: "1 hour ago",
    status: "Pending",
    severity: "medium",
    volunteersNeeded: 2,
    volunteersAssigned: 0,
    isVolunteering: false,
  },
  {
    id: 3,
    type: "Flood",
    description: "Street flooding due to broken water main",
    location: "Main Street & 5th Ave",
    coordinates: { lat: 40.7505, lng: -73.9934 },
    distance: "2.1 miles",
    timeReported: "3 hours ago",
    status: "Resolved",
    severity: "low",
    volunteersNeeded: 1,
    volunteersAssigned: 1,
    isVolunteering: false,
  },
  {
    id: 4,
    type: "Accident",
    description: "Multi-vehicle accident blocking intersection",
    location: "Broadway & 42nd Street",
    coordinates: { lat: 40.758, lng: -73.9855 },
    distance: "0.8 miles",
    timeReported: "30 minutes ago",
    status: "In Progress",
    severity: "high",
    volunteersNeeded: 4,
    volunteersAssigned: 2,
    isVolunteering: false,
  },
  {
    id: 5,
    type: "Medical",
    description: "Medical emergency - first aid assistance needed",
    location: "Central Park East",
    coordinates: { lat: 40.7829, lng: -73.9654 },
    distance: "1.5 miles",
    timeReported: "45 minutes ago",
    status: "Pending",
    severity: "medium",
    volunteersNeeded: 2,
    volunteersAssigned: 0,
    isVolunteering: false,
  },
]

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case "high":
      return "bg-destructive text-destructive-foreground"
    case "medium":
      return "bg-primary text-primary-foreground"
    case "low":
      return "bg-secondary text-secondary-foreground"
    default:
      return "bg-muted text-muted-foreground"
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "Resolved":
      return "bg-green-100 text-green-800"
    case "In Progress":
      return "bg-yellow-100 text-yellow-800"
    case "Pending":
      return "bg-red-100 text-red-800"
    default:
      return "bg-muted text-muted-foreground"
  }
}

const getMapPinColor = (severity: string) => {
  switch (severity) {
    case "high":
      return "#ef4444" // red
    case "medium":
      return "#d97706" // amber
    case "low":
      return "#0891b2" // cyan
    default:
      return "#6b7280" // gray
  }
}

export default function NearbyPage() {
  const { toast } = useToast()
  const [incidents, setIncidents] = useState(nearbyIncidents)
  const [selectedIncident, setSelectedIncident] = useState<(typeof nearbyIncidents)[0] | null>(null)
  const [showVolunteerModal, setShowVolunteerModal] = useState(false)
  const [isVolunteering, setIsVolunteering] = useState(false)

  const handleVolunteerClick = (incident: (typeof nearbyIncidents)[0]) => {
    setSelectedIncident(incident)
    setShowVolunteerModal(true)
  }

  const confirmVolunteer = async () => {
    if (!selectedIncident) return

    setIsVolunteering(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Update the incident
    setIncidents((prev) =>
      prev.map((incident) =>
        incident.id === selectedIncident.id
          ? {
              ...incident,
              isVolunteering: true,
              volunteersAssigned: incident.volunteersAssigned + 1,
            }
          : incident,
      ),
    )

    setIsVolunteering(false)
    setShowVolunteerModal(false)

    toast({
      title: "Thank you for volunteering!",
      description: `You've been assigned to help with the ${selectedIncident.type.toLowerCase()} incident.`,
    })

    setSelectedIncident(null)
  }

  return (
    <div className="min-h-screen bg-background">

      <main className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6"
        >
          <Link href="/">
            <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
        </motion.div>

        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 rounded-full bg-accent/10">
              <MapPin className="h-8 w-8 text-accent" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Nearby Incidents</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            View and volunteer for incidents in your area. Your help can make a difference in your community.
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Map Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-2"
          >
            <Card className="bg-card border-border h-[600px]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Navigation className="h-5 w-5 text-accent" />
                  Incident Map
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Interactive map showing nearby incidents with severity indicators
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[500px]">
                <div className="h-full bg-muted rounded-lg border border-border flex flex-col items-center justify-center relative overflow-hidden">
                  {/* Map Placeholder with Pins */}
                  <div className="absolute inset-4 bg-gradient-to-br from-blue-50 to-green-50 rounded-lg">
                    {/* Simulated Map Pins */}
                    {incidents.map((incident, index) => (
                      <motion.div
                        key={incident.id}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="absolute"
                        style={{
                          left: `${20 + ((index * 15) % 60)}%`,
                          top: `${20 + ((index * 20) % 50)}%`,
                        }}
                      >
                        <div
                          className="w-6 h-6 rounded-full border-2 border-white shadow-lg cursor-pointer hover:scale-110 transition-transform"
                          style={{ backgroundColor: getMapPinColor(incident.severity) }}
                          title={`${incident.type} - ${incident.location}`}
                        />
                      </motion.div>
                    ))}
                  </div>

                  <div className="text-center text-muted-foreground z-10">
                    <MapPin className="h-12 w-12 mx-auto mb-2" />
                    <p className="text-lg font-medium">Interactive Map</p>
                    <p className="text-sm">Google Maps integration with incident pins</p>
                  </div>

                  {/* Legend */}
                  <div className="absolute bottom-4 left-4 bg-background/90 backdrop-blur-sm rounded-lg p-3 border border-border">
                    <p className="text-xs font-medium text-foreground mb-2">Severity Levels</p>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-destructive" />
                        <span className="text-xs text-muted-foreground">High</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-primary" />
                        <span className="text-xs text-muted-foreground">Medium</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-secondary" />
                        <span className="text-xs text-muted-foreground">Low</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Incidents List */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-4"
          >
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Active Incidents</CardTitle>
                <CardDescription className="text-muted-foreground">
                  {incidents.filter((i) => i.status !== "Resolved").length} incidents need assistance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 max-h-[500px] overflow-y-auto">
                {incidents.map((incident, index) => (
                  <motion.div
                    key={incident.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="p-4 rounded-lg border border-border bg-background hover:bg-muted/50 transition-colors"
                  >
                    <div className="space-y-3">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <Badge className={getSeverityColor(incident.severity)}>{incident.type}</Badge>
                          <Badge variant="outline" className={getStatusColor(incident.status)}>
                            {incident.status}
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">{incident.distance}</div>
                      </div>

                      {/* Description */}
                      <p className="text-sm font-medium text-foreground">{incident.description}</p>

                      {/* Location and Time */}
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {incident.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {incident.timeReported}
                        </span>
                      </div>

                      {/* Volunteers */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Users className="h-3 w-3" />
                          <span>
                            {incident.volunteersAssigned}/{incident.volunteersNeeded} volunteers
                          </span>
                        </div>

                        {/* Volunteer Button */}
                        {incident.status !== "Resolved" && (
                          <Button
                            size="sm"
                            variant={incident.isVolunteering ? "secondary" : "default"}
                            disabled={incident.isVolunteering}
                            onClick={() => handleVolunteerClick(incident)}
                            className="h-8 text-xs hover:scale-105 transition-transform"
                          >
                            {incident.isVolunteering ? (
                              <>
                                <CheckCircle className="mr-1 h-3 w-3" />
                                Volunteering
                              </>
                            ) : (
                              <>
                                <Heart className="mr-1 h-3 w-3" />I Will Help
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>

      {/* Volunteer Confirmation Modal */}
      <AnimatePresence>
        {showVolunteerModal && selectedIncident && (
          <Dialog open={showVolunteerModal} onOpenChange={setShowVolunteerModal}>
            <DialogContent className="sm:max-w-md">
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-primary" />
                    Volunteer Confirmation
                  </DialogTitle>
                  <DialogDescription>Are you sure you want to volunteer for this incident?</DialogDescription>
                </DialogHeader>

                <div className="py-4">
                  <div className="p-4 bg-muted rounded-lg space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge className={getSeverityColor(selectedIncident.severity)}>{selectedIncident.type}</Badge>
                      <Badge variant="outline" className={getStatusColor(selectedIncident.status)}>
                        {selectedIncident.status}
                      </Badge>
                    </div>
                    <p className="text-sm font-medium">{selectedIncident.description}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {selectedIncident.location} • {selectedIncident.distance}
                    </p>
                  </div>
                </div>

                <DialogFooter className="gap-2">
                  <Button variant="outline" onClick={() => setShowVolunteerModal(false)} disabled={isVolunteering}>
                    Cancel
                  </Button>
                  <Button
                    onClick={confirmVolunteer}
                    disabled={isVolunteering}
                    className="bg-primary hover:bg-primary/90"
                  >
                    {isVolunteering ? (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                        Confirming...
                      </motion.div>
                    ) : (
                      <>
                        <Heart className="mr-2 h-4 w-4" />
                        Yes, I'll Help
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </motion.div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  )
}
