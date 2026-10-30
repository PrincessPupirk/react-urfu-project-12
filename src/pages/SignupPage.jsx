import { useState } from 'react';
import {
  Alert,
  Anchor,
  Button,
  PasswordInput,
  TextInput,
  Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { postSignup } from '../api/http.js';
import { useAuth } from '../context/stores.jsx';

function SignupPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const setAuth = useAuth((state) => state.setAuth);
  const [signupError, setSignupError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    initialValues: {
      username: '',
      password: '',
      confirmPassword: '',
    },
    validate: {
      username: (value) => {
        const trimmed = value?.trim() ?? '';
        if (!trimmed) {
          return t('validation.required');
        }
        if (trimmed.length < 3 || trimmed.length > 20) {
          return t('validation.usernameLength');
        }
        return null;
      },
      password: (value) => {
        if (!value) {
          return t('validation.required');
        }
        if (value.length < 6) {
          return t('validation.passwordMin');
        }
        return null;
      },
      confirmPassword: (value, values) => {
        if (!value) {
          return t('validation.required');
        }
        if (value !== values.password) {
          return t('validation.passwordMatch');
        }
        return null;
      },
    },
  });

  const handleSubmit = async (values) => {
    setSignupError(null);
    setIsSubmitting(true);

    try {
      const data = await postSignup({
        username: values.username.trim(),
        password: values.password,
      });
      setAuth(data);
      navigate('/');
    } catch (error) {
      if (error.status === 409) {
        setSignupError(t('signup.userExists'));
        return;
      }
      setSignupError(t('signup.error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <Title order={2}>{t('signup.title')}</Title>
      {signupError && (
        <Alert color="red" mt="md">
          {signupError}
        </Alert>
      )}
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          label={t('signup.usernameLabel')}
          placeholder={t('signup.usernamePlaceholder')}
          required
          mt="md"
          disabled={isSubmitting}
          {...form.getInputProps('username')}
        />
        <PasswordInput
          label={t('signup.passwordLabel')}
          placeholder={t('signup.passwordPlaceholder')}
          required
          mt="md"
          disabled={isSubmitting}
          {...form.getInputProps('password')}
        />
        <PasswordInput
          label={t('signup.confirmPasswordLabel')}
          placeholder={t('signup.confirmPasswordPlaceholder')}
          required
          mt="md"
          disabled={isSubmitting}
          {...form.getInputProps('confirmPassword')}
        />
        <Button type="submit" mt="xl" loading={isSubmitting}>
          {t('signup.submit')}
        </Button>
      </form>
      <Anchor component={Link} to="/login" mt="md" display="inline-block">
        {t('signup.loginLink')}
      </Anchor>
    </div>
  );
}

export default SignupPage;
