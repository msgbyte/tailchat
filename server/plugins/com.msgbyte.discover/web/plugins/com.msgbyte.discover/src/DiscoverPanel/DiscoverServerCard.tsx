import React, { useMemo } from 'react';
import styled from 'styled-components';
import {
  postRequest,
  useAsync,
  useAsyncRequest,
  getTextColorHex,
  getGlobalState,
  useNavigate,
  useEvent,
} from '@capital/common';
import { Avatar, Skeleton, Button } from '@capital/component';
import { Translate } from '../translate';
import { request } from '../request';

const Root = styled.div`
  --discover-server-card: #fff;

  .dark & {
    --discover-server-card: #2c3441;
  }

  width: 100%;
  height: 320px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-radius: 8px;
  position: relative;
  background-color: var(--discover-server-card);

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
      border: 6px solid var(--discover-server-card);
      border-radius: 6px;
    }
  }

  .body {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 0 16px 16px;
    overflow: hidden;
    width: 100%;

    .name {
      font-weight: 600;
    }

    .desc {
      opacity: 0.8;
      overflow: auto;
      font-size: 0.9rem;

      > pre {
        text-wrap: wrap;
      }
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
    const navigate = useNavigate();
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

    const handleJumpTo = useEvent(() => {
      navigate(`/main/group/${props.groupId}`);
    });

    const isJoined = useMemo(() => {
      try {
        return Object.keys(getGlobalState().group.groups).includes(
          props.groupId
        );
      } catch (err) {
        console.error(err);
        return false;
      }
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
              src={groupBasicInfo.avatar}
              name={groupBasicInfo.name}
            />
          </div>
        </div>
        <div className="body">
          <div className="name">{groupBasicInfo.name}</div>
          <div className="desc">
            <pre>{groupBasicInfo.description}</pre>
          </div>
        </div>
        <div className="footer">
          <div>
            {Translate.memberCount.replace(
              '{count}',
              groupBasicInfo.memberCount
            )}
          </div>

          {isJoined ? (
            <Button
              size="small"
              type="primary"
              loading={joinLoading}
              onClick={handleJumpTo}
            >
              {Translate.joined}
            </Button>
          ) : (
            <Button
              size="small"
              type="primary"
              loading={joinLoading}
              onClick={handleJoin}
            >
              {Translate.join}
            </Button>
          )}
        </div>
      </Root>
    );
  }
);
DiscoverServerCard.displayName = 'DiscoverServerCard';
