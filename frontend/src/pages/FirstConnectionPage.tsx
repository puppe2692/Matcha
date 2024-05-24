import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useUserContext } from "../context/UserContext";
import ErrorsFormField from "../components/auth/ErrorsFormField";
import UserImage from "../components/users/UserImages";
import TristanSection from "../components/TristanSection";
import { NavBarButton } from "../components/Buttons";
import { BIO_MAX_LENGTH, BIO_MIN_LENGTH, HASHTAGS } from "../shared/misc";

interface ModalInputs {
  gender: string;
  sex_pref: string;
  bio: string;
  age: number;
  hashtags: string[];
  picture: string[];
}

const FirstConnectionPage: React.FC = () => {
  const [error, setError] = useState<string>("");
  const { updateUser } = useUserContext();
  const [imageUpload, setImageUpload] = useState<boolean>(false);
  const navigate = useNavigate();

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ModalInputs>({ mode: "onTouched", criteriaMode: "all" });

  const onSubmit = async (data: ModalInputs) => {
    if (!imageUpload) {
      setError("You must upload at least one profile picture");
      return;
    }
    if (!user?.latitude || !user?.longitude) {
      setError("Please select a geolocation option");
      return;
    }
    try {
      const response = await axios.post(
        `http://${process.env.REACT_APP_SERVER_ADDRESS}:5000/users/firstco`,
        {
          gender: data.gender,
          sex_pref: data.sex_pref,
          bio: data.bio,
          age: data.age,
          hashtags: data.hashtags,
        },
        { withCredentials: true }
      );
      updateUser(response.data.user);
      navigate("/loading");
    } catch (error: any) {
      setError(error.response.data.error);
    }
  };

  useEffect(() => {
    const updateUserLocation = async (latitude: number, longitude: number) => {
      try {
        await axios.put(
          `http://${process.env.REACT_APP_SERVER_ADDRESS}:5000/users/update_location`,
          {
            latitude: latitude,
            longitude: longitude,
          },
          { withCredentials: true }
        );
        updateUser({
          ...user,
          latitude: latitude,
          longitude: longitude,
        });
      } catch (error) {
        console.error(error);
      }
    };

    const fetchIPLocation = async () => {
      const response = await axios.get("https://ipapi.co/json/");
      return {
        latitude: response.data.latitude,
        longitude: response.data.longitude,
      };
    };

    const getLocation = async () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            updateUserLocation(
              position.coords.latitude,
              position.coords.longitude
            );
          },
          async () => {
            const data = await fetchIPLocation();
            await updateUserLocation(data.latitude, data.longitude);
          }
        );
      } else {
        const data = await fetchIPLocation();
        await updateUserLocation(data.latitude, data.longitude);
      }
    };
    if (!user) {
      return;
    }
    getLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  return (
    <TristanSection>
      <div className="relative w-full max-w-lg max-h-full no-scrollbar">
        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white mb-8">
          Complete your profile
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
            placeholder="Gender"
            options={["Male", "Female", "Other"].map((value) => ({
              value,
              label: value,
            }))}
            rules={{
              required: "Gender is required",
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
            placeholder="Sexual Preference"
            options={["Male", "Female", "Both"].map((value) => ({
              value,
              label: value,
            }))}
            rules={{
              required: "sexual preferance is required",
            }}
          />
          <ErrorsFormField
            control={control}
            errors={errors}
            hasError={!!errors.bio}
            controllerName="bio"
            label="Bio"
            placeholder="Bio"
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
            placeholder="Age"
            options={Array.from({ length: 82 }, (_, index) => ({
              value: (index + 18).toString(),
              label: (index + 18).toString(),
            }))}
            rules={{
              required: "Age is required",
            }}
          />
          <ErrorsFormField
            input="multiple"
            control={control}
            errors={errors}
            hasError={!!errors.hashtags}
            controllerName="hashtags"
            label="Hashtags"
            placeholder="Hashtags"
            type="hashtags"
            options={HASHTAGS.map((value) => ({
              value,
              label: value,
            }))}
            rules={{
              required: "Hashtags are required",
            }}
          />
          <UserImage
            controllerName="Profil Pictures"
            label="Profil Pictures"
            setImageUpload={setImageUpload}
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
  );
};

export default FirstConnectionPage;
