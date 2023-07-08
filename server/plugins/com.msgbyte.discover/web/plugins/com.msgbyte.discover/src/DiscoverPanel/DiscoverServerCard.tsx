import React from 'react';
import styled from 'styled-components';
import {
  postRequest,
  useAsync,
  useAsyncRequest,
  getTextColorHex,
} from '@capital/common';
import { Avatar, Skeleton, Button } from '@capital/component';
import { Translate } from '../translate';
import { request } from '../request';

const Root = styled.div`
  width: 100%;
  height: 320px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-radius: 8px;
  position: relative;
  background-color: #2c3441;

  .header {
    height: 143px;
    position: relative;
    display: block;
    overflow: visible;
    margin-bottom: 32px;

    .icon {
      position: absolute;
      bottom: -21px;
      left: 12px;
      border: 6px solid #2c3441;
      border-radius: 6px;
    }
  }

  .body {
    display: flex;
    padding: 0 16px 16px;
    overflow: hidden;
    flex: 1;

    .name {
      font-weight: 600;
    }

    .desc {
      opacity: 0.8;
    }
  }

  .footer {
    padding: 0 16px 16px;
    font-size: 0.7rem;
    opacity: 0.8;
    display: flex;
    justify-content: space-between;
    align-items: center;

    * + * {
      margin-left: 4px;
    }
  }
`;

interface DiscoverServerCardProps {
  groupId: string;
}

export const DiscoverServerCard: React.FC<DiscoverServerCardProps> = React.memo(
  (props) => {
    const { value: groupBasicInfo } = useAsync(async () => {
      const { data } = await postRequest('/group/getGroupBasicInfo', {
        groupId: props.groupId,
      });

      return data;
    }, [props.groupId]);

    const [{ loading: joinLoading }, handleJoin] = useAsyncRequest(async () => {
      await request.post('join', {
        groupId: props.groupId,
      });
    }, [props.groupId]);

    if (!groupBasicInfo) {
      return (
        <Root>
          <div className="header">
            <div className="icon">
              <Skeleton.Avatar active={true} size={40} shape={'square'} />
            </div>
          </div>
          <div className="body">
            <Skeleton active={true} />
          </div>
        </Root>
      );
    }

    return (
      <Root>
        <div
          className="header"
          style={{ background: getTextColorHex(groupBasicInfo.name) }}
        >
          <div className="icon">
            <Avatar
              shape="square"
              size={40}
              src={groupBasicInfo.icon}
              name={groupBasicInfo.name}
            />
          </div>
        </div>
        <div className="body">
          <div className="name">{groupBasicInfo.name}</div>
          <div className="desc"></div>
        </div>
        <div className="footer">
          <div>
            {Translate.memberCount.replace(
              '{count}',
              groupBasicInfo.memberCount
            )}
          </div>
          <Button
            size="small"
            type="primary"
            loading={joinLoading}
            onClick={handleJoin}
          >
            {Translate.join}
          </Button>
        </div>
      </Root>
    );
  }
);
DiscoverServerCard.displayName = 'DiscoverServerCard';
