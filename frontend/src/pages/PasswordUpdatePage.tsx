import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import ErrorsFormField from "../components/auth/ErrorsFormField";
import { NavBarButton } from "../components/Buttons";
import ReportedModal from "../components/ReportedModal";

interface ModalInputs {
  password: string;
  confirmPassword: string;
}

const PasswordUpdatePage: React.FC = () => {
  const [error, setError] = useState<string>();
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const {
    handleSubmit,
    control,
    formState: { errors },
    watch,
  } = useForm<ModalInputs>({ mode: "onTouched", criteriaMode: "all" });
  const navigate = useNavigate();
  const id = new URLSearchParams(useLocation().search).get("id");
  const token = new URLSearchParams(useLocation().search).get("token");

  const passwordInput = watch("password");

  const onSubmit = async (data: ModalInputs) => {
    try {
      await axios.post(
        `http://${process.env.REACT_APP_SERVER_ADDRESS}:5000/auth/resetpassword/${id}/${token}`,
        {
          password: data.password,
        },
        { withCredentials: true }
      );
      console.log("password updated");
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        navigate("/signin");
      }, 2000);
    } catch (error: any) {
      setError(error.response.data.error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 dark:border border-gray-700 rounded-lg shadow max-w-lg">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
          <ReportedModal
            showReportedModal={isSubmitted}
            reportedModalMessage="Password successfully updated - Redirecting to login page"
            isReportedMod={false}
            closeReportedModal={() => setIsSubmitted(false)}
          />
          <div className="relative w-full max-w-lg max-h-full no-scrollbar">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white mb-8">
              Update your password
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
                hasError={!!errors.password}
                controllerName="password"
                label="Password"
                placeholder="Password"
                type="password"
                rules={{
                  required: "Password is required",
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
                  required: "Password confirmation is required",
                  validate: {
                    matchesPreviousPassword: (value: string) =>
                      value === passwordInput || "Passwords must match",
                  },
                }}
              />
              <div className="flex items-center">
                <NavBarButton
                  disabled={Object.keys(errors).length > 0}
                  text="Submit"
                  type="submit"
                />
                <div className="ml-28">
                  <NavBarButton
                    onClick={() => {
                      navigate("/signin");
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

export default PasswordUpdatePage;
