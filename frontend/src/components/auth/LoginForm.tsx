import React from "react";
import axios from "axios";
import { NavBarButton } from "../Buttons";
import { useState } from "react";
import { useForm } from "react-hook-form";
import ErrorsFormField from "./ErrorsFormField";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../../context/UserContext";
import { useWebSocketContext } from "../../context/WebSocketContext";

interface LoginInputs {
  username: string;
  password: string;
}

interface Props {
  setUsername: (username: string) => void;
}

const LoginForm: React.FC<Props> = ({ setUsername }) => {
  const [error, setError] = useState<string>();
  const { loginUser } = useUserContext();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<LoginInputs>({ mode: "onTouched", criteriaMode: "all" });
  const navigate = useNavigate();
  const socket = useWebSocketContext();

  const onSubmit = async (data: LoginInputs) => {
    setError(undefined);
    try {
      const response = await axios.post(
        `http://${process.env.REACT_APP_SERVER_ADDRESS}:5000/auth/signin`,
        {
          username: data.username,
          password: data.password,
        },
        { withCredentials: true }
      );
      loginUser(response.data.user);
      socket?.emit("login", response.data.user.id);
      navigate("/welcome");
    } catch (error: any) {
      setError(error.response.data.error);
    }
  };

  return (
    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
      <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
        Sign in to your account
      </h1>
      {error && (
        <p className="error mt-2 text-sm font-bold text-red-600 dark:text-red-500">
          Failed to sign in: {error}
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
            required: "Username is required",
            minLength: {
              value: 3,
              message: "Username must be at least 3 characters long",
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
          hasError={!!errors.password}
          controllerName="password"
          label="Password"
          placeholder="Password"
          type="password"
          rules={{
            required: "Password is required",
          }}
        />
        <NavBarButton
          disabled={Object.keys(errors).length > 0}
          text="Sign in with username"
          type="submit"
        />
      </form>
      <p className="text-sm font-light text-gray-500 dark:text-gray-400">
        Don’t have an account yet?{" "}
        <a
          href="/signup"
          className="font-medium text-blue-500 hover:underline dark:text-primary-500"
        >
          Sign up
        </a>
      </p>
    </div>
  );
};

export default LoginForm;
