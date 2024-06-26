import React, { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useUserContext } from "../context/UserContext";
import ErrorsFormField from "../components/auth/ErrorsFormField";
import UserImage from "../components/users/UserImages";
import TristanSection from "../components/TristanSection";
import PasswordMod from "../components/auth/PasswordModal";
import PositionModal from "../components/PositionModal";
import { NavBarButton } from "../components/Buttons";
import ReportedModal from "../components/ReportedModal";
import {
  FIRSTNAME_MIN_LENGTH,
  FIRSTNAME_MAX_LENGTH,
  LASTNAME_MIN_LENGTH,
  LASTNAME_MAX_LENGTH,
} from "../shared/misc";
import { BIO_MAX_LENGTH, BIO_MIN_LENGTH, HASHTAGS } from "../shared/misc";

interface ModalInputs {
  firstname: string;
  lastname: string;
  email: string;
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
  const [error, setError] = useState<string>("");
  const { user, updateUser } = useUserContext();
  const [passwordModal, setPasswordModal] = useState<boolean>(false);
  const [positionModal, setPositionModal] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [newImage, setNewImage] = useState<boolean>(false);

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ModalInputs>({ mode: "onTouched", criteriaMode: "all" });

  const onSubmit = async (data: ModalInputs) => {
    if (
      data.firstname === undefined &&
      data.lastname === undefined &&
      data.email === undefined &&
      data?.gender === undefined &&
      data.age === undefined &&
      data.bio === undefined &&
      data.sex_pref === undefined &&
      data.hashtags === undefined &&
      !newImage
    ) {
      setError("You should update at least one field before submiting.");
      return;
    }
    try {
      const response = await axios.post(
        `http://${process.env.REACT_APP_SERVER_ADDRESS}:5000/users/update_profile`,
        {
          firstname: data?.firstname,
          lastname: data?.lastname,
          email: data?.email,
          gender: data?.gender,
          sex_pref: data?.sex_pref,
          bio: data?.bio,
          age: data?.age,
          hashtags: data?.hashtags,
        },
        { withCredentials: true }
      );
      updateUser(response.data.user);
      setError("");
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
      }, 3000);
    } catch (error: any) {
      if (newImage) {
        setError("");
        setIsSubmitted(true);
        setTimeout(() => {
          setIsSubmitted(false);
        }, 3000);
      } else setError(error.response.data.error);
    }
  };

  return (
    <div>
      <ReportedModal
        showReportedModal={isSubmitted}
        reportedModalMessage="User successfully updated"
        isReportedMod={false}
        closeReportedModal={() => setIsSubmitted(false)}
      />
      <div>
        <TristanSection>
          <div className="relative w-full max-w-lg max-h-full no-scrollbar">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white mb-8">
              Settings
            </h1>
            {error && (
              <p className="error mt-2 text-sm font-bold text-red-600 dark:text-red-500">
                {error}
              </p>
            )}
            <form
              className="space-y-4 md:space-y-6"
              onSubmit={handleSubmit(onSubmit)}
            >
              <ErrorsFormField
                control={control}
                errors={errors}
                hasError={!!errors.firstname}
                controllerName="firstname"
                label="Firstname"
                placeholder={user?.firstname || ""}
                rules={{
                  minLength: {
                    value: FIRSTNAME_MIN_LENGTH,
                    message: `Firstname must be at least ${FIRSTNAME_MIN_LENGTH} characters long`,
                  },
                  maxLength: {
                    value: FIRSTNAME_MAX_LENGTH,
                    message: `Firstname must be at most ${FIRSTNAME_MAX_LENGTH} characters long`,
                  },
                  pattern: {
                    value: /^[a-zA-Z0-9_]+$/,
                    message:
                      "Firstname can only contain letters, numbers, and underscores",
                  },
                }}
              />
              <ErrorsFormField
                control={control}
                errors={errors}
                hasError={!!errors.lastname}
                controllerName="lastname"
                label="Lastname"
                placeholder={user?.lastname || ""}
                rules={{
                  minLength: {
                    value: LASTNAME_MIN_LENGTH,
                    message: `Lastname must be at least ${LASTNAME_MIN_LENGTH} characters long`,
                  },
                  maxLength: {
                    value: LASTNAME_MAX_LENGTH,
                    message: `Lastname must be at most ${LASTNAME_MAX_LENGTH} characters long`,
                  },
                  pattern: {
                    value: /^[a-zA-Z0-9_]+$/,
                    message:
                      "Lastname can only contain letters, numbers, and underscores",
                  },
                }}
              />
              <ErrorsFormField
                control={control}
                errors={errors}
                hasError={!!errors.email}
                controllerName="email"
                label="Email"
                placeholder={user?.email || ""}
                rules={{
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                    message: "Invalid email format",
                  },
                }}
              />
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
                    message:
                      'Gender must be either "male", "female", or "other"',
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
                placeholder={user?.hashtags.join(",") || ""}
                type="hashtags"
                options={HASHTAGS.map((value) => ({
                  value,
                  label: value,
                }))}
              />
              <div className="flex flex-col">
                <NavBarButton
                  onClick={() => setPasswordModal(true)}
                  text="Update Password"
                  type="button"
                />
                <NavBarButton
                  onClick={() => setPositionModal(true)}
                  text="Update Position"
                  type="button"
                />
              </div>
              <UserImage
                controllerName="Profil Pictures"
                label="Profil Pictures"
                setNewImage={setNewImage}
                setError={setError}
              />
              <NavBarButton
                disabled={Object.keys(errors).length > 0}
                text="Submit"
                type="submit"
              />
            </form>
          </div>
        </TristanSection>
        {passwordModal ? (
          <PasswordMod
            title="Password Modal"
            modalId={"Password Modal"}
            closeModal={(updated) => {
              setPasswordModal(false);
              if (updated) {
                setIsSubmitted(true);
                setTimeout(() => {
                  setIsSubmitted(false);
                }, 3000);
              }
            }}
          />
        ) : null}
        {positionModal ? (
          <PositionModal
            title="Position Modal"
            modalId={"Position Modal"}
            closeModal={(updated) => {
              setPositionModal(false);
              if (updated) {
                setIsSubmitted(true);
                setTimeout(() => {
                  setIsSubmitted(false);
                }, 3000);
              }
            }}
          />
        ) : null}
      </div>
    </div>
  );
};

export default SettingsPage;
