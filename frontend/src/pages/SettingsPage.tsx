import React, { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useUserContext } from "../context/UserContext";
import ErrorsFormField from "../components/auth/ErrorsFormField";
import UserImage from "../components/users/UserImages";
import TristanSection from "../components/TristanSection";
import { NavBarButton } from "../components/Buttons";
import { BIO_MAX_LENGTH, BIO_MIN_LENGTH } from "../shared/misc";

interface ModalInputs {
  gender: string;
  sex_pref: string;
  bio: string;
  age: number;
  password: string;
  confirmPassword: string;
  hashtags: string[];
  picture: string[];
}

const SettingsPage: React.FC = () => {
  const [error, setError] = useState<string>();
  const { user, updateUser } = useUserContext();
  const [imageUpload, setImageUpload] = useState<boolean>(false);

  const {
    handleSubmit,
    control,
    formState: { errors },
    watch,
  } = useForm<ModalInputs>({ mode: "onTouched", criteriaMode: "all" });

  const passwordInput = watch("password");

  const onSubmit = async (data: ModalInputs) => {
    // if (!imageUpload) {
    //   setError("You must upload at least one profile picture");
    //   return;
    // }
    console.log("GENDER", data.gender);
    console.log("sex_pref", data.sex_pref);
    console.log("bio", data.bio);
    console.log("age", data.age);
    console.log("hashtags", data.hashtags);
    try {
      const response = await axios.post(
        `http://${process.env.REACT_APP_SERVER_ADDRESS}:5000/users/update_profile`,
        {
          gender: data?.gender,
          sex_pref: data?.sex_pref,
          bio: data?.bio,
          age: data?.age,
          hashtags: data?.hashtags,
        },
        { withCredentials: true }
      );
      console.log("RESPONSE", response.data.user);
      updateUser(response.data.user);
    } catch (error: any) {
      setError(error.response.data.error);
    }
  };

  return (
    <TristanSection>
      <div className="relative w-full max-w-lg max-h-full no-scrollbar">
        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white mb-8">
          Settings
        </h1>
        {error && (
          <p className="error mt-2 text-sm font-bold text-red-600 dark:text-red-500">
            You must complete all the fields: {error}
          </p>
        )}
        <form
          className="space-y-4 md:space-y-6"
          onSubmit={handleSubmit(onSubmit)}
        >
          <ErrorsFormField
            input="select"
            control={control}
            errors={errors}
            hasError={!!errors.gender}
            controllerName="gender"
            label="Gender"
            placeholder={user?.gender || ""}
            options={["Male", "Female", "Other"].map((value) => ({
              value,
              label: value,
            }))}
            rules={{
              enum: {
                values: ["male", "female", "other"],
                message: 'Gender must be either "male", "female", or "other"',
              },
            }}
          />
          <ErrorsFormField
            input="select"
            control={control}
            errors={errors}
            hasError={!!errors.sex_pref}
            controllerName="sex_pref"
            label="Sexual Preference"
            placeholder={user?.sex_pref || ""}
            options={["Male", "Female", "Both"].map((value) => ({
              value,
              label: value,
            }))}
          />
          <ErrorsFormField
            control={control}
            errors={errors}
            hasError={!!errors.bio}
            controllerName="bio"
            label="Bio"
            placeholder={user?.bio || ""}
            rules={{
              minLength: {
                value: BIO_MIN_LENGTH,
                message: `Your bio must be at least ${BIO_MIN_LENGTH} characters long`,
              },
              maxLength: {
                value: BIO_MAX_LENGTH,
                message: `Your bio must be at most ${BIO_MAX_LENGTH} characters long`,
              },
            }}
          />
          <ErrorsFormField
            input="select"
            control={control}
            errors={errors}
            hasError={!!errors.age}
            controllerName="age"
            label="Age"
            placeholder={user?.age?.toString() || ""}
            options={Array.from({ length: 82 }, (_, index) => ({
              value: (index + 18).toString(),
              label: (index + 18).toString(),
            }))}
          />
          <ErrorsFormField
            input="multiple"
            control={control}
            errors={errors}
            hasError={!!errors.hashtags}
            controllerName="hashtags"
            label="Hashtags"
            placeholder={user?.hashtags || ""}
            type="hashtags"
            options={["#music", "#cinema", "#voyage", "#art", "#sex"].map(
              (value) => ({
                value,
                label: value,
              })
            )}
          />
          {/* <ErrorsFormField
            control={control}
            errors={errors}
            hasError={!!errors.password}
            controllerName="password"
            label="Password"
            placeholder="Password"
            type="password"
            rules={{
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters long",
              },
              validate: {
                uppercase: (value: string) =>
                  /[A-Z]/.test(value) ||
                  "Password must contain at least one uppercase character",
                lowercase: (value: string) =>
                  /[a-z]/.test(value) ||
                  "Password must contain at least one lowercase character",
                digit: (value: string) =>
                  /\d/.test(value) ||
                  "Password must contain at least one digit",
              },
            }}
          />
          <ErrorsFormField
            control={control}
            errors={errors}
            hasError={!!errors.confirmPassword}
            controllerName="confirmPassword"
            label="Confirm password"
            placeholder="Password"
            type="password"
            rules={{
              required: passwordInput
                ? "Password confirmation is required"
                : false,
              validate: {
                matchesPreviousPassword: (value: string) =>
                  value === passwordInput || "Passwords must match",
              },
            }}
          /> */}
          <UserImage
            controllerName="Profil Pictures"
            label="Profil Pictures"
            setImageUpload={setImageUpload}
          />
          <NavBarButton
            disabled={Object.keys(errors).length > 0}
            text="Submit"
            type="submit"
          />
        </form>
      </div>
    </TristanSection>
  );
};

export default SettingsPage;
