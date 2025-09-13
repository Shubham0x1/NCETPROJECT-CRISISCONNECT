"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Footer } from "@/components/footer"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import {
  ArrowLeft,
  FileText,
  Heart,
  CheckCircle,
  Clock,
  AlertTriangle,
  MapPin,
  Calendar,
  TrendingUp,
  Award,
  Users,
} from "lucide-react"
import Link from "next/link"

// Mock data for user contributions
const reportedIncidents = [
  {
    id: 1,
    type: "Fire",
    description: "House fire on Oak Street",
    location: "123 Oak Street",
    dateReported: "2024-01-15",
    status: "Resolved",
    priority: "high",
    responseTime: "12 minutes",
  },
  {
    id: 2,
    type: "Power Outage",
    description: "Power outage affecting downtown area",
    location: "Downtown District",
    dateReported: "2024-01-10",
    status: "In Progress",
    priority: "medium",
    responseTime: "45 minutes",
  },
  {
    id: 3,
    type: "Flood",
    description: "Street flooding due to broken water main",
    location: "Main Street & 5th Ave",
    dateReported: "2024-01-05",
    status: "Pending",
    priority: "low",
    responseTime: "N/A",
  },
]

const volunteeredIncidents = [
  {
    id: 4,
    type: "Medical",
    description: "First aid assistance at community center",
    location: "Community Center",
    dateVolunteered: "2024-01-12",
    status: "Completed",
    hoursContributed: 3,
    impact: "Helped 2 people",
  },
  {
    id: 5,
    type: "Accident",
    description: "Traffic direction during road closure",
    location: "Broadway & 42nd Street",
    dateVolunteered: "2024-01-08",
    status: "Completed",
    hoursContributed: 2,
    impact: "Managed traffic flow",
  },
  {
    id: 6,
    type: "Flood",
    description: "Sandbagging assistance",
    location: "Riverside District",
    dateVolunteered: "2024-01-03",
    status: "In Progress",
    hoursContributed: 4,
    impact: "Protected 5 homes",
  },
]

// Chart data
const monthlyContributions = [
  { month: "Oct", reported: 2, volunteered: 1 },
  { month: "Nov", reported: 1, volunteered: 3 },
  { month: "Dec", reported: 3, volunteered: 2 },
  { month: "Jan", reported: 3, volunteered: 3 },
]

const contributionTypes = [
  { name: "Reports", value: 9, color: "#d97706" },
  { name: "Volunteer Hours", value: 15, color: "#0891b2" },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "Resolved":
    case "Completed":
      return "bg-green-100 text-green-800"
    case "In Progress":
      return "bg-yellow-100 text-yellow-800"
    case "Pending":
      return "bg-red-100 text-red-800"
    default:
      return "bg-muted text-muted-foreground"
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "Resolved":
    case "Completed":
      return <CheckCircle className="h-4 w-4 text-green-600" />
    case "In Progress":
      return <Clock className="h-4 w-4 text-yellow-600" />
    case "Pending":
      return <AlertTriangle className="h-4 w-4 text-red-600" />
    default:
      return <Clock className="h-4 w-4 text-muted-foreground" />
  }
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
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

export default function ContributionsPage() {
  const [activeTab, setActiveTab] = useState("overview")

  const totalReports = reportedIncidents.length
  const totalVolunteerHours = volunteeredIncidents.reduce((sum, incident) => sum + incident.hoursContributed, 0)
  const resolvedReports = reportedIncidents.filter((incident) => incident.status === "Resolved").length
  const completedVolunteerWork = volunteeredIncidents.filter((incident) => incident.status === "Completed").length

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
            <div className="p-3 rounded-full bg-secondary/10">
              <Award className="h-8 w-8 text-secondary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">My Contributions</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Track your impact in the community through emergency reports and volunteer work.
          </p>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
        >
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Reports</p>
                  <p className="text-2xl font-bold text-foreground">{totalReports}</p>
                </div>
                <FileText className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Volunteer Hours</p>
                  <p className="text-2xl font-bold text-foreground">{totalVolunteerHours}</p>
                </div>
                <Heart className="h-8 w-8 text-secondary" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Resolved Reports</p>
                  <p className="text-2xl font-bold text-foreground">{resolvedReports}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Community Impact</p>
                  <p className="text-2xl font-bold text-foreground">High</p>
                </div>
                <TrendingUp className="h-8 w-8 text-accent" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="reported">Problems Reported</TabsTrigger>
              <TabsTrigger value="volunteered">Volunteer Work</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Monthly Contributions Chart */}
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-foreground">Monthly Activity</CardTitle>
                    <CardDescription className="text-muted-foreground">
                      Your reports and volunteer hours over time
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={monthlyContributions}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="reported" fill="#d97706" name="Reports" />
                        <Bar dataKey="volunteered" fill="#0891b2" name="Volunteer Hours" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Contribution Types Pie Chart */}
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-foreground">Contribution Breakdown</CardTitle>
                    <CardDescription className="text-muted-foreground">
                      Distribution of your community contributions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={contributionTypes}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, value }) => `${name}: ${value}`}
                        >
                          {contributionTypes.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              {/* Progress Indicators */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Community Impact Progress</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Your progress towards community service goals
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-foreground">Reports Resolution Rate</span>
                      <span className="text-muted-foreground">
                        {Math.round((resolvedReports / totalReports) * 100)}%
                      </span>
                    </div>
                    <Progress value={(resolvedReports / totalReports) * 100} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-foreground">Volunteer Hours Goal</span>
                      <span className="text-muted-foreground">{totalVolunteerHours}/20 hours</span>
                    </div>
                    <Progress value={(totalVolunteerHours / 20) * 100} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Reported Problems Tab */}
            <TabsContent value="reported" className="space-y-4">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-foreground">
                    <FileText className="h-5 w-5 text-primary" />
                    Problems I Reported
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Emergency incidents you've reported to the community
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {reportedIncidents.map((incident, index) => (
                    <motion.div
                      key={incident.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="p-4 rounded-lg border border-border bg-background hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Badge className={getPriorityColor(incident.priority)}>{incident.type}</Badge>
                          <Badge variant="outline" className={getStatusColor(incident.status)}>
                            <div className="flex items-center gap-1">
                              {getStatusIcon(incident.status)}
                              {incident.status}
                            </div>
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(incident.dateReported).toLocaleDateString()}
                        </div>
                      </div>

                      <h3 className="font-semibold text-foreground mb-2">{incident.description}</h3>

                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {incident.location}
                        </span>
                        <span>Response time: {incident.responseTime}</span>
                      </div>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Volunteer Work Tab */}
            <TabsContent value="volunteered" className="space-y-4">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-foreground">
                    <Heart className="h-5 w-5 text-secondary" />
                    Problems I Helped Solve
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Incidents where you volunteered your time and skills
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {volunteeredIncidents.map((incident, index) => (
                    <motion.div
                      key={incident.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="p-4 rounded-lg border border-border bg-background hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-secondary text-secondary-foreground">{incident.type}</Badge>
                          <Badge variant="outline" className={getStatusColor(incident.status)}>
                            <div className="flex items-center gap-1">
                              {getStatusIcon(incident.status)}
                              {incident.status}
                            </div>
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(incident.dateVolunteered).toLocaleDateString()}
                        </div>
                      </div>

                      <h3 className="font-semibold text-foreground mb-2">{incident.description}</h3>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {incident.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {incident.hoursContributed} hours
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {incident.impact}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>

      <Footer />
    </div>
  )
}
