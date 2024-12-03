import { makeLines } from 'nodesplash';
import { readPackage } from 'read-pkg';

const logBanner = async () => {
  try {
    const pkg = await readPackage();
    const {
      name = 'Unknown',
      version = '0.0.0',
      repository = { url: 'unknown' },
    } = pkg;

    const repositoryName = typeof repository === 'string' ? repository : repository.url || 'unknown';

    const bannerData = {
      user: 'codetheweb',
      repository: repositoryName,
      version,
      paypalUser: 'codetheweb',
      githubSponsor: 'codetheweb',
      madeByPrefix: 'Made with 🎶 by ',
      buildDate: process.env.BUILD_DATE ? new Date(process.env.BUILD_DATE) : undefined,
      commit: process.env.COMMIT_HASH || 'unknown',
    };

    const bannerLines = makeLines(bannerData).join('\n');
    console.log(bannerLines, '\n');
  } catch (error) {
    console.error('Failed to generate log banner:', error);
  }
};

export default logBanner;
