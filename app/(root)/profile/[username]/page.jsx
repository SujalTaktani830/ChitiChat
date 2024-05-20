"use client";

import Loader from "@components/Loader";
import { PersonOutline } from "@mui/icons-material";
import { useSession } from "next-auth/react";
import { CldUploadButton } from "next-cloudinary";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const ProfilePage = () => {
  const { data: session } = useSession();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session) {
      reset({
        username: session?.user?.username,
        profileImage: session?.user?.profileImage,
      });
    }
    setLoading(false);
  }, [session]);

  const handleUpload = (result) => {
    setValue("profileImage", result?.info?.secure_url);
  };

  const updateUser = async (data) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/users/${session?.user?.id}/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      setLoading(false);
      window.location.reload();
    } catch (e) {
      console.log(e);
    }
  };

  return loading ? (
    <Loader />
  ) : (
    <div className="profile-page">
      <h1>Welcome back, {session?.user?.username} </h1>
      <p>Edit your profile</p>

      <form className="edit-profile" onSubmit={handleSubmit(updateUser)}>
        <div>
          <div className="input">
            <input
              {...register("username", {
                required: "Username is required",
                validate: (value) => {
                  if (value.length < 3) {
                    return "Username must be atleast 3 characters";
                  }
                },
              })}
              type="text"
              placeholder="Username"
              className="input-field"
            />
            <PersonOutline sx={{ color: "#737373" }} />
          </div>
          {errors.username && (
            <p className="text-red-500">{errors.username.message}</p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <img
            src={
              watch("profileImage") ||
              session?.user.profileImage ||
              "/user.jpeg"
            }
            alt="USER PROFILE"
            className="w-40 h-40 rounded-full"
          />
          <CldUploadButton
            options={{ maxFiles: 1 }}
            onSuccess={handleUpload}
            uploadPreset="qafrvyyl"
          >
            <p>Upload new photo</p>
          </CldUploadButton>
        </div>

        <button className="btn">Save Changes</button>
      </form>
    </div>
  );
};

export default ProfilePage;
