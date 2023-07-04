import icon from '../../assets/icon.svg';
import { ServerItem } from './ServerItem';
import React from 'react';
import { defaultServerList, useServerStore } from './store/server';
import { AddServerItem } from './AddServerItem';
import { Dropdown, Modal } from 'antd';
import './App.css';

const Hello: React.FC = React.memo(() => {
  const { serverList, removeServer } = useServerStore();

  return (
    <div>
      <div className="header">
        <h1>Select your server...</h1>
      </div>
      <div className="server-list">
        {serverList.map((serverInfo, i) => {
          return (
            <Dropdown
              key={i}
              trigger={['contextMenu']}
              menu={{
                items: [
                  {
                    key: 'remove',
                    label: 'Delete Server',
                    disabled:
                      defaultServerList.findIndex(
                        (info) => info.url === serverInfo.url
                      ) >= 0, // is default server
                    onClick: () => {
                      Modal.confirm({
                        title: 'Do you Want to delete this server?',
                        onOk() {
                          removeServer(serverInfo.url);
                        },
                      });
                    },
                  },
                ],
              }}
            >
              <div>
                <ServerItem
                  icon={serverInfo.icon ?? icon}
                  version={serverInfo.version}
                  onClick={() => {
                    window.electron.ipcRenderer.sendMessage('selectServer', {
                      url: serverInfo.url,
                    });
                  }}
                >
                  {serverInfo.name}
                </ServerItem>
              </div>
            </Dropdown>
          );
        })}

        <AddServerItem />
      </div>

      <div className="actions">
        <button
          type="button"
          onClick={() => {
            window.open('https://tailchat.msgbyte.com/');
          }}
        >
          Website
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
});
Hello.displayName = 'Hello';

export default function App() {
  return <Hello />;
}
