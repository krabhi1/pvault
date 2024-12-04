"use client";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { userRpc } from "@/configs/rpc";
import { useAuth } from "@/contexts/AuthContext";
import { usePromise } from "@/hooks/use-promise";
import { toast } from "@/hooks/use-toast";
import { InferRequestType } from "hono";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ReloadIcon } from "@radix-ui/react-icons";

const formSchema = z.object({
  username: z.string().min(3).max(50),
  password: z.string().min(5),
});

export default function Signup() {
  const { signinOrsignup } = useAuth();
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  const { data, isLoading, mutate, error } = usePromise(
    async (arg: InferRequestType<typeof userRpc.signup.$post>) => {
      const res = await userRpc.signup.$post(arg);
      const { data, error } = await res.json();
      if (res.ok) {
        return data;
      }
      throw new Error(error?.message);
    }
  );

  useEffect(() => {
    if (data) {
      toast({
        title: "Success",
        description: data,
      });
      // redirect to home
      const { password, username } = form.getValues();
      signinOrsignup(username, password);
      router.push("/");
    }
    if (error) {
      toast({
        title: "Error",
        description: error.message,
      });
    }
  }, [data, error]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutate({
      json: {
        ...values,
      },
    });
  }
  return (
    <div className="flex h-screen w-full items-center justify-center px-4">
      <Card className="mx-auto min-w-80 max-w-xs p-1">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Sign Up</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        placeholder="username"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        type="password"
                        placeholder="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button disabled={isLoading} type="submit">
                {isLoading && (
                  <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                )}
                Sign Up
              </Button>
              <div className="mt-4 text-center text-sm">
                Already have an account?{" "}
                <Link href="/signin" className="underline">
                  Sign In
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
