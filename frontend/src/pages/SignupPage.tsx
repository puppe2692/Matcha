import axios from "axios";
import React, { useState } from "react";
import { NavBarButton } from "../components/Buttons";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import ErrorsFormField from "../components/auth/ErrorsFormField";
import { useUserContext } from "../context/UserContext";
import {
  USERNAME_MAX_LENGTH,
  USERNAME_MIN_LENGTH,
  FIRSTNAME_MIN_LENGTH,
  FIRSTNAME_MAX_LENGTH,
  LASTNAME_MIN_LENGTH,
  LASTNAME_MAX_LENGTH,
} from "../shared/misc";
import TristanSection from "../components/TristanSection";
import AlreadyConnected from "../components/AlreadyConnected";

interface Inputs {
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const SignUpPage: React.FC = () => {
  const [error, setError] = useState<string>();
  const navigate = useNavigate();
  const { user, loginUser } = useUserContext();

  const {
    handleSubmit,
    control,
    formState: { errors },
    watch,
  } = useForm<Inputs>({ mode: "onTouched", criteriaMode: "all" });

  const passwordInput = watch("password");

  const onSubmit = async (data: Inputs) => {
    try {
      const response = await axios.post(
        `http://${process.env.REACT_APP_SERVER_ADDRESS}:5000/auth/signup`,
        {
          username: data.username,
          firstname: data.firstname,
          lastname: data.lastname,
          email: data.email,
          password: data.password,
        },
        { withCredentials: true }
      );
      loginUser(response.data.user);
      navigate("/loading");
    } catch (error: any) {
      setError(error.response.data.error);
    }
  };

  return user ? (
    <AlreadyConnected />
  ) : (
    <TristanSection>
      <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
        Create your account
      </h1>
      {error && (
        <p className="error mt-2 text-sm font-bold text-red-600 dark:text-red-500">
          Failed to sign up: {error}
        </p>
      )}
      <form
        className="space-y-4 md:space-y-6"
        onSubmit={handleSubmit(onSubmit)}
      >
        <ErrorsFormField
          control={control}
          errors={errors}
          hasError={!!errors.username}
          controllerName="username"
          label="Username"
          placeholder="Username"
          rules={{
            minLength: {
              value: USERNAME_MIN_LENGTH,
              message: `Username must be at least ${USERNAME_MIN_LENGTH} characters long`,
            },
            maxLength: {
              value: USERNAME_MAX_LENGTH,
              message: `Username must be at most ${USERNAME_MAX_LENGTH} characters long`,
            },
            pattern: {
              value: /^[a-zA-Z0-9_]+$/,
              message:
                "Username can only contain letters, numbers, and underscores",
            },
          }}
        />
        <ErrorsFormField
          control={control}
          errors={errors}
          hasError={!!errors.firstname}
          controllerName="firstname"
          label="firstname"
          placeholder="firstname"
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
          label="lastname"
          placeholder="lastname"
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
          placeholder="Email"
          rules={{
            required: "Email is required",
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
              message: "Invalid email format",
            },
          }}
        />
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
                /\d/.test(value) || "Password must contain at least one digit",
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
        <NavBarButton
          disabled={Object.keys(errors).length > 0}
          text="Sign up"
          type="submit"
        />
      </form>

      <p className="text-sm font-light text-gray-500 dark:text-gray-400">
        Already have an account?{" "}
        <a
          href="/signin"
          className="font-medium text-blue-500 hover:underline dark:text-primary-500"
        >
          Sign in here
        </a>
      </p>
    </TristanSection>
  );
};

export default SignUpPage;
