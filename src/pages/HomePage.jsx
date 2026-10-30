import Chat from '../components/Chat.jsx';

function HomePage({ socket }) {
  return <Chat socket={socket} />;
}

export default HomePage;
