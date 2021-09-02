import { buildRegList } from './buildRegList';

interface PluginSocketEventListener {
  eventName: string;
  eventFn: (...args: any[]) => void;
}
export const [socketEventListeners, regSocketEventListener] =
  buildRegList<PluginSocketEventListener>();
