"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Label } from "@workspace/ui/components/label";
import { User, Mail, Calendar, Clock, FileText, Shield } from "lucide-react";
import { Badge } from "@workspace/ui/components/badge";
import { Separator } from "@workspace/ui/components/separator";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar";
import { Button } from "@workspace/ui/components/button";
import { toastService } from "@/lib/toast";

interface PatientProfileViewProps {
  user: {
    name: string;
    email: string;
    image?: string | null;
    id: string;
  };
}

export function PatientProfileView({ user }: PatientProfileViewProps) {
  const handleEdit = () => {
    toastService.info("Edit Profile", {
      description: "To update your personal details, please contact support.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Main Profile Card */}
      <Card className="border-border shadow-sm">
        <CardHeader className="pb-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 border-2 border-primary/10">
                <AvatarImage
                  src={
                    user.image ||
                    `https://ui-avatars.com/api/?name=${user.name}&background=random`
                  }
                />
                <AvatarFallback>
                  {user.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <CardTitle className="text-2xl font-bold">
                    {user.name}
                  </CardTitle>
                  <Badge
                    variant="outline"
                    className="text-xs border-emerald-500/50 text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30"
                  >
                    Patient
                  </Badge>
                </div>
                <CardDescription className="text-base mt-1 flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  {user.email}
                </CardDescription>
              </div>
            </div>

            <Button variant="outline" onClick={handleEdit}>
              Edit Details
            </Button>
          </div>
        </CardHeader>

        <Separator />

        <CardContent className="pt-8 grid gap-8">
          {/* Personal Information */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-lg font-semibold text-foreground">
              <User className="h-5 w-5 text-primary" />
              <h3>Personal Information</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <Label className="text-muted-foreground">Full Name</Label>
                <div className="font-medium">{user.name}</div>
              </div>
              <div className="space-y-1">
                <Label className="text-muted-foreground">Email Address</Label>
                <div className="font-medium">{user.email}</div>
              </div>
              <div className="space-y-1">
                <Label className="text-muted-foreground">Patient ID</Label>
                <div className="font-mono text-sm bg-muted/50 p-1 px-2 rounded w-fit">
                  {user.id}
                </div>
              </div>
            </div>
          </section>
        </CardContent>
      </Card>

      {/* Health Overview / Placeholder */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-border shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Calendar className="h-5 w-5 text-blue-500" />
              Upcoming Appointments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground text-sm">
              <Clock className="h-8 w-8 mx-auto mb-2 opacity-20" />
              No upcoming appointments scheduled.
              <div className="mt-4">
                <Button variant="link" className="text-primary h-auto p-0">
                  Book an appointment
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileText className="h-5 w-5 text-amber-500" />
              Recent Documents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground text-sm">
              <Shield className="h-8 w-8 mx-auto mb-2 opacity-20" />
              No medical records or prescriptions found.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
