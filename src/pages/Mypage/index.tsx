import { useEffect, useState, ChangeEvent, ReactElement } from 'react';
import Image from 'next/image';
import { NextPageWithLayout } from '../_app';
import HeaderSidebarLayout from '@/src/components/common/Layout/HeaderSidebarLayout';
import SingleButtonModal from '@/src/components/Modal/SingleButtonModal';
import TaskButton from '@/src/components/common/Button/TaskButton';
import httpClient from '@/src/apis/httpClient';
import { initialUserInfo } from '@/src/types/mypageResponse';
import addIcon from '@/src/assets/icons/addIcon.svg';
import styles from './Mypage.module.scss';
import { useRouter } from 'next/router';

const Mypage: NextPageWithLayout = () => {
  const [userInfo, setUserInfo] = useState(initialUserInfo);
  const [nickname, setNickname] = useState<string>('');
  const [profileImage, setProfileImage] = useState<string>('');
  const [isUpdateTrigger, setIsUpdateTrigger] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string>('');
  const [isButtonEnabled, setIsButtonEnabled] = useState<boolean>(false);
  const [isSaveButtonEnabled, setIsSaveButtonEnabled] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalMessage, setModalMessage] = useState<string>('');

  const router = useRouter();

  // userInfo 가져오기
  async function getUserInfo() {
    try {
      const response = await httpClient.get('/users/me');
      setUserInfo(response.data);
      setProfileImage(response.data.profileImageUrl);
      return response.data;
    } catch (error) {
      console.error('유저 정보를 가져오는 중 오류 발생:', error);
      throw error;
    }
  }

  useEffect(() => {
    getUserInfo()
      .then(userInfo => {
        console.log('유저 정보:', userInfo);
      })
      .catch(error => {
        console.error('유저 정보를 가져오는 중 오류 발생:', error);
      });
  }, [isUpdateTrigger]);

  // profile 이미지 업로드
  const handleImageChangeTest = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      const formData = new FormData();
      formData.append('image', file);

      httpClient
        .post('/users/me/image', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then(response => {
          setProfileImage(response.data.profileImageUrl);
        })
        .catch(error => {
          console.error('이미지 업로드 오류:', error);
        });
    }
  };

  // profile 변경 버튼 활성화 관련
  useEffect(() => {
    if ((nickname.length > 0 && userInfo.nickname !== nickname) || userInfo.profileImageUrl !== profileImage) {
      setIsSaveButtonEnabled(true);
    } else {
      setIsSaveButtonEnabled(false);
    }
  }, [nickname, profileImage]);

  // profile 변경
  const handleUserInfoChange = () => {
    const modifiedUserInfo = {
      nickname: nickname || userInfo.nickname,
      profileImageUrl: profileImage,
    };

    httpClient
      .put('/users/me', modifiedUserInfo)
      .then(response => {
        setModalMessage('🥸 프로필이 변경됐어요 🥸');
        setIsModalOpen(true);
        setIsSaveButtonEnabled(false);
        setNickname('');
        setIsUpdateTrigger(prevState => !prevState);
        setUserInfo(response.data);
      })
      .catch(error => {
        console.error('사용자 정보 수정 오류:', error);
      });
  };

  // 새 비밀번호 확인 error 관련
  const handleConfirmPasswordBlur = () => {
    if (newPassword !== confirmPassword) {
      setPasswordError('비밀번호가 일치하지 않습니다.');
    } else {
      setPasswordError('');
    }
  };

  // 비밀번호 변경 버튼 활성화 관련
  useEffect(() => {
    if (
      password.length >= 8 &&
      newPassword.length >= 8 &&
      confirmPassword.length >= 8 &&
      newPassword === confirmPassword
    ) {
      setIsButtonEnabled(true);
    } else {
      setIsButtonEnabled(false);
    }
  }, [password, newPassword, confirmPassword]);

  // 비밀번호 변경
  const handlePasswordInfoChange = () => {
    const modifiedPasswordInfo = {
      password: password,
      newPassword: newPassword,
    };

    httpClient
      .put('/auth/password', modifiedPasswordInfo)
      .then(response => {
        setIsUpdateTrigger(prevState => !prevState);
        setPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setModalMessage('🤓 비밀번호가 변경됐어요 🤓');
        setIsModalOpen(true);
      })
      .catch(error => {
        setModalMessage(error.response.data.message);
        setIsModalOpen(true);
      });
  };

  // modal 닫기
  const handleModalClose = () => {
    setModalMessage('');
    setIsModalOpen(false);
    router.reload();
  };

  return (
    <>
      {isModalOpen && (
        <div>
          <SingleButtonModal isOpen onClose={handleModalClose}>
            {modalMessage}
          </SingleButtonModal>
        </div>
      )}
      <div className={styles.mypageContent}>
        <section className={styles.mypageSection}>
          <h3 className={styles.title}>프로필</h3>
          <div className={styles.profileContent}>
            <div className={styles.imageUpload}>
              <label htmlFor="imageInputField" className={styles.imageInputButton}>
                {profileImage ? (
                  <Image
                    className={styles.imagePreview}
                    src={profileImage}
                    layout="responsive"
                    width={30}
                    height={30}
                    alt="추가한 이미지"
                  />
                ) : (
                  <Image className={styles.addIcon} src={addIcon} width={30} height={30} alt="추가한 이미지" />
                )}
              </label>
              <input
                id="imageInputField"
                type="file"
                accept="image/*"
                onChange={handleImageChangeTest}
                className={styles.imageInputField}
              />
            </div>
            <div className={styles.profileInputBox}>
              <div className={styles.labelAndInput}>
                <label className={styles.inputLabel}>이메일</label>
                <input className={styles.profileInput} value={userInfo.email} disabled />
              </div>
              <div className={styles.labelAndInput}>
                <label className={styles.inputLabel}>닉네임</label>
                <input
                  className={styles.profileInput}
                  placeholder={userInfo.nickname}
                  value={nickname}
                  maxLength={10}
                  onChange={e => setNickname(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className={styles.taskBtn}>
            <TaskButton
              size={'large'}
              color={'violet'}
              onClick={handleUserInfoChange}
              isDisabled={!isSaveButtonEnabled}>
              저장
            </TaskButton>
          </div>
        </section>
        <section className={styles.mypageSection}>
          <h3 className={styles.title}>비밀번호 변경</h3>
          <div className={styles.passwordChangeContent}>
            <div className={styles.labelAndInput}>
              <label className={styles.inputLabel}>현재 비밀번호</label>
              <input
                className={styles.passwordChangeInput}
                type="password"
                placeholder="현재 비밀번호 입력"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
            <div className={styles.labelAndInput}>
              <label className={styles.inputLabel}>새 비밀번호</label>
              <input
                className={styles.passwordChangeInput}
                type="password"
                placeholder="새 비밀번호 입력"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
              />
            </div>
            <div className={styles.labelAndInput}>
              <label className={styles.inputLabel}>새 비밀번호 확인</label>
              <input
                className={`${passwordError && styles.isInputError} ${styles.passwordChangeInput}`}
                type="password"
                placeholder="새 비밀번호 확인"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                onBlur={handleConfirmPasswordBlur}
              />
              {passwordError && <p className={styles.inputErrorMessage}>{passwordError}</p>}
            </div>
          </div>
          <div className={styles.taskBtn}>
            <TaskButton
              size={'large'}
              color={'violet'}
              onClick={handlePasswordInfoChange}
              isDisabled={!isButtonEnabled}>
              변경
            </TaskButton>
          </div>
        </section>
      </div>
    </>
  );
};

Mypage.getLayout = function getLayout(page: ReactElement) {
  return <HeaderSidebarLayout title="계정 관리">{page}</HeaderSidebarLayout>;
};

export default Mypage;
