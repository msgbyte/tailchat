import path from 'path';
import fs from 'fs-extra';
import ghpages from 'gh-pages';
import fg from 'fast-glob';

const outputDir = path.resolve(__dirname, '../release/build');
const deployDir = path.resolve(__dirname, '../release/deploy');

async function deployToGithubPages() {
  if (!(await fs.pathExists(outputDir))) {
    throw new Error('outputDir does not exist');
  }

  await fs.ensureDir(deployDir);
  await fs.emptyDir(deployDir);

  console.log('Selecting file...');
  const fileList = await fg(['*.zip', '*.exe'], {
    cwd: outputDir,
  });
  console.log(fileList.map((f) => `- ${f}`).join('\n'));
  await Promise.all(
    fileList.map((f) =>
      fs.copyFile(path.resolve(outputDir, f), path.resolve(deployDir, f))
    )
  );

  console.log('Deploying to remote...');
  // 部署到github pages
  await new Promise<void>((resolve, reject) => {
    ghpages.publish(
      deployDir,
      {
        repo: 'git@github.com:msgbyte/tailchat-archive.git',
        branch: 'gh-pages',
        dest: './desktop/app',
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

  console.log('Completed!');
}

deployToGithubPages();
