// frontend/app/(main)/nearby/page.tsx
"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { Footer } from "@/components/footer"
import { MapPin, Clock, Users, Heart, ArrowLeft, CheckCircle, Navigation, Loader2 } from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from 'date-fns'
import dynamic from 'next/dynamic'

// --- DYNAMICALLY IMPORT THE MAP COMPONENT ---
const Map = dynamic(() => import('@/components/Map'), { 
  ssr: false,
  loading: () => (
    <div className="h-full flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="ml-2">Loading Map...</span>
    </div>
  )
});

// Define a type for the incident data
interface Incident {
  _id: string;
  category: string;
  description: string;
  address: string;
  status: string;
  createdAt: string;
  volunteers: string[];
  location: {
    type: 'Point';
    coordinates: [number, number];
  };
  volunteersNeeded?: number; 
}

// Helper functions remain the same
const getSeverity = (category: string) => {
    switch (category) {
        case "Fire": case "Accident": return "high";
        case "Medical Emergency": case "Power Outage": return "medium";
        default: return "low";
    }
}
const getSeverityColor = (severity: string) => {
  switch (severity) {
    case "high": return "bg-destructive text-destructive-foreground";
    case "medium": return "bg-primary text-primary-foreground";
    case "low": return "bg-secondary text-secondary-foreground";
    default: return "bg-muted text-muted-foreground";
  }
}
const getStatusColor = (status: string) => {
  switch (status) {
    case "Resolved": return "bg-green-100 text-green-800";
    case "In Progress": return "bg-yellow-100 text-yellow-800";
    case "Pending": return "bg-red-100 text-red-800";
    default: return "bg-muted text-muted-foreground";
  }
}

