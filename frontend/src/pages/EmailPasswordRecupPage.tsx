import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import ErrorsFormField from "../components/auth/ErrorsFormField";
import { NavBarButton } from "../components/Buttons";
import ReportedModal from "../components/ReportedModal";

interface ModalInputs {
  email: string;
}

const EmailPasswordRecupPage: React.FC = () => {
  const [error, setError] = useState<string>();
  const [emailSent, setEmailSent] = useState<boolean>(false);
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ModalInputs>({ mode: "onTouched", criteriaMode: "all" });
  const navigate = useNavigate();

  const onSubmit = async (data: ModalInputs) => {
    try {
      await axios.post(
        `http://${process.env.REACT_APP_SERVER_ADDRESS}:5000/auth/forgotpassword`,
        {
          email: data.email,
        },
        { withCredentials: true }
      );
      setEmailSent(true);
      //   navigate("/signin");
    } catch (error: any) {
      setError(error.response.data.error);
    }
  };

  return (
    <div>
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 dark:border border-gray-700 rounded-lg shadow max-w-lg">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <ReportedModal
              showReportedModal={emailSent}
              reportedModalMessage="Email successfully sent, please check your email to reset your password"
              isReportedMod={false}
              closeReportedModal={() => setEmailSent(false)}
            />
            <div className="relative w-full max-w-lg max-h-full no-scrollbar">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white mb-8">
                Insert your Email
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
                  hasError={!!errors.email}
                  controllerName="email"
                  label="Email"
                  placeholder="Email"
                  rules={{
                    required: "Email is required",
                    pattern: {
                      value:
                        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                      message: "Invalid email format",
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
    </div>
  );
};

export default EmailPasswordRecupPage;
