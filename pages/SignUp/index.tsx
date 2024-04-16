import Input from '@/src/components/common/Input';
import styles from './SignUp.module.scss';
import React, { useState } from 'react';
import Link from 'next/link';

export default function SignUp() {
  const [formData, setFormData] = useState({
    email: '',
    nickname: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateEmail = (value: string): string => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value) return '이메일을 입력해주세요.';
    if (!emailRegex.test(value)) {
      return '이메일 형식으로 작성해 주세요.';
    }
    return '';
  };

  const validateNickname = (value: string) => {
    if (!value) return '닉네임을 입력해주세요.';
    if (value.length > 11) return '열 자 이하로 작성해주세요.';
    return '';
  };

  const validatePassword = (value: string) => {
    if (!value) return '비밀번호를 입력해 주세요.';
    if (value.length < 8) return '8자 이상 입력해 주세요.';
    return '';
  };

  const validateConfirmPassword = (value: string) => {
    if (!value) return '비밀번호를 입력해 주세요.';
    if (value.length < 8) return '8자 이상 입력해 주세요.';
    if (value !== formData.password) return '비밀번호가 일치하지 않습니다.';
    return '';
  };

  const goToHome = () => {
    window.location.href = '/';
  };

  return (
    <>
      <div className={styles.bigContainer}>
        <div className={styles.logoContainer}>
          <img src="./Logo.svg" alt="로고그림" className={styles.logoImage} onClick={goToHome} />
          <img src="./Taskify.svg" alt="로고명" className={styles.logoName} onClick={goToHome} />
        </div>
        <div className={styles.welcomeMessage}>첫 방문을 환영합니다!</div>
        <div className={styles.inputContainer}>
          <div className={styles.title}>이메일</div>
          <Input
            type="email"
            name="email"
            placeholder="이메일을 입력해 주세요"
            value={formData.email}
            onChange={handleChange}
            validate={validateEmail}
          />
          <div className={styles.title}>닉네임</div>
          <Input
            type="text"
            name="nickname"
            placeholder="닉네임을 입력해 주세요"
            value={formData.nickname}
            onChange={handleChange}
            validate={validateNickname}
          />
          <div className={styles.title}>비밀번호</div>
          <Input
            type="password"
            name="password"
            placeholder="8자 이상 입력해 주세요"
            value={formData.password}
            onChange={handleChange}
            validate={validatePassword}
          />
          <div className={styles.title}>비밀번호 확인</div>
          <Input
            type="password"
            name="confirmPassword"
            placeholder="비밀번호를 한번 더 입력해 주세요"
            value={formData.confirmPassword}
            onChange={handleChange}
            validate={validateConfirmPassword}
          />
        </div>
      </div>
    </>
  );
}
