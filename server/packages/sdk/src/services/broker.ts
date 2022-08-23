import Moleculer from 'moleculer';

/**
 * 用于不暴露moleculer让外部手动启动一个broker
 *
 * 如tailchat-cli
 */
export class TcBroker extends Moleculer.ServiceBroker {}
