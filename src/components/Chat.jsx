import { Alert, Center, Loader } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import ChannelList from '../components/ChannelList.jsx';
import ChatModals from '../components/ChatModals.jsx';
import MessageForm from '../components/MessageForm.jsx';
import MessageList from '../components/MessageList.jsx';
import useChatData from '../hooks/useChatData.js';
import useChatSocket from '../hooks/useChatSocket.js';
import { useChatUi } from '../context/stores.jsx';

function Chat({ socket }) {
  const { t } = useTranslation();
  const { isLoading, isError } = useChatData();
  const socketConnected = useChatUi((state) => state.socketConnected);

  useChatSocket(socket);

  if (isLoading) {
    return (
      <Center className="chat-loader">
        <Loader />
      </Center>
    );
  }

  if (isError) {
    return (
      <Alert color="red" m="md">
        {t('chat.loadError')}
      </Alert>
    );
  }

  return (
    <div className="chat-layout">
      {!socketConnected && (
        <Alert className="connection-alert" color="yellow">
          {t('chat.networkReconnect')}
        </Alert>
      )}
      <ChannelList />
      <section className="chat-panel">
        <MessageList />
        <MessageForm />
      </section>
      <ChatModals />
    </div>
  );
}

export default Chat;
