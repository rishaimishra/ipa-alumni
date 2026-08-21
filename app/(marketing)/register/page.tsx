"use client";

import { useActionState } from "react";
import { registerAlumni, type RegisterState } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const initialState: RegisterState = undefined;

export default function RegisterPage() {
  const [state, action, pending] = useActionState(registerAlumni, initialState);

  return (
    <div className="mx-auto w-full max-w-2xl px-6 py-12">
      <h1 className="text-2xl font-semibold">Alumni / Student Registration</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        After submitting, you&apos;ll receive an OTP on your phone to verify
        your account.
      </p>

      {state?.message && (
        <p className="mt-4 rounded border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {state.message}
        </p>
      )}

      <form action={action} className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Label htmlFor="role">I am a</Label>
          <Select name="role" defaultValue="ALUMNI">
            <SelectTrigger id="role" className="mt-1 w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALUMNI">Alumni</SelectItem>
              <SelectItem value="STUDENT">Student</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="sm:col-span-2">
          <Label htmlFor="fullName">Full Name</Label>
          <Input id="fullName" name="fullName" required className="mt-1" />
          {state?.errors?.fullName && (
            <p className="mt-1 text-xs text-destructive">{state.errors.fullName[0]}</p>
          )}
        </div>

        <div>
          <Label htmlFor="sex">Sex</Label>
          <Select name="sex" required>
            <SelectTrigger id="sex" className="mt-1 w-full">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="MALE">Male</SelectItem>
              <SelectItem value="FEMALE">Female</SelectItem>
              <SelectItem value="OTHER">Other</SelectItem>
            </SelectContent>
          </Select>
          {state?.errors?.sex && (
            <p className="mt-1 text-xs text-destructive">{state.errors.sex[0]}</p>
          )}
        </div>

        <div>
          <Label htmlFor="age">Age</Label>
          <Input id="age" name="age" type="number" min={1} className="mt-1" />
        </div>

        <div>
          <Label htmlFor="gender">Gender</Label>
          <Input id="gender" name="gender" className="mt-1" />
        </div>

        <div>
          <Label htmlFor="religion">Religion</Label>
          <Input id="religion" name="religion" className="mt-1" />
        </div>

        <div>
          <Label htmlFor="studentId">Student Admission Number</Label>
          <Input id="studentId" name="studentId" required className="mt-1" />
          {state?.errors?.studentId && (
            <p className="mt-1 text-xs text-destructive">
              {state.errors.studentId[0]}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            name="phone"
            required
            placeholder="+232..."
            className="mt-1"
          />
          {state?.errors?.phone && (
            <p className="mt-1 text-xs text-destructive">{state.errors.phone[0]}</p>
          )}
        </div>

        <div className="sm:col-span-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" className="mt-1" />
          {state?.errors?.email && (
            <p className="mt-1 text-xs text-destructive">{state.errors.email[0]}</p>
          )}
        </div>

        <div className="sm:col-span-2">
          <Label htmlFor="residentialAddress">Residential Address</Label>
          <Input id="residentialAddress" name="residentialAddress" className="mt-1" />
        </div>

        <div className="sm:col-span-2">
          <Label htmlFor="workAddress">Work Address</Label>
          <Input id="workAddress" name="workAddress" className="mt-1" />
        </div>

        <div>
          <Label htmlFor="programOfStudy">Program of Studies</Label>
          <Input id="programOfStudy" name="programOfStudy" className="mt-1" />
        </div>

        <div>
          <Label htmlFor="degreeType">Degree / Diploma / Certificate</Label>
          <Input id="degreeType" name="degreeType" className="mt-1" />
        </div>

        <div>
          <Label htmlFor="yearFrom">Year of Attendance (From)</Label>
          <Input id="yearFrom" name="yearFrom" type="number" className="mt-1" />
        </div>

        <div>
          <Label htmlFor="yearTo">Year of Attendance (To)</Label>
          <Input id="yearTo" name="yearTo" type="number" className="mt-1" />
        </div>

        <div className="sm:col-span-2">
          <Button type="submit" disabled={pending} className="w-full">
            {pending ? "Submitting..." : "Register & Send OTP"}
          </Button>
        </div>
      </form>
    </div>
  );
}
