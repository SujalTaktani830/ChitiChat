"use client";

import Loader from "@components/Loader";
import { GroupOutlined, PersonOutline } from "@mui/icons-material";
import { CldUploadButton } from "next-cloudinary";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const UpdateGroupChat = ({ params }) => {
  const [loading, setLoading] = useState(true);
  const [groupDetails, setGroupDetails] = useState(null);

  const router = useRouter();

  console.log("GROUP DETAILS - ", groupDetails);

  const { chatID } = useParams();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const handleUpload = (result) => {
    setValue("groupPhoto", result?.info?.secure_url);
  };

  const details = async () => {
    try {
      const res = await fetch(`/api/chats/${chatID}`);
      const data = await res.json();
      setGroupDetails(data);

      console.log(data);

      setLoading(false);

      reset({
        groupName: data?.groupName,
        groupPhoto: data?.groupPhoto,
      });
    } catch (err) {
      console.log(err);
      console.log("Something went wrong");
    }
  };

  useEffect(() => {
    if (chatID) details();
  }, [chatID]);

  const updateGroupDetails = async (data) => {
    console.log("POST DATA - ", data);
    try {
      setLoading(true);
      const res = await fetch(`/api/chats/${chatID}/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      setLoading(false);

      if (res.ok) {
        router.push(`/chats/${chatID}`);
      }
    } catch (e) {
      console.log(e);
    }
  };

  return loading ? (
    <Loader />
  ) : (
    <div className="profile-page">
      <p className="page-title">Welcome to, {groupDetails?.groupName}</p>
      <p>Edit group Info</p>

      <form
        className="edit-profile"
        onSubmit={handleSubmit(updateGroupDetails)}
      >
        <div>
          <div className="input">
            <input
              {...register("groupName", {
                required: "Group Name is required",
                validate: (value) => {
                  if (value.length < 3) {
                    return "Group Name must be atleast 3 characters";
                  }
                },
              })}
              type="text"
              placeholder="Group Name"
              className="input-field"
            />
            <GroupOutlined sx={{ color: "#737373" }} />
          </div>
          {errors.groupName && (
            <p className="text-red-500">{errors.groupName.message}</p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <img
            src={
              watch("groupPhoto") || groupDetails?.groupPhoto || "/group.png"
            }
            alt="GROUP PROFILE"
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

        <div className="flex flex-wrap gap-3">
          {groupDetails?.members?.map((member) => (
            <p className="selected-contact" key={member._id}>
              {member?.username}
            </p>
          ))}
        </div>

        <button className="btn">Save Changes</button>
      </form>
    </div>
  );
};

export default UpdateGroupChat;