export default function NearbyPage() {
  const { toast } = useToast()
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null)
  const [showVolunteerModal, setShowVolunteerModal] = useState(false)
  const [isVolunteering, setIsVolunteering] = useState(false)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([28.5355, 77.3910]); // Default [lat, lng]

  useEffect(() => {
    const userData = localStorage.getItem("userData");
    if(userData) setCurrentUserId(JSON.parse(userData).id);

    const fetchIncidents = () => {
      const token = localStorage.getItem("token")
      if (!token) {
        setError("Please log in to view nearby incidents.")
        setIsLoading(false)
        return
      }
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords
          setMapCenter([latitude, longitude]);
          try {
            const response = await fetch(`/api/incidents/nearby?lat=${latitude}&lng=${longitude}`, { headers: { Authorization: `Bearer ${token}` } })
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to fetch incidents.");
            }
            const data = await response.json()
            setIncidents(data)
          } catch (err: any) { setError(err.message) } 
          finally { setIsLoading(false) }
        },
        () => {
          setError("Unable to retrieve your location. Please enable location services.")
          setIsLoading(false)
        }
      )
    }
    fetchIncidents()
  }, [])

  const handleVolunteerClick = (incident: Incident) => {
    setSelectedIncident(incident)
    setShowVolunteerModal(true)
  }

  const confirmVolunteer = async () => {
    if (!selectedIncident) return

    setIsVolunteering(true)
    const token = localStorage.getItem("token")
    
    try {
        if (!token) throw new Error("Authentication error. Please log in again.");
        const response = await fetch(`/api/incidents/${selectedIncident._id}/volunteer`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Could not volunteer for the incident.");
        }

        setIncidents((prev) =>
            prev.map((incident) =>
            incident._id === selectedIncident._id
                ? { ...incident, volunteers: [...incident.volunteers, currentUserId || ''] }
                : incident
            )
        );
        
        toast({
            title: "Thank you for volunteering!",
            description: `You've been assigned to help with the ${selectedIncident.category.toLowerCase()} incident.`,
        });

    } catch(err: any) {
        toast({ title: "Error", description: err.message, variant: "destructive" })
    } finally {
        setIsVolunteering(false)
        setShowVolunteerModal(false)
        setSelectedIncident(null)
    }
  }

  if (isLoading) {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
            <p className="ml-2">Loading nearby incidents...</p>
        </div>
    )
  }

  if (error) {
    return (
        <div className="min-h-screen flex items-center justify-center text-destructive">
            <p>Error: {error}</p>
        </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }} className="mb-6" >
            <Link href="/">
                <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Dashboard
                </Button>
            </Link>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center mb-8" >
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="lg:col-span-2" >
            <Card className="bg-card border-border h-[600px]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Navigation className="h-5 w-5 text-accent" /> Incident Map
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Live map showing nearby incidents
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[500px] p-0">
                <Map incidents={incidents} center={mapCenter} />
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="space-y-4">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Active Incidents</CardTitle>
                <CardDescription className="text-muted-foreground">
                  {incidents.filter((i) => i.status !== "Resolved").length} incidents need assistance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 max-h-[500px] overflow-y-auto">
                {incidents.map((incident, index) => {
                    const severity = getSeverity(incident.category);
                    const isVolunteering = currentUserId ? incident.volunteers.includes(currentUserId) : false;
                    
                    return (
                        <motion.div key={incident._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: index * 0.05 }} className="p-4 rounded-lg border border-border bg-background hover:bg-muted/50 transition-colors">
                           <div className="space-y-3">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-2">
                                        <Badge className={getSeverityColor(severity)}>{incident.category}</Badge>
                                        <Badge variant="outline" className={getStatusColor(incident.status)}>{incident.status}</Badge>
                                    </div>
                                </div>
                                <p className="text-sm font-medium text-foreground">{incident.description}</p>
                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                    <span className="flex items-center gap-1"> <MapPin className="h-3 w-3" /> {incident.address} </span>
                                    <span className="flex items-center gap-1"> <Clock className="h-3 w-3" /> {formatDistanceToNow(new Date(incident.createdAt), { addSuffix: true })} </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                        <Users className="h-3 w-3" />
                                        <span> {incident.volunteers.length}/{incident.volunteersNeeded || 3} volunteers </span>
                                    </div>
                                    {incident.status !== "Resolved" && (
                                        <Button size="sm" variant={isVolunteering ? "secondary" : "default"} disabled={isVolunteering} onClick={() => handleVolunteerClick(incident)} className="h-8 text-xs hover:scale-105 transition-transform" >
                                            {isVolunteering ? (
                                                <><CheckCircle className="mr-1 h-3 w-3" /> Volunteering</>
                                            ) : (
                                                <><Heart className="mr-1 h-3 w-3" />I Will Help</>
                                            )}
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )
                })}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>

      <AnimatePresence>
        {showVolunteerModal && selectedIncident && (
            <Dialog open={showVolunteerModal} onOpenChange={setShowVolunteerModal}>
                <DialogContent className="sm:max-w-md z-[1000]">
                    <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} transition={{ duration: 0.2 }} >
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2"> <Heart className="h-5 w-5 text-primary" /> Volunteer Confirmation </DialogTitle>
                            <DialogDescription>Are you sure you want to volunteer for this incident?</DialogDescription>
                        </DialogHeader>
                        <div className="py-4">
                            <div className="p-4 bg-muted rounded-lg space-y-2">
                                <div className="flex items-center gap-2">
                                    <Badge className={getSeverityColor(getSeverity(selectedIncident.category))}>{selectedIncident.category}</Badge>
                                    <Badge variant="outline" className={getStatusColor(selectedIncident.status)}> {selectedIncident.status} </Badge>
                                </div>
                                <p className="text-sm font-medium">{selectedIncident.description}</p>
                                <p className="text-xs text-muted-foreground flex items-center gap-1"> <MapPin className="h-3 w-3" /> {selectedIncident.address} </p>
                            </div>
                        </div>
                        <DialogFooter className="gap-2">
                            <Button variant="outline" onClick={() => setShowVolunteerModal(false)} disabled={isVolunteering}> Cancel </Button>
                            <Button onClick={confirmVolunteer} disabled={isVolunteering} className="bg-primary hover:bg-primary/90" >
                                {isVolunteering ? (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                                        Confirming...
                                    </motion.div>
                                ) : (
                                    <> <Heart className="mr-2 h-4 w-4" /> Yes, I'll Help </>
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