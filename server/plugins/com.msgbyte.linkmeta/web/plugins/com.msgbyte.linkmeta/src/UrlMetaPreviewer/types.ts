export type LinkMeta =
  | {
      // media
      contentType: string;
      favicons: string[];
      mediaType: string;
      url: string;
      isCache: boolean;
    }
  | {
      url: string;
      title: string;
      siteName: string;
      description: string;
      mediaType: string;
      contentType: string;
      images: string[];
      videos: string[];
      favicons: string[];
      isCache: boolean;
    };
