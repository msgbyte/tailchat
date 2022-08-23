export class ClipboardHelper {
  data: DataTransfer;

  constructor(e: { clipboardData: DataTransfer }) {
    this.data = e.clipboardData;
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
