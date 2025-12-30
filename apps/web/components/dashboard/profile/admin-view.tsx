"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Label } from "@workspace/ui/components/label";
import { ShieldCheck, Server, Users, Activity, Lock } from "lucide-react";
import { Badge } from "@workspace/ui/components/badge";
import { Separator } from "@workspace/ui/components/separator";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar";
import { Button } from "@workspace/ui/components/button";

interface AdminProfileViewProps {
  user: {
    name: string;
    email: string;
    image?: string | null;
    id: string;
  };
}

export function AdminProfileView({ user }: AdminProfileViewProps) {
  return (
    <div className="space-y-6">
      {/* Main Profile Card */}
      <Card className="border-border shadow-sm border-l-4 border-l-red-500/50">
        <CardHeader className="pb-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 border-2 border-red-500/10">
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
                  <Badge variant="destructive" className="text-xs">
                    Administrator
                  </Badge>
                </div>
                <CardDescription className="text-base mt-1 flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4" />
                  System Administrator
                </CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>

        <Separator />

        <CardContent className="pt-8 grid gap-8">
          {/* Account Information */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-lg font-semibold text-foreground">
              <Lock className="h-5 w-5 text-primary" />
              <h3>Account Details</h3>
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
                <Label className="text-muted-foreground">Admin ID</Label>
                <div className="font-mono text-sm bg-muted/50 p-1 px-2 rounded w-fit">
                  {user.id}
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-muted-foreground">Permissions</Label>
                <div className="flex gap-2">
                  <Badge variant="outline">Full Access</Badge>
                  <Badge variant="outline">User Management</Badge>
                </div>
              </div>
            </div>
          </section>
        </CardContent>
      </Card>

      {/* Admin Dashboard Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-border shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Activity className="h-4 w-4" />
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">
              Operational
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              All systems normal
            </p>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Users className="h-4 w-4" />
              Total Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">--</div>
            <p className="text-xs text-muted-foreground mt-1">
              Active accounts
            </p>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Server className="h-4 w-4" />
              Server Load
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">--%</div>
            <p className="text-xs text-muted-foreground mt-1">CPU Usage</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
