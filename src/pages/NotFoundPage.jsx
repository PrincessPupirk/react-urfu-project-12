import { Title } from '@mantine/core';
import { useTranslation } from 'react-i18next';

function NotFoundPage() {
  const { t } = useTranslation();

  return (
    <div className="not-found-page">
      <Title order={1}>{t('notFound.title')}</Title>
      <Title order={3}>{t('notFound.message')}</Title>
    </div>
  );
}

export default NotFoundPage;
