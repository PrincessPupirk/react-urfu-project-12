import i18n from '../i18n.js';

function ErrorFallback() {
  return (
    <div className="error-fallback">
      {i18n.t('errors.boundary')}
    </div>
  );
}

export default ErrorFallback;
