import React from 'react';
import CardWithIcon from './CardWithIcon';
import { Welcome } from './Welcome';
import PersonIcon from '@mui/icons-material/Person';
import MessageIcon from '@mui/icons-material/Message';
import GroupIcon from '@mui/icons-material/Group';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { useGetList, useTranslate } from 'react-admin';
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

  const translate = useTranslate();

  return (
    <div>
      <Welcome />

      <Grid container spacing={2}>
        <Grid item xs={4}>
          <CardWithIcon
            to="/admin/users"
            icon={PersonIcon}
            title={translate('custom.dashboard.userCount')}
            subtitle={usersNum}
          />
        </Grid>
        <Grid item xs={4}>
          <CardWithIcon
            to="/admin/users"
            icon={PersonIcon}
            title={translate('custom.dashboard.tempUserCount')}
            subtitle={tempUsersNum}
          />
        </Grid>
        <Grid item xs={4}>
          <CardWithIcon
            to="/admin/messages"
            icon={MessageIcon}
            title={translate('custom.dashboard.messageCount')}
            subtitle={messageNum}
          />
        </Grid>
        <Grid item xs={4}>
          <CardWithIcon
            to="/admin/groups"
            icon={GroupIcon}
            title={translate('custom.dashboard.groupCount')}
            subtitle={groupNum}
          />
        </Grid>
        <Grid item xs={4}>
          <CardWithIcon
            to="/admin/file"
            icon={AttachFileIcon}
            title={translate('custom.dashboard.fileCount')}
            subtitle={fileNum}
          />
        </Grid>
      </Grid>
    </div>
  );
});
Dashboard.displayName = 'Dashboard';
