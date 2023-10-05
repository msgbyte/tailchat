// @ts-nocheck
import { serve } from 'https://deno.land/std@0.120.0/http/server.ts';
import { serveFile } from 'https://deno.land/std@0.120.0/http/file_server.ts';
import { fromFileUrl } from 'https://deno.land/std@0.120.0/path/mod.ts';

const clientRoot = new URL('./', import.meta.url);
serve(async (req) => {
  const url = new URL(req.url);
  const localPath = new URL('./' + url.pathname, clientRoot);
  const filePath = fromFileUrl(localPath);

  const fileExists = await checkFileExists(filePath);
  if (fileExists) {
    return serveFile(req, filePath);
  } else {
    return await serveFile(
      req,
      fromFileUrl(new URL('./index.html', clientRoot))
    );
  }
});

async function checkFileExists(filePath: string): Promise<boolean> {
  try {
    await Deno.stat(filePath);
    return true;
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      return false;
    } else {
      throw error;
    }
  }
}
