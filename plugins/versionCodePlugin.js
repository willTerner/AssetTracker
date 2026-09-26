const { withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

// Monotonic versionCode for every build path (EAS or direct gradle): seconds
// elapsed since 2025-01-01 UTC (~52M in 2026, fits Int32 for decades). The
// template hardcodes versionCode 1, so rebuilds keep the same versionCode and
// reinstalling fails with a package-conflict error. Re-applied after the
// original defaultConfig so it also wins over EAS's remote versionCode injection.
const MARKER = '// version-code-plugin (do not edit, managed by plugins/versionCodePlugin.js)';
const VERSION_BLOCK = `
${MARKER}
def generatedVersionCode = (System.currentTimeMillis().intdiv(1000L) - 1735689600L) as Integer
android {
    defaultConfig {
        versionCode generatedVersionCode
    }
}
`;

function withMonotonicVersionCode(config) {
  return withDangerousMod(config, [
    'android',
    (cfg) => {
      const buildGradlePath = path.join(
        cfg.modRequest.platformProjectRoot,
        'app',
        'build.gradle'
      );
      let content = fs.readFileSync(buildGradlePath, 'utf8');
      if (!content.includes(MARKER)) {
        if (!content.endsWith('\n')) {
          content += '\n';
        }
        content += VERSION_BLOCK;
        fs.writeFileSync(buildGradlePath, content);
      }
      return cfg;
    },
  ]);
}

module.exports = withMonotonicVersionCode;
