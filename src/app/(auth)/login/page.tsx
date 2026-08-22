"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";

import { AuthShell } from "@/components/authComponents/auth-shell";
import { AuthField } from "@/components/authComponents/auth-field";
import { AuthButton } from "@/components/authComponents/auth-button";
import { authHeadingClasses } from "@/components/authComponents/auth-styles";
import { loginSchema, type LoginFormData } from "@/schemas/auth.schema";
import { useLogin } from "@/hooks/auth/use-login";
import { getSafeRedirectPath } from "@/lib/safe-redirect";
import { cn } from "@/lib/utils";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, loading, fieldErrors } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    const success = await login(data);
    if (success) {
      const redirectPath = getSafeRedirectPath(
        searchParams.get("redirect"),
        "/",
      );
      router.replace(redirectPath);
    }
  };

  return (
    <AuthShell
      imageSrc="/auth/auth3.png"
      imageAlt="Student studying with headphones"
    >
      <h1
        className={cn(
          authHeadingClasses,
          "mb-[44px] sm:mb-[60px]",
        )}
      >
        Sign In to Your Account
      </h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <AuthField
          label="Username / Email Address"
          type="email"
          autoComplete="username"
          placeholder="Enter your email"
          error={errors.email?.message ?? fieldErrors.email}
          {...register("email")}
        />
        <AuthField
          type="password"
          label="Password"
          autoComplete="current-password"
          placeholder="Enter your password"
          error={errors.password?.message ?? fieldErrors.password}
          className="mt-[18px]"
          {...register("password")}
        />

        <div className="mt-[16px] flex items-center justify-between">
          <AuthField type="checkbox" {...register("remember")}>
            Remember me
          </AuthField>
          <Link
            href="/forgot-password"
            className="text-[15px] font-normal text-[#252525] hover:underline"
          >
            Forgot Password?
          </Link>
        </div>

        <AuthButton loading={loading} className="mt-[35px]">
          Sign In
        </AuthButton>
      </form>
    </AuthShell>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
