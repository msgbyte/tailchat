import { Input, message, Modal } from 'antd';
import React, { useState } from 'react';
import { ServerItem } from './ServerItem';
import { useServerStore } from './store/server';
import addIcon from '../../assets/add.svg';
import './ServerItem.css';

export const AddServerItem: React.FC = React.memo(() => {
  const { addServer } = useServerStore();
  const [messageApi, contextHolder] = message.useMessage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [url, setUrl] = useState('');

  return (
    <>
      {contextHolder}

      <ServerItem
        icon={addIcon}
        onClick={() => {
          setIsModalOpen(true);
        }}
      >
        Add Server
      </ServerItem>

      <Modal
        title="Add new Server"
        open={isModalOpen}
        onOk={() => {
          addServer(url)
            .then(() => {
              messageApi.success('Server Added Success');
              setUrl('');
              setIsModalOpen(false);
            })
            .catch((err) => {
              messageApi.error('Server Added Failed:' + String(err));
            });
        }}
        onCancel={() => {
          setIsModalOpen(false);
        }}
      >
        <div>Input Server Url</div>
        <Input value={url} onChange={(e) => setUrl(e.target.value)} />
      </Modal>
    </>
  );
});
AddServerItem.displayName = 'AddServerItem';
