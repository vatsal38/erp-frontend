"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";
import { handleCommonErrors } from "@/utils/handleCommonErrors";
import { Button } from "@heroui/react";
import Link from "next/link";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [load, setLoad] = useState(false);

  const onSubmit = async (data) => {
    try {
      setLoad(true);
      const res = await signIn("credentials", {
        ...data,
        redirect: true,
        callbackUrl: "/",
      });
      if (res?.status === 200) toast.success("Login Successful!");
      if (!res?.ok) {
        handleCommonErrors(res?.error);
      }
      setLoad(false);
    } catch (error) {
      console.log("error::: ", error);
      toast.error("Something went wrong!");
      setLoad(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md bg-white p-8 rounded-md shadow-sm"
      >
        <div className="text-center mb-6">
          <div className="text-4xl font-semibold mb-2">Welcome Back!</div>
          <p className="text-lg text-gray-600 font-medium">
            Sign in with your credentials.
          </p>
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            placeholder="admin@admin.com"
            className={`w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring ${
              errors.username ? "border-red-500" : "border-gray-300"
            }`}
            {...register("username", { required: "Email is required" })}
          />
          {errors.username && (
            <p className="text-xs text-red-500 mt-1">
              {errors.username.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            placeholder="••••••"
            className={`w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring ${
              errors.password ? "border-red-500" : "border-gray-300"
            }`}
            {...register("password", { required: "Password is required" })}
          />
          {errors.password && (
            <p className="text-xs text-red-500 mt-1">
              {errors.password.message}
            </p>
          )}
        </div>
        <Button
          type="submit"
          variant="solid"
          color="primary"
          radius="sm"
          className="w-full"
          isLoading={load}
        >
          Sign In
        </Button>

        <p className="text-center mt-4 text-sm text-gray-500 flex gap-2 items-center justify-center">
          Don't have an account?{" "}
          <Button
            type="button"
            variant="light"
            color="primary"
            radius="sm"
            className="min-w-fit p-1 h-fit"
            as={Link}
            href="/signup"
          >
            Sign Up
          </Button>
        </p>
      </form>
    </div>
  );
};

export default Login;
