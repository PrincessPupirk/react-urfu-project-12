import { Anchor, Button, Container, Group } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/stores.jsx';

function AppHeader() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const token = useAuth((state) => state.token);
  const removeAuth = useAuth((state) => state.removeAuth);

  const handleLogout = () => {
    removeAuth();
    navigate('/login');
  };

  return (
    <header className="app-header">
      <Container fluid px="md">
        <Group justify="space-between" h={56}>
          <Anchor component={Link} to="/" underline="never" fw={700}>
            {t('appName')}
          </Anchor>
          {token && (
            <Button variant="default" onClick={handleLogout}>
              {t('logout')}
            </Button>
          )}
        </Group>
      </Container>
    </header>
  );
}

export default AppHeader;
