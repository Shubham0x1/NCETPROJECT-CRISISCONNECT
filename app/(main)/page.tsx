// Corrected File: /app/(main)/page.tsx

"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, MapPin, Users, Clock, Plus } from "lucide-react"
import Link from "next/link"
// import { Header } from "@/components/header" // <-- THIS LINE IS REMOVED
import { Footer } from "@/components/footer"

// Mock data for incidents (Your data is preserved)
const mockIncidents = [
  {
    id: 1,
    type: "Fire",
    description: "House fire on Oak Street",
    location: "123 Oak Street",
    distance: "0.5 miles",
    timeReported: "15 minutes ago",
    status: "In Progress",
    severity: "high",
  },
  {
    id: 2,
    type: "Power Outage",
    description: "Power outage affecting downtown area",
    location: "Downtown District",
    distance: "1.2 miles",
    timeReported: "1 hour ago",
    status: "Pending",
    severity: "medium",
  },
  {
    id: 3,
    type: "Flood",
    description: "Street flooding due to broken water main",
    location: "Main Street & 5th Ave",
    distance: "2.1 miles",
    timeReported: "3 hours ago",
    status: "Resolved",
    severity: "low",
  },
]

// Your helper functions are preserved
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

export default function HomePage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [userName, setUserName] = useState("")
  const [userLocations, setUserLocations] = useState<Array<{ state: string; city: string; district: string }>>([])

  useEffect(() => {
    const authStatus = localStorage.getItem("isAuthenticated") === "true"

    if (!authStatus) {
      router.push("/auth") // Redirect if not authenticated
    } else {
      setIsAuthenticated(true)
      const userData = localStorage.getItem("userData")
      if (userData) {
        const parsedUserData = JSON.parse(userData)
        setUserName(parsedUserData.name || "User")
        setUserLocations(parsedUserData.locations || [])
      } else {
        setUserName("User")
        setUserLocations([])
      }
      setIsLoading(false)
    }
  }, [router])

  // We show a loading state while we check authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* <Header />  <-- THIS LINE IS REMOVED */}

      {/* --- ALL OF YOUR ORIGINAL UI IS PRESERVED BELOW --- */}
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Card className="mb-8 bg-card border-border">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-foreground">Welcome back, {userName}</CardTitle>
              <CardDescription className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                Your saved locations:{" "}
                {userLocations.length > 0
                  ? userLocations.map((loc) => `${loc.city}, ${loc.state}`).join("; ")
                  : "No locations saved"}
              </CardDescription>
            </CardHeader>
          </Card>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        >
          <Link href="/report">
            <Button className="w-full h-16 text-lg bg-primary hover:bg-primary/90 text-primary-foreground">
              <Plus className="mr-2 h-6 w-6" />
              Report Problem
            </Button>
          </Link>
          <Link href="/nearby">
            <Button
              variant="outline"
              className="w-full h-16 text-lg border-border hover:bg-accent hover:text-accent-foreground bg-transparent"
            >
              <MapPin className="mr-2 h-6 w-6" />
              View Nearby Incidents
            </Button>
          </Link>
          <Link href="/contributions">
            <Button
              variant="outline"
              className="w-full h-16 text-lg border-border hover:bg-secondary hover:text-secondary-foreground bg-transparent"
            >
              <Users className="mr-2 h-6 w-6" />
              My Contributions
            </Button>
          </Link>
        </motion.div>

        {/* Real-time Incident Feed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <AlertTriangle className="h-5 w-5 text-primary" />
                Recent Incidents
              </CardTitle>
              <CardDescription className="text-muted-foreground">Live updates from your community</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockIncidents.map((incident, index) => (
                <motion.div
                  key={incident.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-start justify-between p-4 rounded-lg border border-border bg-background hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={getSeverityColor(incident.severity)}>{incident.type}</Badge>
                      <Badge variant="outline" className={getStatusColor(incident.status)}>
                        {incident.status}
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-foreground mb-1">{incident.description}</h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {incident.location} • {incident.distance}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {incident.timeReported}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Map Placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8"
        >
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Community Map</CardTitle>
              <CardDescription className="text-muted-foreground">View incidents in your area</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <MapPin className="h-12 w-12 mx-auto mb-2" />
                  <p>Interactive map will be integrated here</p>
                  <p className="text-sm">Google Maps API integration coming soon</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>

      <Footer />
    </div>
  )
}
