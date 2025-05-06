import { ProfilePictureForm } from "@/features/users/components/settings/form/profile-picture-form";
import { AboutForm } from "@/features/users/components/settings/form/about-form";
import { Profile } from "@/server/types/domain";
import { alert } from "@/lib/alert";
import { toast } from "sonner";
import { useState } from "react";
import { usePatchAccountMutation } from "@/features/users/hooks/use-accounts";

type ProfileKeys = keyof Profile;

interface ProfileInformationFormProps extends Profile {
  legalName: string;
  accountId: number;
}

export function ProfileInformationForm(profile: ProfileInformationFormProps) {
  const { accountId } = profile;
  const [key, setKey] = useState<ProfileKeys>("profilePictureUrl");

  const { mutateAsync: updateUserInfo, isPending: submitting } =
    usePatchAccountMutation();

  const updateProfileBio = async (bio: string) => {
    const data = await updateUserInfo({
      accountId,
      about: {
        about: bio,
      },
    });

    if (data.error) {
      alert(data.error);
    }

    if (data.data) {
      toast.success("Profile bio updated.");
    }
  };

  const updateProfilePicture = async (newProfilePictureUrl: string) => {
    const data = await updateUserInfo({
      accountId,
      profilePictureUrl: {
        profilePictureUrl: newProfilePictureUrl,
      },
    });

    if (data.error) {
      alert(data.error);
    }

    if (data.data) {
      toast.success("Profile picture updated.");
    }
  };

  return (
    <>
      <ProfilePictureForm
        defaultValues={{
          url: profile.profilePictureUrl,
          legalName: profile.legalName,
        }}
        submitting={submitting && key === "profilePictureUrl"}
        handleSubmit={updateProfilePicture}
      />
      <AboutForm
        defaultValues={profile.about}
        loading={submitting}
        onEditorOpen={() => setKey("about")}
        onEditorClose={() => setKey("profilePictureUrl")}
        disabled={submitting && key !== "about"}
        handleSubmit={updateProfileBio}
      />
    </>
  );
}
