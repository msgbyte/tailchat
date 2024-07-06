import React from 'react';
import { createFieldFactory, FieldDetailComponent, Image, Link } from 'tushan';

export const ImageUrlFieldDetail: FieldDetailComponent = React.memo((props) => {
  const url = props.value;
  const isImage = ['.png', '.jpg', '.gif', '.jpeg', '.webp'].some((ext) =>
    String(url).endsWith(ext)
  );

  if (isImage) {
    return <Image src={url} height={100} />;
  }

  return (
    <Link href={props.value} icon={true} target="_blank">
      {props.value}
    </Link>
  );
});
ImageUrlFieldDetail.displayName = 'ImageUrlFieldDetail';

export const createImageUrlField = createFieldFactory({
  detail: ImageUrlFieldDetail,
  edit: ImageUrlFieldDetail,
});
