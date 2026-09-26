const { withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

// Split release APKs per ABI (armeabi-v7a / arm64-v8a) to reduce package size.
// Gated behind the ABI_SPLIT env var so local `expo run:android` debug builds
// (e.g. on x86_64 emulators) stay universal. When splits are enabled, the RN
// gradle plugin skips ndk.abiFilters and AGP drives ABIs from this block.
const MARKER = '// abi-split-plugin (do not edit, managed by plugins/abiSplitPlugin.js)';
const SPLITS_BLOCK = `
${MARKER}
def enableAbiSplits = (System.getenv('ABI_SPLIT') ?: 'false').toBoolean()
android {
    splits {
        abi {
            reset()
            enable enableAbiSplits
            include "armeabi-v7a", "arm64-v8a"
            universalApk false
        }
    }
}
`;

function withAbiSplitApks(config) {
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
        content += SPLITS_BLOCK;
        fs.writeFileSync(buildGradlePath, content);
      }
      return cfg;
    },
  ]);
}

module.exports = withAbiSplitApks;
