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
import { toast } from "@workspace/ui/components/sonner";
import {
  getProfileDetails,
  updateProfileDetails,
} from "@/api/api.profileDetails";

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

export default function DoctorProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

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
        const profileData = await getProfileDetails();
        setDoctorData(profileData.profile_details);
      } catch (e) {
        console.error(e);
        toast.error("Error getting the profile values");
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

    if (!formData.first_name.trim()) {
      newErrors.first_name = "First name is required";
    }
    if (!formData.last_name.trim()) {
      newErrors.last_name = "Last name is required";
    }
    if (!formData.specialization.trim()) {
      newErrors.specialization = "Specialization is required";
    }
    if (!formData.place.trim()) {
      newErrors.place = "Place/Clinic is required";
    }
    if (formData.experienceYears < 0) {
      newErrors.experienceYears = "Experience cannot be negative";
    }

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
      })
    );
  };

  const handleSave = async () => {
    if (!validateForm()) {
      toast.error("Validation Error", {
        description: "Please fix the errors before saving.",
      });
      return;
    }

    setIsSaving(true);

    const changes = getChangedFields(doctorData, formData);

    if (Object.keys(changes).length === 0) {
      toast.info("No changes detected");
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

      toast.success("Success", {
        description: "Profile updated successfully.",
      });
    } catch (error) {
      toast.error("Error", {
        description: "Failed to update profile. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (
    field: keyof DoctorData,
    value: string | number
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="container mx-auto py-4 sm:py-8 px-3 sm:px-4 max-w-4xl">
      <Card className="border-border shadow-lg">
        <CardHeader className="border-b border-border pb-4 sm:pb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-xl sm:text-2xl break-words">
                Dr. {doctorData.first_name} {doctorData.last_name}
              </CardTitle>
              <CardDescription className="text-sm sm:text-base mt-1 break-words">
                {doctorData.specialization} • {doctorData.experienceYears} years
                of experience
              </CardDescription>
            </div>
            {!isEditing ? (
              <div className="flex flex-col sm:items-end gap-2 sm:text-right">
                <Button onClick={handleEdit} className="gap-2 w-full sm:w-auto">
                  <Edit2 className="h-4 w-4" />
                  Edit Profile
                </Button>

                <CardDescription className="text-xs sm:text-sm text-muted-foreground font-light">
                  Last updated · {formatDate(doctorData.updated_at)}
                </CardDescription>
              </div>
            ) : (
              <div className="flex gap-2 flex-col sm:flex-row w-full sm:w-auto">
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isSaving}
                  className="w-full sm:w-auto order-2 sm:order-1"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="gap-2 w-full sm:w-auto order-1 sm:order-2"
                >
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

        <CardContent className="pt-4 sm:pt-6">
          <div className="grid gap-5 sm:gap-6">
            {/* Personal Information Section */}
            <div>
              <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center gap-2">
                <User className="h-4 w-4 sm:h-5 sm:w-5" />
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-sm">First Name</Label>
                  {isEditing ? (
                    <div>
                      <Input
                        id="firstName"
                        value={formData.first_name}
                        onChange={(e) =>
                          handleInputChange("first_name", e.target.value)
                        }
                        className={
                          errors.first_name ? "border-destructive" : ""
                        }
                      />
                      {errors.first_name && (
                        <p className="text-xs sm:text-sm text-destructive mt-1">
                          {errors.first_name}
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm sm:text-base py-2 break-words">{doctorData.first_name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-sm">Last Name</Label>
                  {isEditing ? (
                    <div>
                      <Input
                        id="lastName"
                        value={formData.last_name}
                        onChange={(e) =>
                          handleInputChange("last_name", e.target.value)
                        }
                        className={errors.last_name ? "border-destructive" : ""}
                      />
                      {errors.last_name && (
                        <p className="text-xs sm:text-sm text-destructive mt-1">
                          {errors.last_name}
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm sm:text-base py-2 break-words">{doctorData.last_name}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Professional Information Section */}
            <div>
              <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center gap-2">
                <Stethoscope className="h-4 w-4 sm:h-5 sm:w-5" />
                Professional Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-2">
                  <Label htmlFor="specialization" className="text-sm">Specialization</Label>
                  {isEditing ? (
                    <div>
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
                        <p className="text-xs sm:text-sm text-destructive mt-1">
                          {errors.specialization}
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm sm:text-base py-2 break-words">
                      {doctorData.specialization}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experienceYears" className="text-sm">Experience (Years)</Label>
                  {isEditing ? (
                    <div>
                      <Input
                        id="experienceYears"
                        type="number"
                        min="0"
                        value={formData.experienceYears}
                        onChange={(e) =>
                          handleInputChange(
                            "experienceYears",
                            Number.parseInt(e.target.value) || 0
                          )
                        }
                        className={
                          errors.experienceYears ? "border-destructive" : ""
                        }
                      />
                      {errors.experienceYears && (
                        <p className="text-xs sm:text-sm text-destructive mt-1">
                          {errors.experienceYears}
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm sm:text-base py-2">
                      {doctorData.experienceYears} years
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Location & Contact Section */}
            <div>
              <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center gap-2">
                <MapPin className="h-4 w-4 sm:h-5 sm:w-5" />
                Location & Contact
              </h3>
              <div className="grid gap-3 sm:gap-4">
                <div className="space-y-2">
                  <Label htmlFor="place" className="text-sm">Place/Clinic</Label>
                  {isEditing ? (
                    <div>
                      <Input
                        id="place"
                        value={formData.place}
                        onChange={(e) =>
                          handleInputChange("place", e.target.value)
                        }
                        className={errors.place ? "border-destructive" : ""}
                      />
                      {errors.place && (
                        <p className="text-xs sm:text-sm text-destructive mt-1">
                          {errors.place}
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm sm:text-base py-2 flex items-center gap-2 break-words">
                      <Briefcase className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <span>{doctorData.place}</span>
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phoneNo" className="text-sm">Phone Number</Label>
                    {isEditing ? (
                      <div>
                        <Input
                          id="phoneNo"
                          type="tel"
                          value={formData.phoneNo}
                          onChange={(e) =>
                            handleInputChange("phoneNo", e.target.value)
                          }
                          className={errors.phoneNo ? "border-destructive" : ""}
                        />
                        {errors.phoneNo && (
                          <p className="text-xs sm:text-sm text-destructive mt-1">
                            {errors.phoneNo}
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm sm:text-base py-2 flex items-center gap-2 break-all">
                        <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <span>{doctorData.phoneNo}</span>
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm">Email</Label>
                    {isEditing ? (
                      <div>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) =>
                            handleInputChange("email", e.target.value)
                          }
                          className={errors.email ? "border-destructive" : ""}
                        />
                        {errors.email && (
                          <p className="text-xs sm:text-sm text-destructive mt-1">
                            {errors.email}
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm sm:text-base py-2 flex items-center gap-2 break-all">
                        <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <span>{doctorData.email}</span>
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
  );
}