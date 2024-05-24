import React, { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import ErrorsFormField from "../components/auth/ErrorsFormField";
import { NavBarButton } from "../components/Buttons";
import { useUserContext } from "../context/UserContext";

interface Props {
  modalId: string;
  title: string;
  closeModal: (updated: boolean) => void;
}

interface ModalInputs {
  latitude: number;
  longitude: number;
}

const PositionModal: React.FC<Props> = ({ modalId, title, closeModal }) => {
  const { user, updateUser } = useUserContext();
  const [error, setError] = useState<string>();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ModalInputs>({ mode: "onTouched", criteriaMode: "all" });

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
    closeModal(true);
  };

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

  const onSubmit = async (data: ModalInputs) => {
    try {
      await updateUserLocation(data.latitude, data.longitude);
      closeModal(true);
    } catch (error: any) {
      setError(error.response.data.error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 dark:border border-gray-700 rounded-lg shadow max-w-lg">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
          <div className="relative w-full max-w-lg max-h-full no-scrollbar">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white mb-8">
              Update your Location
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
                control={control}
                errors={errors}
                hasError={!!errors.latitude}
                controllerName="latitude"
                label="Latitude"
                placeholder={user?.latitude.toString() || ""}
                rules={{
                  required: "Latitude is required",
                  min: {
                    value: -90,
                    message: "Latitude must be at least -90",
                  },
                  max: {
                    value: 90,
                    message: "Latitude must be at most 90",
                  },
                }}
              />
              <ErrorsFormField
                control={control}
                errors={errors}
                hasError={!!errors.longitude}
                controllerName="longitude"
                label="Longitude"
                placeholder={user?.longitude.toString() || ""}
                rules={{
                  required: "Longitude is required",
                  min: {
                    value: -180,
                    message: "Longitude must be at least -180",
                  },
                  max: {
                    value: 180,
                    message: "Longitude must be at most 180",
                  },
                }}
              />
              <div className="flex flex-row">
                <div className="flex items-left">
                  <NavBarButton
                    disabled={Object.keys(errors).length > 0}
                    text="Submit"
                    type="submit"
                  />
                </div>
                <div className="flex items-center mx-8">
                  <NavBarButton
                    onClick={() => {
                      getLocation();
                    }}
                    text="Get current location"
                    type="button"
                  />
                </div>
                <div className="flex items-right">
                  <NavBarButton
                    onClick={() => {
                      closeModal(false);
                    }}
                    text="Close"
                    type="button"
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PositionModal;
