import icon from '../../assets/icon.svg';
import './App.css';

const Hello = () => {
  return (
    <div>
      <div className="Hello">
        <img width="60px" alt="icon" src={icon} />
        <h1>Tailchat</h1>
      </div>
      <div>
        <button
          type="button"
          onClick={() => {
            window.electron.ipcRenderer.sendMessage('selectServer', {
              url: 'https://nightly.paw.msgbyte.com/',
            });
          }}
        >
          Nightly
        </button>
      </div>
      <div className="Hello">
        <button
          type="button"
          onClick={() => {
            window.open('https://tailchat.msgbyte.com/');
          }}
        >
          Learn More
        </button>

        <button
          type="button"
          onClick={() => {
            window.electron.ipcRenderer.sendMessage('close');
          }}
        >
          Exit
        </button>
      </div>
    </div>
  );
};

export default function App() {
  return <Hello />;
}
