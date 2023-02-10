import {
  defaultBrokerConfig,
  config,
  BrokerOptions,
} from 'tailchat-server-sdk';

const brokerConfig: BrokerOptions = {
  ...defaultBrokerConfig,
};

if (config.feature.disableLogger === true) {
  brokerConfig.logger = false;
}

export default brokerConfig;
