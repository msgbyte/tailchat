import path from 'path';
import fs from 'fs-extra';
import AdmZip from 'adm-zip';
import crypto from 'crypto';
import { version } from '../package.json';
import ghpages from 'gh-pages';
import os from 'os';

/**
 * 发布asar
 */

const hash = (data: Buffer, type = 'sha256') => {
  const hmac = crypto.createHmac(type, 'hk4e');
  hmac.update(data);
  return hmac.digest('hex');
};

function createZip(localFilePath: string, dest: string) {
  const zip = new AdmZip();
  zip.addLocalFile(localFilePath);
  zip.toBuffer();
  zip.writeZip(dest);
}
const outputDir = path.resolve(__dirname, '../out/');

function getAsarFilePath() {
  if (os.platform() === 'win32') {
    return path.resolve(
      outputDir,
      './prod/tailchat-desktop-win32-x64/resources/app.asar'
    );
  } else if (os.platform() === 'darwin') {
    return path.resolve(
      outputDir,
      './prod/tailchat-desktop.app/Contents/Resources/app.asar'
    );
  }

  throw new Error('Not support');
}

async function createUpdateZipAndDeploy() {
  const asarPath = getAsarFilePath();
  if (!(await fs.pathExists(asarPath))) {
    throw new Error('asar 文件不存在');
  }
  const updateDir = path.resolve(outputDir, './update');
  const outputPath = path.resolve(updateDir, './tmp.zip');
  await fs.ensureDir(updateDir);
  await fs.emptyDir(updateDir);

  console.log('开始创建更新包');
  createZip(asarPath, outputPath);

  const buffer = await fs.readFile(outputPath);
  const sha256 = hash(buffer);
  const hashName = sha256.slice(7, 12);
  await fs.move(outputPath, path.resolve(updateDir, `${hashName}.zip`));

  console.log('正在输出更新文件...');
  await fs.outputJSON(path.resolve(updateDir, 'manifest.json'), {
    active: true,
    version,
    from: '0.0.0',
    name: `${hashName}.zip`,
    hash: sha256,
    date: new Date().valueOf(),
    size: buffer.byteLength,
  });

  console.log('正在部署到远程...');
  // 部署到github pages
  await new Promise<void>((resolve, reject) => {
    ghpages.publish(
      updateDir,
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

  console.log('完成');
}

// async function

createUpdateZipAndDeploy();
