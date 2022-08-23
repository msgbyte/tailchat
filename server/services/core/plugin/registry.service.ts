import type {
  PluginManifest,
  PluginManifestDocument,
  PluginManifestModel,
} from '../../../models/plugin/manifest';
import { TcService, TcContext, TcDbService } from 'tailchat-server-sdk';

interface PluginRegistryService
  extends TcService,
    TcDbService<PluginManifestDocument, PluginManifestModel> {}
class PluginRegistryService extends TcService {
  get serviceName(): string {
    return 'plugin.registry';
  }

  onInit(): void {
    this.registerLocalDb(require('../../../models/plugin/manifest').default);
    this.registerDbField([
      'label',
      'name',
      'url',
      'icon',
      'version',
      'author',
      'description',
      'requireRestart',
    ]);

    this.registerAction('list', this.getPluginList, {
      cache: {
        enabled: true,
        ttl: 60 * 60, // 1 hour
      },
    });
  }

  async getPluginList(ctx: TcContext): Promise<{
    list: PluginManifest[];
  }> {
    const docs = await this.adapter.find({});
    return await this.transformDocuments(ctx, {}, docs);
  }
}

export default PluginRegistryService;
