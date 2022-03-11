import path from 'path';
import fs from 'fs-extra';
import AdmZip from 'adm-zip';
import crypto from 'crypto';
import { version } from '../package.json';
import ghpages from 'gh-pages';

const hash = (data: Buffer, type = 'sha256') => {
  const hmac = crypto.createHmac(type, 'hk4e');
  hmac.update(data);
  return hmac.digest('hex');
};

function createZip(filePath: string, dest: string) {
  const zip = new AdmZip();
  zip.addLocalFolder(filePath);
  zip.toBuffer();
  zip.writeZip(dest);
}

async function createUpdateZipAndDeploy() {
  const appPath = path.resolve(__dirname, '../dist');
  if (!(await fs.pathExists(appPath))) {
    throw new Error('dist 目录不存在');
  }
  const outputDir = path.resolve(__dirname, '../out/update/');
  const outputPath = path.resolve(outputDir, 'tmp.zip');
  await fs.ensureDir(outputDir);
  await fs.emptyDir(outputDir);

  createZip(appPath, outputPath);

  const buffer = await fs.readFile(outputPath);
  const sha256 = hash(buffer);
  const hashName = sha256.slice(7, 12);
  await fs.move(outputPath, path.resolve(outputDir, `${hashName}.zip`));

  await fs.outputJSON(path.resolve(outputDir, 'manifest.json'), {
    active: true,
    version,
    from: '0.0.0',
    name: `${hashName}.zip`,
    hash: sha256,
    date: new Date().valueOf(),
  });

  // 部署到github pages
  await new Promise<void>((resolve, reject) => {
    ghpages.publish(
      outputDir,
      {
        repo: 'git@github.com:msgbyte/tailchat-archive.git',
        branch: 'gh-pages',
        dest: './desktop/update',
        push: true,
        history: false,
      },
      (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      }
    );
  });
}

// async function

createUpdateZipAndDeploy();
