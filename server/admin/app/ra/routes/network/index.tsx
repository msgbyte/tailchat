import React from 'react';
import { request } from '../../request';
import { useRequest } from 'ahooks';
import {
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Box,
} from '@mui/material';
import _uniq from 'lodash/uniq';
import { ChipItems } from '../../components/ChipItems';
import { useTranslate } from 'react-admin';

/**
 * Tailchat 网络状态
 */
export const TailchatNetwork: React.FC = React.memo(() => {
  const translate = useTranslate();
  const { data, loading } = useRequest(async () => {
    const { data } = await request('/network/all');

    return data;
  });

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Box
      sx={{
        paddingTop: 2,
        paddingBottom: 2,
        maxWidth: '100vw',
      }}
    >
      <Typography variant="h6" gutterBottom>
        {translate('custom.network.nodeList')}
      </Typography>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>{translate('custom.network.id')}</TableCell>
            <TableCell>{translate('custom.network.hostname')}</TableCell>
            <TableCell>{translate('custom.network.cpuUsage')}</TableCell>
            <TableCell>{translate('custom.network.ipList')}</TableCell>
            <TableCell>{translate('custom.network.sdkVersion')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(data.nodes ?? []).map((row) => (
            <TableRow
              key={row.name}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.id}
                {row.local && <span> (*)</span>}
              </TableCell>
              <TableCell>{row.hostname}</TableCell>
              <TableCell>{row.cpu}%</TableCell>
              <TableCell>
                <ChipItems items={row.ipList ?? []} />
              </TableCell>
              <TableCell>{row.client.version}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Typography variant="h6" gutterBottom>
        {translate('custom.network.serviceList')}
      </Typography>
      <Box flexWrap="wrap" overflow="hidden">
        <ChipItems items={_uniq<string>(data.services ?? [])} />
      </Box>

      <Typography variant="h6" gutterBottom>
        {translate('custom.network.actionList')}
      </Typography>
      <Box flexWrap="wrap" overflow="hidden">
        <ChipItems items={_uniq<string>(data.actions ?? [])} />
      </Box>

      <Typography variant="h6" gutterBottom>
        {translate('custom.network.eventList')}
      </Typography>
      <Box flexWrap="wrap" overflow="hidden">
        <ChipItems items={_uniq<string>(data.events ?? [])} />
      </Box>
    </Box>
  );
});
TailchatNetwork.displayName = 'TailchatNetwork';
