import React, { useState} from "react";
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { useUserContext } from '../../context/UserContext';
import { NavBarButton } from '../../components/Buttons';
import { useNavigate } from 'react-router-dom';

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

const TwoFactorMod: React.FC<Props> = ({
  modalId,
  title,
  closeModal,
}) => {
	const [error, setError] = useState<string>();
    const navigate = useNavigate();
    const { user, loginUser } = useUserContext();

    const {
        handleSubmit,
        control,
        formState: { errors },
        watch,
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
                    hastags: data.hashtag,
					profile_picture: data.picture,
                },
                { withCredentials: true },
            );
            loginUser(response.data.user);
            closeModal(); // a verifier ici
        } catch (error: any) {
            setError(error.response.data.error);
        }
    };


  return (
    <>
      <div
        id={modalId}
        className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none no-scrollbar"
      ></div>
	</>
  );
};

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