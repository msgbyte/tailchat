import React from 'react';
import CardWithIcon from './CardWithIcon';
import { Welcome } from './Welcome';
import PersonIcon from '@mui/icons-material/Person';
import MessageIcon from '@mui/icons-material/Message';
import GroupIcon from '@mui/icons-material/Group';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { useGetList } from 'react-admin';
import { Grid } from '@mui/material';

export const Dashboard: React.FC = React.memo(() => {
  const { total: usersNum } = useGetList('users', {
    pagination: { page: 1, perPage: 1 },
  });
  const { total: tempUsersNum } = useGetList('users', {
    filter: { temporary: true },
    pagination: { page: 1, perPage: 1 },
  });
  const { total: messageNum } = useGetList('messages', {
    pagination: { page: 1, perPage: 1 },
  });
  const { total: groupNum } = useGetList('groups', {
    pagination: { page: 1, perPage: 1 },
  });
  const { total: fileNum } = useGetList('file', {
    pagination: { page: 1, perPage: 1 },
  });

  return (
    <div>
      <Welcome />

      <Grid container spacing={2}>
        <Grid item xs={4}>
          <CardWithIcon
            to="/admin/users"
            icon={PersonIcon}
            title={'用户数'}
            subtitle={usersNum}
          />
        </Grid>
        <Grid item xs={4}>
          <CardWithIcon
            to="/admin/users"
            icon={PersonIcon}
            title={'临时用户数'}
            subtitle={tempUsersNum}
          />
        </Grid>
        <Grid item xs={4}>
          <CardWithIcon
            to="/admin/messages"
            icon={MessageIcon}
            title={'总消息数'}
            subtitle={messageNum}
          />
        </Grid>
        <Grid item xs={4}>
          <CardWithIcon
            to="/admin/groups"
            icon={GroupIcon}
            title={'总群组数'}
            subtitle={groupNum}
          />
        </Grid>
        <Grid item xs={4}>
          <CardWithIcon
            to="/admin/file"
            icon={AttachFileIcon}
            title={'总文件数'}
            subtitle={fileNum}
          />
        </Grid>
      </Grid>
    </div>
  );
});
Dashboard.displayName = 'Dashboard';
