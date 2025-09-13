"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Bell, Shield, Award, Calendar, Edit, Save, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function ProfilePage() {
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState({
    name: "Alex Johnson",
    email: "alex.johnson@email.com",
    phone: "+1 (555) 123-4567",
    location: "Downtown District, City Center",
    bio: "Community volunteer passionate about helping neighbors during emergencies. Available for disaster response and first aid assistance.",
    joinDate: "March 2024",
    skills: "",
    serviceLocations: [],
  })

  const [notifications, setNotifications] = useState({
    emergencyAlerts: true,
    volunteerRequests: true,
    statusUpdates: true,
    weeklyDigest: false,
  })

  useEffect(() => {
    const userData = localStorage.getItem("userData")
    if (userData) {
      const user = JSON.parse(userData)
      setProfile((prev) => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
        skills: user.skills || prev.skills,
        serviceLocations: user.locations || prev.serviceLocations,
        location:
          user.locations && user.locations.length > 0
            ? `${user.locations[0].city}, ${user.locations[0].state}`
            : prev.location,
      }))
    }
  }, [])

  const handleSave = () => {
    const userData = localStorage.getItem("userData")
    if (userData) {
      const user = JSON.parse(userData)
      const updatedUser = {
        ...user,
        name: profile.name,
        email: profile.email,
        skills: profile.skills,
      }
      localStorage.setItem("userData", JSON.stringify(updatedUser))
    }

    setIsEditing(false)
    toast({
      title: "Profile Updated",
      description: "Your profile information has been saved successfully.",
    })
  }

  const handleCancel = () => {
    const userData = localStorage.getItem("userData")
    if (userData) {
      const user = JSON.parse(userData)
      setProfile((prev) => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
        skills: user.skills || prev.skills,
      }))
    }
    setIsEditing(false)
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">My Profile</h1>
            <p className="text-muted-foreground mt-1">Manage your account and preferences</p>
          </div>
          <Button onClick={isEditing ? handleSave : () => setIsEditing(true)} className="flex items-center gap-2">
            {isEditing ? (
              <>
                <Save className="h-4 w-4" />
                Save Changes
              </>
            ) : (
              <>
                <Edit className="h-4 w-4" />
                Edit Profile
              </>
            )}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Personal Information
                </CardTitle>
                <CardDescription>Your basic profile information visible to other community members</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 mb-6">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src="/diverse-profile-avatars.png" />
                    <AvatarFallback className="text-lg">
                      {profile.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-semibold">{profile.name}</h3>
                    <p className="text-muted-foreground">Community Volunteer</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Member since {profile.joinDate}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Primary Location</Label>
                    <Input
                      id="location"
                      value={profile.location}
                      onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="skills">Skills & Interests</Label>
                  <Textarea
                    id="skills"
                    value={profile.skills}
                    onChange={(e) => setProfile({ ...profile, skills: e.target.value })}
                    disabled={!isEditing}
                    className="mt-1"
                    rows={2}
                    placeholder="e.g., First Aid, Driving, Cooking, Communication, Logistics..."
                  />
                </div>

                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={profile.bio}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    disabled={!isEditing}
                    className="mt-1"
                    rows={3}
                  />
                </div>

                {profile.serviceLocations && profile.serviceLocations.length > 0 && (
                  <div>
                    <Label>Service Locations</Label>
                    <div className="mt-2 space-y-2">
                      {profile.serviceLocations.map((location, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded-md">
                          <span className="text-sm">
                            {location.district}, {location.city}, {location.state}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {isEditing && (
                  <div className="flex gap-2 pt-4">
                    <Button onClick={handleCancel} variant="outline" className="flex items-center gap-2 bg-transparent">
                      <X className="h-4 w-4" />
                      Cancel
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notification Preferences
                </CardTitle>
                <CardDescription>Choose what notifications you want to receive</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="emergency-alerts">Emergency Alerts</Label>
                    <p className="text-sm text-muted-foreground">Critical emergency notifications in your area</p>
                  </div>
                  <Switch
                    id="emergency-alerts"
                    checked={notifications.emergencyAlerts}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, emergencyAlerts: checked })}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="volunteer-requests">Volunteer Requests</Label>
                    <p className="text-sm text-muted-foreground">When help is needed for incidents near you</p>
                  </div>
                  <Switch
                    id="volunteer-requests"
                    checked={notifications.volunteerRequests}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, volunteerRequests: checked })}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="status-updates">Status Updates</Label>
                    <p className="text-sm text-muted-foreground">Updates on incidents you've reported or helped with</p>
                  </div>
                  <Switch
                    id="status-updates"
                    checked={notifications.statusUpdates}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, statusUpdates: checked })}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="weekly-digest">Weekly Digest</Label>
                    <p className="text-sm text-muted-foreground">
                      Summary of community activity and your contributions
                    </p>
                  </div>
                  <Switch
                    id="weekly-digest"
                    checked={notifications.weeklyDigest}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, weeklyDigest: checked })}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Community Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Community Impact
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">47</div>
                  <p className="text-sm text-muted-foreground">Total Contributions</p>
                </div>
                <Separator />
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Problems Reported</span>
                    <Badge variant="secondary">12</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Volunteer Responses</span>
                    <Badge variant="secondary">35</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Community Rating</span>
                    <Badge className="bg-green-100 text-green-800">⭐ 4.9</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">🏆</div>
                  <div>
                    <p className="font-medium text-sm">First Responder</p>
                    <p className="text-xs text-muted-foreground">Helped in 10+ emergencies</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">🤝</div>
                  <div>
                    <p className="font-medium text-sm">Community Helper</p>
                    <p className="text-xs text-muted-foreground">Active for 6+ months</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">📍</div>
                  <div>
                    <p className="font-medium text-sm">Local Guardian</p>
                    <p className="text-xs text-muted-foreground">Covers downtown area</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
