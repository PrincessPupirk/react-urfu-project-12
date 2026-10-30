import AddChannelModal from './modals/AddChannelModal.jsx';
import RemoveChannelModal from './modals/RemoveChannelModal.jsx';
import RenameChannelModal from './modals/RenameChannelModal.jsx';

function ChatModals() {
  return (
    <>
      <AddChannelModal />
      <RenameChannelModal />
      <RemoveChannelModal />
    </>
  );
}

export default ChatModals;
