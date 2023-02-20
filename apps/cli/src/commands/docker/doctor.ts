import { CommandModule } from 'yargs';
import Docker from 'dockerode';
import asTable from 'as-table';
import filesize from 'filesize';

export const dockerDoctorCommand: CommandModule = {
  command: 'doctor',
  describe: 'docker environment check',
  builder: undefined,
  async handler(args) {
    const docker = new Docker();

    const images = await docker.listImages();
    const tailchatImages = images.filter((image) =>
      (image.RepoTags ?? []).some((tag) => tag.includes('tailchat'))
    );

    console.log('Tailchat image list:');
    console.log(
      asTable.configure({ delimiter: ' | ' })(
        tailchatImages.map((image) => ({
          tag: (image.RepoTags ?? []).join(','),
          id: image.Id.substring(0, 12),
          size: filesize(image.Size),
        }))
      )
    );

    const info = await docker.info();
    console.log('info', info);
  },
};
