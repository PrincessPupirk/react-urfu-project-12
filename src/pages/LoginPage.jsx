import { useState } from 'react';
import {
  Alert,
  Anchor,
  Button,
  TextInput,
  Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/stores.jsx';

function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const setAuth = useAuth((state) => state.setAuth);
  const [authError, setAuthError] = useState(null);

  const form = useForm({
    initialValues: {
      username: '',
      password: '',
    },
  });

  const handleSubmit = async (values) => {
    setAuthError(null);

    try {
      const response = await fetch('/api/v1/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        setAuthError(t('login.error'));
        return;
      }

      const data = await response.json();
      setAuth(data);
      navigate('/');
    } catch {
      setAuthError(t('login.error'));
    }
  };

  return (
    <div className="auth-page">
      <Title order={2}>{t('login.title')}</Title>
      {authError && (
        <Alert color="red" mt="md">
          {authError}
        </Alert>
      )}
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          label={t('login.usernameLabel')}
          placeholder={t('login.usernamePlaceholder')}
          withAsterisk={false}
          required
          mt="md"
          {...form.getInputProps('username')}
        />
        <TextInput
          type="password"
          label={t('login.passwordLabel')}
          placeholder={t('login.passwordPlaceholder')}
          withAsterisk={false}
          required
          mt="md"
          {...form.getInputProps('password')}
        />
        <Button type="submit" mt="xl">
          {t('login.submit')}
        </Button>
      </form>
      <Anchor component={Link} to="/signup" mt="md" display="inline-block">
        {t('login.signupLink')}
      </Anchor>
    </div>
  );
}

export default LoginPage;
