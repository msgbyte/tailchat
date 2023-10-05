import {
  getMessageTextDecorators,
  pluginChatInputPasteHandler,
} from '@/plugin/common';
import { t } from 'tailchat-shared';

export interface ChatInputPasteHandlerData {
  files: FileList;
  text: string;
}

export interface ChatInputPasteHandlerContext {
  sendMessage: (text: string) => Promise<void>;
  applyMessage: (text: string) => void;
}

export interface ChatInputPasteHandler {
  name: string;
  label?: string;
  match: (
    event: React.ClipboardEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => boolean;
  handler: (
    data: ChatInputPasteHandlerData,
    ctx: ChatInputPasteHandlerContext
  ) => void;
}

export class ClipboardHelper {
  constructor(
    private event: React.ClipboardEvent<HTMLTextAreaElement | HTMLInputElement>
  ) {}

  get data() {
    return this.event.clipboardData;
  }

  get builtinHandlers(): ChatInputPasteHandler[] {
    const pasteUrl: ChatInputPasteHandler = {
      name: 'pasteUrl',
      label: t('转为Url富文本'),
      match: (e) => e.clipboardData.getData('text/plain').startsWith('http'),
      handler: (data, { applyMessage }) => {
        applyMessage(getMessageTextDecorators().url(data.text));
      },
    };

    return [
      // pasteUrl
    ];
  }

  get pasteHandlers(): ChatInputPasteHandler[] {
    return [...this.builtinHandlers, ...pluginChatInputPasteHandler];
  }

  hasImage(): File | false {
    const image = this.isPasteImage(this.data.items);
    if (image === false) {
      return false;
    }

    const file = image.getAsFile();
    if (file === null) {
      return false;
    }

    return file;
  }

  /**
   * 匹配是否有粘贴事件处理器
   */
  matchPasteHandler(): ChatInputPasteHandler[] {
    const handlers = this.pasteHandlers.filter((h) => h.match(this.event));

    return handlers;
  }

  private isPasteImage(items: DataTransferItemList): DataTransferItem | false {
    let i = 0;
    let item: DataTransferItem;
    while (i < items.length) {
      item = items[i];
      if (item.type.indexOf('image') !== -1) {
        return item;
      }
      i++;
    }
    return false;
  }
}
