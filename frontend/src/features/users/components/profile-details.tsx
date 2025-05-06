"use client";

import { UserReview } from "./user-review";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import {
  ProfileData,
  ProfileSchema,
} from "@/server/api/routers/account/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

export function ProfileDetails() {
  const editProfile = false;

  const profileDescriptionForm = useForm<ProfileData>({
    resolver: zodResolver(ProfileSchema),
  });

  return (
    <div className="max-w-3xl flex-grow py-3">
      <h1 className="text-[44px] text-title"> About Danyls </h1>
      {!editProfile && (
        <p className="mt-6 py-6 text-body">
          I am a passionate basketball player and software developer. Love to
          travel and discover new places, especially to discover new basketball
          courts and have more challenges. Am very friendly and love to have
          fun, and meet new people.
        </p>
      )}
      {editProfile && (
        <Form {...profileDescriptionForm}>
          <form>
            <FormField
              control={profileDescriptionForm.control}
              name="about"
              render={(field) => (
                <FormItem className="mt-4 flex-1 py-6">
                  <FormControl className="flex-1">
                    <Textarea
                      {...field}
                      rows={10}
                      placeholder="Tell more about yourself..."
                    />
                  </FormControl>
                  <FormDescription>
                    This is what other hosts will see about you. It will
                    increase your chances of getting accepted by hosts.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              size="lg"
              className="rounded-full bg-accent-500 px-6 text-negative"
            >
              Save
            </Button>
          </form>
        </Form>
      )}
      <div className="my-8 w-full border border-border"></div>
      <section className="">
        <h2 className="text-xl text-title">
          What Hosts are saying about Danyls
        </h2>
        <div className="grid grid-cols-1 gap-4 py-4 md:grid-cols-3">
          {new Array(3).fill(0).map((_, index) => (
            <UserReview key={index} />
          ))}
        </div>
        <Button variant="link" className="underline">
          Show all reviews
        </Button>
      </section>
      <div className="my-8 w-full border border-border"></div>
      <section className="w-full">
        <h2 className="text-xl text-title">Where Danyls has been </h2>
        <div className="grid grid-cols-1 gap-4 py-4 md:grid-cols-3">
          {/* TODO: Add visited places here */}
        </div>
        <div className="flex w-full justify-start">
          <Button variant="link" className="p-0 underline">
            Show all visited places
          </Button>
        </div>
      </section>
    </div>
  );
}
