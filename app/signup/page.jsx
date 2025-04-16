"use client";
import { Button } from "@heroui/react";
import Link from "next/link";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash, FaGoogle, FaFacebookF } from "react-icons/fa";

const Signup = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    const payload = {
      username: data.username,
      password: data.password,
    };
    console.log("Payload:", payload);
    // Send payload to backend (axios or fetch)
    setTimeout(() => {
      setLoading(false);
      alert("Signup successful!");
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md bg-white p-8 rounded-md shadow-sm"
      >
        <div className="text-center mb-6">
          <div className="text-4xl font-semibold mb-2">Create Account</div>
          <p className="text-lg text-gray-600 font-medium">
            Sign up with your credentials.
          </p>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            placeholder="vatsal9999.vm@yopmail.com"
            className={`w-full border rounded px-3 py-2 text-sm focus:outline-none ${
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
        <div className="mb-4 relative">
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            className={`w-full border rounded px-3 py-2 text-sm pr-10 focus:outline-none ${
              errors.password ? "border-red-500" : "border-gray-300"
            }`}
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Minimum 6 characters",
              },
            })}
          />
          <span
            className="absolute right-3 top-9 cursor-pointer text-gray-500"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
          {errors.password && (
            <p className="text-xs text-red-500 mt-1">
              {errors.password.message}
            </p>
          )}
        </div>
        <div className="mb-4 relative">
          <label className="block text-sm font-medium mb-1">
            Confirm Password
          </label>
          <input
            type={showConfirm ? "text" : "password"}
            placeholder="••••••••"
            className={`w-full border rounded px-3 py-2 text-sm pr-10 focus:outline-none ${
              errors.confirmPassword ? "border-red-500" : "border-gray-300"
            }`}
            {...register("confirmPassword", {
              required: "Please confirm password",
              validate: (value) =>
                value === watch("password") || "Passwords do not match",
            })}
          />
          <span
            className="absolute right-3 top-9 cursor-pointer text-gray-500"
            onClick={() => setShowConfirm((prev) => !prev)}
          >
            {showConfirm ? <FaEyeSlash /> : <FaEye />}
          </span>
          {errors.confirmPassword && (
            <p className="text-xs text-red-500 mt-1">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          className={`w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition ${
            loading ? "opacity-50" : ""
          }`}
          disabled={loading}
        >
          {loading ? "Signing up..." : "Sign Up"}
        </button>

        <p className="text-center mt-4 text-sm text-gray-500 flex gap-2 items-center justify-center">
          Already have an account?{" "}
          <Button
            type="button"
            variant="light"
            color="primary"
            radius="sm"
            className="min-w-fit p-1 h-fit"
            as={Link}
            href="/signin"
          >
            Sign In
          </Button>
        </p>
      </form>
    </div>
  );
};

export default Signup;
