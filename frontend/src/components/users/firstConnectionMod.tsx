import React, { useState} from "react";
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { useUserContext } from '../../context/UserContext';
import ErrorsFormField from '../auth/ErrorsFormField';
import UserImage from './UserImages';
import TristanSection from '../TristanSection';
import { NavBarButton } from '../../components/Buttons';
import { BIO_MAX_LENGTH, BIO_MIN_LENGTH} from '../../shared/misc';

interface Props {
  modalId: string;
  title: string;
  closeModal: () => void;
}

interface ModalInputs {
    gender: string;
    sex_pref: string;
    bio: string;
    age: number;
    hashtag: string[];
    picture:string[];
}

const FirstConnectionMod: React.FC<Props> = ({
  modalId,
  title,
  closeModal,
}) => {
	const [error, setError] = useState<string>();
  const { user, updateUser } = useUserContext();

  const {
      handleSubmit,
      control,
      formState: { errors },
  } = useForm<ModalInputs>({ mode: 'onTouched', criteriaMode: 'all' });

	const onSubmit = async (data: ModalInputs) => {
        try {
            const response = await axios.post(
                `http://${process.env.REACT_APP_SERVER_ADDRESS}:5000/users/firstco`,
                {
                    gender: data.gender,
					          sexual_preference: data.sex_pref,
					          bio: data.bio,
                    age: data.age,
                    hashtags: data.hashtag,
                },
                { withCredentials: true },
            );
            updateUser(response.data.user);
            closeModal(); // a verifier ici
        } catch (error: any) {
            setError(error.response.data.error);
        }
    };


  return (
    // <div
    // id={modalId}
    // className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none no-scrollbar"
    // >
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
                        options={['Male', 'Female', 'Other'].map((value) => ({ value, label: value }))}
                        rules={{
                          required: 'Gender is required',
                          enum: {
                            values: ['male', 'female', 'other'],
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
                        label="Sexual Preferance"
                        placeholder="Sexual Preferance"
                        options={['Male', 'Female', 'Both'].map((value) => ({ value, label: value }))}
                        rules={{
                          required: 'sexual preferance is required',
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
                          required: 'Age is required',
                        }}
                    />
                    <ErrorsFormField
                        control={control}
                        errors={errors}
                        hasError={!!errors.hashtag}
                        controllerName="hashtag"
                        label="Hashtags"
                        placeholder="Hashtags"
                        type="hashtag"
                        rules={{
                          required: 'Hashtags are required',
                          pattern: {
                              value: /^#[a-zA-Z0-9_]+$/, // Regular expression to match hashtags starting with #
                              message: 'Hashtags must start with # and can only contain letters, numbers, and underscores',
                          },
                        }}
                    />
                    <UserImage/>
                    <NavBarButton
                        disabled={Object.keys(errors).length > 0}
                        text="Submit"
                        type="submit"
                    />
            </form>
          </div>
        </TristanSection>
      // </div>
  );
};

export default FirstConnectionMod;

// {display2FAModal ? (
// 	<TwoFactorMod
// 		title="TWO-FACTOR AUTHENTICATION"
// 		qrCodeDataUrl={qrCodeDataUrl}
// 		secret={twoFactorSecret}
// 		modalId={'Enable-2fa-modal'}
// 		closeModal={() => setDisplay2FAModal(false)}
// 		onSubmit={enableTwoFactor}
// 		error={error}
// 	/>
// ) : null}