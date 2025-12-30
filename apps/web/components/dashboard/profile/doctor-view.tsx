"use client";

import { useEffect, useState } from "react";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import {
  Loader2,
  Edit2,
  Save,
  X,
  User,
  Stethoscope,
  Briefcase,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";
import { toastService } from "@/lib/toast";
import {
  getProfileDetails,
  updateProfileDetails,
} from "@/api/api.profileDetails";
import { Badge } from "@workspace/ui/components/badge";
import { Separator } from "@workspace/ui/components/separator";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar";

export interface DoctorData {
  first_name: string;
  last_name: string;
  specialization: string;
  experienceYears: number;
  place: string;
  phoneNo: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export function DoctorProfileView() {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [doctorData, setDoctorData] = useState<DoctorData>({
    first_name: "",
    last_name: "",
    specialization: "",
    experienceYears: 0,
    place: "",
    phoneNo: "",
    email: "",
    created_at: "",
    updated_at: "",
  });

  const [formData, setFormData] = useState<DoctorData>(doctorData);
  const [errors, setErrors] = useState<
    Partial<Record<keyof DoctorData, string>>
  >({});

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const profileData = await getProfileDetails();
        if (profileData?.profile_details) {
          setDoctorData(profileData.profile_details);
          setFormData(profileData.profile_details);
        }
      } catch (e) {
        console.error(e);
        toastService.error("Error fetching profile details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
    setFormData(doctorData);
    setErrors({});
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData(doctorData);
    setErrors({});
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof DoctorData, string>> = {};

    if (!formData.first_name.trim())
      newErrors.first_name = "First name is required";
    if (!formData.last_name.trim())
      newErrors.last_name = "Last name is required";
    if (!formData.specialization.trim())
      newErrors.specialization = "Specialization is required";
    if (!formData.place.trim()) newErrors.place = "Place/Clinic is required";
    if (formData.experienceYears < 0)
      newErrors.experienceYears = "Experience cannot be negative";

    const phoneRegex = /^[\d\s\-+()]+$/;
    if (!formData.phoneNo.trim()) {
      newErrors.phoneNo = "Phone number is required";
    } else if (!phoneRegex.test(formData.phoneNo)) {
      newErrors.phoneNo = "Invalid phone number format";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getChangedFields = (original: DoctorData, edited: DoctorData) => {
    return Object.fromEntries(
      Object.entries(edited).filter(([key, value]) => {
        return value !== original[key as keyof DoctorData];
      }),
    );
  };

  const handleSave = async () => {
    if (!validateForm()) {
      toastService.error("Validation Error", {
        description: "Please fix the errors before saving.",
      });
      return;
    }

    setIsSaving(true);
    const changes = getChangedFields(doctorData, formData);

    if (Object.keys(changes).length === 0) {
      toastService.info("No changes detected");
      setIsEditing(false);
      setIsSaving(false);
      return;
    }

    try {
      const response = await updateProfileDetails(changes);
      const updatedProfile = response.profile_details ?? response;

      setDoctorData(updatedProfile);
      setFormData(updatedProfile);
      setIsEditing(false);

      toastService.success("Profile updated successfully");
    } catch (error) {
      toastService.error("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (
    field: keyof DoctorData,
    value: string | number,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Card className="border-border shadow-sm">
      <CardHeader className="pb-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-primary/10">
              <AvatarImage
                src={`https://ui-avatars.com/api/?name=${doctorData.first_name}+${doctorData.last_name}&background=random`}
              />
              <AvatarFallback>
                {doctorData.first_name[0]}
                {doctorData.last_name[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-2xl font-bold">
                  Dr. {doctorData.first_name} {doctorData.last_name}
                </CardTitle>
                <Badge variant="secondary" className="text-xs">
                  Doctor
                </Badge>
              </div>
              <CardDescription className="text-base mt-1 flex items-center gap-2">
                <Stethoscope className="h-4 w-4" />
                {doctorData.specialization} • {doctorData.experienceYears} years
                exp.
              </CardDescription>
            </div>
          </div>

          {!isEditing ? (
            <Button onClick={handleEdit} variant="outline" className="gap-2">
              <Edit2 className="h-4 w-4" />
              Edit Profile
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                variant="ghost"
                onClick={handleCancel}
                disabled={isSaving}
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Save Changes
              </Button>
            </div>
          )}
        </div>
      </CardHeader>

      <Separator />

      <CardContent className="pt-8 grid gap-8">
        {/* Personal Information */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-lg font-semibold text-foreground">
            <User className="h-5 w-5 text-primary" />
            <h3>Personal Details</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              {isEditing ? (
                <>
                  <Input
                    id="firstName"
                    value={formData.first_name}
                    onChange={(e) =>
                      handleInputChange("first_name", e.target.value)
                    }
                    className={errors.first_name ? "border-destructive" : ""}
                  />
                  {errors.first_name && (
                    <p className="text-xs text-destructive">
                      {errors.first_name}
                    </p>
                  )}
                </>
              ) : (
                <div className="p-2 bg-muted/50 rounded-md text-sm">
                  {doctorData.first_name}
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              {isEditing ? (
                <>
                  <Input
                    id="lastName"
                    value={formData.last_name}
                    onChange={(e) =>
                      handleInputChange("last_name", e.target.value)
                    }
                    className={errors.last_name ? "border-destructive" : ""}
                  />
                  {errors.last_name && (
                    <p className="text-xs text-destructive">
                      {errors.last_name}
                    </p>
                  )}
                </>
              ) : (
                <div className="p-2 bg-muted/50 rounded-md text-sm">
                  {doctorData.last_name}
                </div>
              )}
            </div>
          </div>
        </section>

        <Separator />

        {/* Professional Information */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-lg font-semibold text-foreground">
            <Briefcase className="h-5 w-5 text-primary" />
            <h3>Professional Info</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="specialization">Specialization</Label>
              {isEditing ? (
                <>
                  <Input
                    id="specialization"
                    value={formData.specialization}
                    onChange={(e) =>
                      handleInputChange("specialization", e.target.value)
                    }
                    className={
                      errors.specialization ? "border-destructive" : ""
                    }
                  />
                  {errors.specialization && (
                    <p className="text-xs text-destructive">
                      {errors.specialization}
                    </p>
                  )}
                </>
              ) : (
                <div className="p-2 bg-muted/50 rounded-md text-sm">
                  {doctorData.specialization}
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="experienceYears">Experience (Years)</Label>
              {isEditing ? (
                <>
                  <Input
                    id="experienceYears"
                    type="number"
                    min="0"
                    value={formData.experienceYears}
                    onChange={(e) =>
                      handleInputChange(
                        "experienceYears",
                        Number(e.target.value),
                      )
                    }
                    className={
                      errors.experienceYears ? "border-destructive" : ""
                    }
                  />
                  {errors.experienceYears && (
                    <p className="text-xs text-destructive">
                      {errors.experienceYears}
                    </p>
                  )}
                </>
              ) : (
                <div className="p-2 bg-muted/50 rounded-md text-sm">
                  {doctorData.experienceYears} years
                </div>
              )}
            </div>
          </div>
        </section>

        <Separator />

        {/* Contact Information */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-lg font-semibold text-foreground">
            <MapPin className="h-5 w-5 text-primary" />
            <h3>Location & Contact</h3>
          </div>
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-2">
              <Label htmlFor="place">Clinic / Hospital Name</Label>
              {isEditing ? (
                <>
                  <Input
                    id="place"
                    value={formData.place}
                    onChange={(e) => handleInputChange("place", e.target.value)}
                    className={errors.place ? "border-destructive" : ""}
                  />
                  {errors.place && (
                    <p className="text-xs text-destructive">{errors.place}</p>
                  )}
                </>
              ) : (
                <div className="p-2 bg-muted/50 rounded-md text-sm">
                  {doctorData.place}
                </div>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="phoneNo">Phone Number</Label>
                {isEditing ? (
                  <>
                    <Input
                      id="phoneNo"
                      value={formData.phoneNo}
                      onChange={(e) =>
                        handleInputChange("phoneNo", e.target.value)
                      }
                      className={errors.phoneNo ? "border-destructive" : ""}
                    />
                    {errors.phoneNo && (
                      <p className="text-xs text-destructive">
                        {errors.phoneNo}
                      </p>
                    )}
                  </>
                ) : (
                  <div className="p-2 bg-muted/50 rounded-md text-sm flex items-center gap-2">
                    <Phone className="h-3 w-3" /> {doctorData.phoneNo}
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                {isEditing ? (
                  <>
                    <Input
                      id="email"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      className={errors.email ? "border-destructive" : ""}
                    />
                    {errors.email && (
                      <p className="text-xs text-destructive">{errors.email}</p>
                    )}
                  </>
                ) : (
                  <div className="p-2 bg-muted/50 rounded-md text-sm flex items-center gap-2">
                    <Mail className="h-3 w-3" /> {doctorData.email}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </CardContent>
    </Card>
  );
}
