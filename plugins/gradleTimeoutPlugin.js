const { withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

function withGradleTimeout(config) {
  return withDangerousMod(config, [
    'android',
    (cfg) => {
      const propsPath = path.join(
        cfg.modRequest.platformProjectRoot,
        'gradle',
        'wrapper',
        'gradle-wrapper.properties'
      );
      if (fs.existsSync(propsPath)) {
        let content = fs.readFileSync(propsPath, 'utf8');
        content = content.replace(
          /networkTimeout=\d+/,
          'networkTimeout=300000'
        );
        fs.writeFileSync(propsPath, content);
      }
      return cfg;
    },
  ]);
}

module.exports = withGradleTimeout;
