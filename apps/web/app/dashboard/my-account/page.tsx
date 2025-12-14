"use client"

import { useState } from "react"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Loader2, Edit2, Save, X, User, Stethoscope, Briefcase, MapPin, Phone, Mail } from "lucide-react"
import { toast } from "@workspace/ui/components/sonner"

interface DoctorData {
  id: string
  firstName: string
  lastName: string
  specialization: string
  experienceYears: number
  place: string
  phoneNo: string
  email: string
}

export default function DoctorProfile() {
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const [doctorData, setDoctorData] = useState<DoctorData>({
    id: "1",
    firstName: "Sarah",
    lastName: "Johnson",
    specialization: "Cardiology",
    experienceYears: 12,
    place: "Central Medical Center",
    phoneNo: "+1 (555) 123-4567",
    email: "dr.sarah.johnson@hospital.com",
  })

  const [formData, setFormData] = useState<DoctorData>(doctorData)
  const [errors, setErrors] = useState<Partial<Record<keyof DoctorData, string>>>({})

  const handleEdit = () => {
    setIsEditing(true)
    setFormData(doctorData)
    setErrors({})
  }

  const handleCancel = () => {
    setIsEditing(false)
    setFormData(doctorData)
    setErrors({})
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof DoctorData, string>> = {}

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required"
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required"
    }
    if (!formData.specialization.trim()) {
      newErrors.specialization = "Specialization is required"
    }
    if (!formData.place.trim()) {
      newErrors.place = "Place/Clinic is required"
    }
    if (formData.experienceYears < 0) {
      newErrors.experienceYears = "Experience cannot be negative"
    }

    const phoneRegex = /^[\d\s\-+$$$$]+$/
    if (!formData.phoneNo.trim()) {
      newErrors.phoneNo = "Phone number is required"
    } else if (!phoneRegex.test(formData.phoneNo)) {
      newErrors.phoneNo = "Invalid phone number format"
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email format"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async () => {
    if (!validateForm()) {
      toast.error("Validation Error", {
        description: "Please fix the errors before saving.",
      })
      return
    }

    setIsSaving(true)

    try {
      // Replace with actual API call
      // const response = await fetch(`/api/doctors/${doctorData.id}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData),
      // })
      // if (!response.ok) throw new Error('Failed to update profile')
      // const updatedData = await response.json()

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setDoctorData(formData)
      setIsEditing(false)

      toast.success("Success", {
        description: "Profile updated successfully.",
      })
    } catch (error) {
      toast.error("Error", {
        description: "Failed to update profile. Please try again.",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleInputChange = (field: keyof DoctorData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-2">Doctor Profile</h1>
        <p className="text-muted-foreground">Manage your professional information</p>
      </div>

      <Card className="border-border shadow-lg">
        <CardHeader className="border-b border-border pb-6">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">
                Dr. {doctorData.firstName} {doctorData.lastName}
              </CardTitle>
              <CardDescription className="text-base mt-1">
                {doctorData.specialization} • {doctorData.experienceYears} years of experience
              </CardDescription>
            </div>
            {!isEditing ? (
              <Button onClick={handleEdit} className="gap-2">
                <Edit2 className="h-4 w-4" />
                Edit Profile
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={isSaving} className="gap-2">
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Save
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          <div className="grid gap-6">
            {/* Personal Information Section */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  {isEditing ? (
                    <div>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        className={errors.firstName ? "border-destructive" : ""}
                      />
                      {errors.firstName && <p className="text-sm text-destructive mt-1">{errors.firstName}</p>}
                    </div>
                  ) : (
                    <p className="text-base py-2">{doctorData.firstName}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  {isEditing ? (
                    <div>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                        className={errors.lastName ? "border-destructive" : ""}
                      />
                      {errors.lastName && <p className="text-sm text-destructive mt-1">{errors.lastName}</p>}
                    </div>
                  ) : (
                    <p className="text-base py-2">{doctorData.lastName}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Professional Information Section */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Stethoscope className="h-5 w-5" />
                Professional Information
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="specialization">Specialization</Label>
                  {isEditing ? (
                    <div>
                      <Input
                        id="specialization"
                        value={formData.specialization}
                        onChange={(e) => handleInputChange("specialization", e.target.value)}
                        className={errors.specialization ? "border-destructive" : ""}
                      />
                      {errors.specialization && (
                        <p className="text-sm text-destructive mt-1">{errors.specialization}</p>
                      )}
                    </div>
                  ) : (
                    <p className="text-base py-2">{doctorData.specialization}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experienceYears">Experience (Years)</Label>
                  {isEditing ? (
                    <div>
                      <Input
                        id="experienceYears"
                        type="number"
                        min="0"
                        value={formData.experienceYears}
                        onChange={(e) => handleInputChange("experienceYears", Number.parseInt(e.target.value) || 0)}
                        className={errors.experienceYears ? "border-destructive" : ""}
                      />
                      {errors.experienceYears && (
                        <p className="text-sm text-destructive mt-1">{errors.experienceYears}</p>
                      )}
                    </div>
                  ) : (
                    <p className="text-base py-2">{doctorData.experienceYears} years</p>
                  )}
                </div>
              </div>
            </div>

            {/* Location & Contact Section */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Location & Contact
              </h3>
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="place">Place/Clinic</Label>
                  {isEditing ? (
                    <div>
                      <Input
                        id="place"
                        value={formData.place}
                        onChange={(e) => handleInputChange("place", e.target.value)}
                        className={errors.place ? "border-destructive" : ""}
                      />
                      {errors.place && <p className="text-sm text-destructive mt-1">{errors.place}</p>}
                    </div>
                  ) : (
                    <p className="text-base py-2 flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-muted-foreground" />
                      {doctorData.place}
                    </p>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phoneNo">Phone Number</Label>
                    {isEditing ? (
                      <div>
                        <Input
                          id="phoneNo"
                          type="tel"
                          value={formData.phoneNo}
                          onChange={(e) => handleInputChange("phoneNo", e.target.value)}
                          className={errors.phoneNo ? "border-destructive" : ""}
                        />
                        {errors.phoneNo && <p className="text-sm text-destructive mt-1">{errors.phoneNo}</p>}
                      </div>
                    ) : (
                      <p className="text-base py-2 flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        {doctorData.phoneNo}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    {isEditing ? (
                      <div>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          className={errors.email ? "border-destructive" : ""}
                        />
                        {errors.email && <p className="text-sm text-destructive mt-1">{errors.email}</p>}
                      </div>
                    ) : (
                      <p className="text-base py-2 flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        {doctorData.email}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
