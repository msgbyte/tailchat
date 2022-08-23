import React from 'react';
import { api } from './api';
import { useAsync } from 'react-use';

/**
 * WIP
 */
const Dashboard = (props) => {
  useAsync(async () => {
    try {
      const all = await api
        .resourceAction({ resourceId: 'User', actionName: 'list' })
        .then(({ data }) => data.meta.total);

      const temporary = await api
        .searchRecords({
          resourceId: 'User',
          // actionName: 'list',
          query: '?filters.temporary=true&page=1',
        })
        .then((list) => list.length);

      console.log('用户情况:', all, temporary);
    } catch (err) {
      console.error(err);
    }
  }, []);

  return <div>My custom dashboard</div>;
};

export default Dashboard;
