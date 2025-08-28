import React, { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Calendar, Upload, Save, Loader2 } from "lucide-react";
import { toast } from "../hooks/use-toast";

interface UserProfile {
  id?: number;
  name: string;
  email: string;
  //   mobile?: string
  gender?: "male" | "female" | "other";
  dob?: string;
  address?: string;
  country?: string;
  state?: string;
  city?: string;
  postal_code?: string;
  profile_image?: string;
  created_at?: Date;
  updated_at?: Date;
}

const Profile: React.FC = () => {
  const normalizeDob = (value?: string) => {
    if (!value) return "";
    // Accepts ISO strings or date strings; returns YYYY-MM-DD
    if (value.length >= 10) return value.substring(0, 10);
    return value;
  };
  const [profile, setProfile] = useState<UserProfile>({
    name: "",
    email: "",
    // mobile: '',
    gender: undefined,
    dob: "",
    address: "",
    country: "",
    state: "",
    city: "",
    postal_code: "",
    profile_image: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [profileImage, setProfileImage] = useState<string>("");

  // Fetch existing profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Determine current userId
        const currentUserRaw = localStorage.getItem("currentUser");
        const currentUser = currentUserRaw ? JSON.parse(currentUserRaw) : null;
        const userId: number | undefined = currentUser?.id ?? profile.id;

        if (!userId) {
          throw new Error("No user id available");
        }

        // Try to fetch from API first
        const response = await fetch(`/api/profile/${userId}`);
        if (response.ok) {
          const result = await response.json();

          if (result.success && result.data) {
            const user = result.data.user || {};
            const prof = result.data.profile || {};
            const genderLower = prof.gender ? String(prof.gender).toLowerCase() : undefined;
            const genderNormalized: UserProfile["gender"] =
              genderLower === "male" || genderLower === "female" || genderLower === "other"
                ? genderLower
                : undefined;
            const mergedProfile: UserProfile = {
              id: user.id ?? prof.id,
              name: user.name ?? "",
              email: user.email ?? "",
              gender: genderNormalized,
              dob: normalizeDob(prof.dob || ""),
              address: prof.address || "",
              country: prof.country || "",
              state: prof.state || "",
              city: prof.city || "",
              postal_code: prof.postal_code || "",
              profile_image: prof.profile_image || "",
            };
            setProfile(mergedProfile);
            setProfileImage(mergedProfile.profile_image || "");
          }
        } else {
          throw new Error("API not available");
        }
      } catch (error) {
        console.log("API not available, using local storage fallback");

        // First check for existing profile data
        const savedProfile = localStorage.getItem("userProfile");
        if (savedProfile) {
          const profileData = JSON.parse(savedProfile);
          setProfile(profileData);
          setProfileImage(profileData.profile_image || "");
        } else {
          // Check for registered user data
          const currentUser = localStorage.getItem("currentUser");
          if (currentUser) {
            const userData = JSON.parse(currentUser);

            // Create profile from registered user data
            const profileFromUser = {
              id: userData.id,
              name: userData.name || "",
              email: userData.email || "",
              //   mobile: '',
              gender: undefined,
              dob: "",
              address: "",
              country: "",
              state: "",
              city: "",
              postal_code: "",
              profile_image: "",
            };
            setProfile(profileFromUser);
            localStorage.setItem(
              "userProfile",
              JSON.stringify(profileFromUser),
            );
          } else {
            // Set default sample data as last resort
            const defaultProfile = {
              name: " ",
              email: " ",
              //   mobile: '+1-555-0001',
              gender: "male" as const,
              dob: "",
              address: " ",
              country: " ",
              state: " ",
              city: " ",
              postal_code: " ",
              profile_image: "",
            };
            setProfile(defaultProfile);
            localStorage.setItem("userProfile", JSON.stringify(defaultProfile));
          }
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    setProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageDataUrl = e.target?.result as string;
        setProfileImage(imageDataUrl);
        setProfile((prev) => ({
          ...prev,
          profile_image: imageDataUrl,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      // Determine current userId
      const currentUserRaw = localStorage.getItem("currentUser");
      const currentUser = currentUserRaw ? JSON.parse(currentUserRaw) : null;
      const userId: number | undefined = currentUser?.id ?? profile.id;
      if (!userId) {
        throw new Error("No user id available");
      }

      const payload = {
        name: profile.name,
        profile_image: profile.profile_image,
        gender: profile.gender,
        dob: normalizeDob(profile.dob) || null,
        address: profile.address,
        country: profile.country,
        state: profile.state,
        city: profile.city,
        postal_code: profile.postal_code,
      };

      const response = await fetch(`/api/profile/${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json().catch(() => ({}));
      if (response.ok) {

        if (result.success) {
          // result.data is the saved profile row
          const saved = result.data || {};
          setProfile((prev) => ({
            ...prev,
            gender: saved.gender,
            dob: saved.dob || "",
            address: saved.address || "",
            country: saved.country || "",
            state: saved.state || "",
            city: saved.city || "",
            postal_code: saved.postal_code || "",
            profile_image: saved.profile_image || prev.profile_image,
          }));
          toast({
            title: "Success",
            description: "Profile updated successfully",
            variant: "default",
          });
        } else {
          throw new Error(result.message || "Failed to save profile");
        }
      } else {
        throw new Error(result?.error || "API request failed");
      }
    } catch (error) {
      console.error("Save failed:", error);
      toast({
        title: "Save failed",
        description:
          error instanceof Error ? error.message : "Unable to save profile",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Profile</h1>
      </div>

      <div className=" space-y-8">
        {/* General Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-semibold">
              <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                <span className="text-sm font-bold text-gray-600">1</span>
              </div>
              General Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 ">
            {/* Profile Image */}
            <div className="space-y-2">
              <Label>Profile Image</Label>
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={profileImage} alt="Profile" />
                  <AvatarFallback>
                    {profile.name ? profile.name.charAt(0).toUpperCase() : "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <input
                    type="file"
                    id="profile-image"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      document.getElementById("profile-image")?.click()
                    }
                    className="flex items-center gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    Upload Image
                  </Button>
                  {/* <p className="text-sm text-gray-500 mt-1">
                    For best results, use an image of at least 256x256 pixels
                  </p> */}
                </div>
              </div>
            </div>

            {/* Form Fields Row 1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={profile.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter your name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Enter your email"
                />
              </div>
              {/* <div className="space-y-2">
                <Label htmlFor="mobile">Mobile Number *</Label>
                <Input
                  id="mobile"
                  value={profile.mobile || ''}
                  onChange={(e) => handleInputChange('mobile', e.target.value)}
                  placeholder="Enter mobile number"
                />
              </div> */}
            </div>

            {/* Form Fields Row 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select
                  value={profile.gender || ""}
                  onValueChange={(value) => handleInputChange("gender", value)}
                >
                  <SelectTrigger id="gender">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dob">DOB</Label>
                <div className="relative">
                  <Input
                    id="dob"
                    type="date"
                    value={profile.dob || ""}
                    onChange={(e) => handleInputChange("dob", e.target.value)}
                  />
                  {/* <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" /> */}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Address Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-semibold">
              <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                <span className="text-sm font-bold text-gray-600">2</span>
              </div>
              Address Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Address Field */}
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={profile.address || ""}
                onChange={(e) => handleInputChange("address", e.target.value)}
                placeholder="Enter your address"
              />
            </div>

            {/* Address Fields Row 1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  type="text"
                  placeholder="Enter country"
                  value={profile.country || ""}
                  onChange={(e) => handleInputChange("country", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  type="text"
                  placeholder="Enter state"
                  value={profile.state || ""}
                  onChange={(e) => handleInputChange("state", e.target.value)}
                />
              </div>
            </div>

            {/* Address Fields Row 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City </Label>
                <Input
                  id="city"
                  type="text"
                  placeholder="Enter city"
                  value={profile.city || ""}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="postal_code">Postal Code </Label>
                <Input
                  id="postal_code"
                  value={profile.postal_code || ""}
                  onChange={(e) =>
                    handleInputChange("postal_code", e.target.value)
                  }
                  placeholder="Enter postal code"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4">
          <Button variant="outline" size="lg">
            Cancel
          </Button>
          <Button
            onClick={handleSaveChanges}
            disabled={isSaving}
            size="lg"
            className="flex items-center gap-2"
          >
            {isSaving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;