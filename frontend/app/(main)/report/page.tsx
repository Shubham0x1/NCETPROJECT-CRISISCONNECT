// frontend/app/(main)/report/page.tsx
"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react" // <-- ADDED useEffect and useRef
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Footer } from "@/components/footer"
// --- NEW ICON IMPORTED ---
import { AlertTriangle, Upload, MapPin, Loader2, CheckCircle, Camera, ArrowLeft, Mic } from "lucide-react"
import Link from "next/link"

// This is required for using the browser's SpeechRecognition API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

const emergencyCategories = [
  { value: "Fire", label: "Fire", icon: "🔥" },
  { value: "Flood", label: "Flood", icon: "🌊" },
  { value: "Power Outage", label: "Power Outage", icon: "⚡" },
  { value: "Accident", label: "Accident", icon: "🚗" },
  { value: "Medical Emergency", label: "Medical Emergency", icon: "🏥" },
  { value: "Other", label: "Other", icon: "⚠️" },
]

export default function ReportPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [formData, setFormData] = useState({
    category: "",
    description: "",
    address: "",
    media: null as File | null,
  })

  // --- NEW STATE AND REFS FOR VOICE RECORDING ---
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<any>(null);


  // --- NEW FUNCTION TO HANDLE VOICE RECORDING ---
  const handleVoiceInput = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast({
        title: "Browser Not Supported",
        description: "Your browser does not support the Web Speech API for voice recognition.",
        variant: "destructive",
      });
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    recognitionRef.current = recognition;

    recognition.onstart = () => {
      setIsRecording(true);
      toast({ title: "Listening...", description: "Start speaking to describe the incident." });
    };

    recognition.onend = () => {
      setIsRecording(false);
      toast({ title: "Recording stopped." });
    };

    recognition.onerror = (event: any) => {
      toast({ title: "Voice Recognition Error", description: event.error, variant: "destructive" });
      setIsRecording(false);
    };

    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((result: any) => result[0])
        .map((result) => result.transcript)
        .join('');
      setFormData(prev => ({...prev, description: transcript}));
    };

    recognition.start();
  };

  // Cleanup effect to stop recognition if the component unmounts
  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.category || !formData.description || !formData.address) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("You must be logged in to submit a report.")
      }

      const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        formData.address
      )}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
      
      const geoResponse = await fetch(geocodeUrl)
      const geoData = await geoResponse.json()
      
      if (geoData.status !== "OK" || !geoData.results[0]) {
        throw new Error("Could not verify the address. Please provide a more specific location.")
      }
      
      const { lat, lng } = geoData.results[0].geometry.location
      const coordinates = [lng, lat]

      const dataToSubmit = new FormData();
      dataToSubmit.append("category", formData.category);
      dataToSubmit.append("description", formData.description);
      dataToSubmit.append("address", formData.address);
      dataToSubmit.append("coordinates", JSON.stringify(coordinates));

      if (formData.media) {
        dataToSubmit.append("media", formData.media);
      }
      
      const response = await fetch("/api/incidents", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: dataToSubmit,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to submit the report.")
      }

      setIsSuccess(true)
      setTimeout(() => {
        toast({
          title: "Report Submitted Successfully",
          description: "Your emergency report has been sent.",
        })
        router.push("/")
      }, 1500)

    } catch (error: any) {
      toast({
        title: "Submission Failed",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData({ ...formData, media: file })
    }
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
            <div className="p-3 rounded-full bg-primary/10">
              <AlertTriangle className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Report Emergency</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Help your community by reporting emergencies quickly and accurately. Your report will be sent to local
            authorities and volunteers.
          </p>
        </motion.div>

        {/* Report Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="max-w-2xl mx-auto"
        >
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Emergency Details</CardTitle>
              <CardDescription className="text-muted-foreground">
                Please provide as much detail as possible to help responders
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Category Selection */}
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-foreground">
                    Emergency Category *
                  </Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger className="bg-input border-border">
                      <SelectValue placeholder="Select emergency type" />
                    </SelectTrigger>
                    <SelectContent>
                      {emergencyCategories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          <div className="flex items-center gap-2">
                            <span>{category.icon}</span>
                            <span>{category.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="description" className="text-foreground">
                      Description *
                    </Label>
                    {/* --- NEW VOICE RECORDING BUTTON --- */}
                    <Button type="button" variant="ghost" size="icon" onClick={handleVoiceInput} className="h-8 w-8">
                      <Mic className={`h-4 w-4 ${isRecording ? 'text-destructive animate-pulse' : 'text-muted-foreground'}`} />
                    </Button>
                  </div>
                  <Textarea
                    id="description"
                    placeholder={isRecording ? "Listening..." : "Describe the emergency situation in detail..."}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="min-h-32 bg-input border-border resize-none"
                  />
                </div>

                {/* Location */}
                <div className="space-y-2">
                  <Label htmlFor="address" className="text-foreground">
                    Location *
                  </Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="address"
                      placeholder="Enter address or landmark"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="pl-10 bg-input border-border"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Be as specific as possible (street address, building name, etc.)
                  </p>
                </div>

                {/* Media Upload */}
                <div className="space-y-2">
                  <Label htmlFor="media" className="text-foreground">
                    Upload Photo (Optional)
                  </Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                    <input
                      id="media"
                      type="file"
                      accept="image/*"
                      onChange={handleMediaUpload}
                      className="hidden"
                    />
                    <label htmlFor="media" className="cursor-pointer">
                      <div className="flex flex-col items-center gap-2">
                        {formData.media ? (
                          <>
                            <CheckCircle className="h-8 w-8 text-green-500" />
                            <p className="text-sm font-medium text-foreground">{formData.media.name}</p>
                            <p className="text-xs text-muted-foreground">Click to change file</p>
                          </>
                        ) : (
                          <>
                            <Camera className="h-8 w-8 text-muted-foreground" />
                            <p className="text-sm font-medium text-foreground">Upload media</p>
                            <p className="text-xs text-muted-foreground">
                              Photos help responders understand the situation
                            </p>
                          </>
                        )}
                      </div>
                    </label>
                  </div>
                </div>

                {/* Map Placeholder */}
                <div className="space-y-2">
                  <Label className="text-foreground">Location on Map</Label>
                  <div className="h-48 bg-muted rounded-lg border border-border flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      <MapPin className="h-8 w-8 mx-auto mb-2" />
                      <p className="text-sm">Interactive map integration</p>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isSubmitting || isSuccess}
                  className="w-full h-12 text-lg bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Submitting Report...
                    </div>
                  ) : isSuccess ? (
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5" />
                      Report Submitted!
                    </div>
                  ) : (
                    <>
                      <Upload className="mr-2 h-5 w-5" />
                      Submit Emergency Report
                    </>
                  )}
                </Button>

                {/* Emergency Notice */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg"
                >
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-destructive">For Life-Threatening Emergencies</p>
                      <p className="text-xs text-destructive/80 mt-1">
                        Call 911 immediately. This app is for community coordination and non-critical emergencies.
                      </p>
                    </div>
                  </div>
                </motion.div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </main>

      <Footer />
    </div>
  )
}