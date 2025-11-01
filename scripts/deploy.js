#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function exec(command, options = {}) {
  console.log(`执行: ${command}`);
  return execSync(command, { 
    stdio: 'inherit', 
    encoding: 'utf-8',
    ...options 
  });
}

function execOutput(command) {
  return execSync(command, { encoding: 'utf-8' }).trim();
}

async function deploy() {
  try {
    // 1. 切换到 main 分支
    console.log('\n📌 切换到 main 分支...');
    exec('git checkout main');
    
    // 2. 删除当前目录下的 APK 文件
    console.log('\n🗑️  删除旧的 APK 文件...');
    exec('find . -name "*.apk" -type f -not -path "*/node_modules/*" -delete || true');
    
    // 3. 更新 package.json 中的版本
    console.log('\n📦 更新版本号...');
    const packagePath = path.join(__dirname, '..', 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));
    
    // 自动递增补丁版本号
    const versionParts = packageJson.version.split('.');
    versionParts[2] = parseInt(versionParts[2]) + 1;
    const newVersion = versionParts.join('.');
    
    packageJson.version = newVersion;
    fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 4) + '\n');
    
    console.log(`版本号已更新: ${newVersion}`);
    
    // 4. 提交版本变更并创建 tag
    console.log('\n🏷️  创建 Git tag...');
    exec(`git add package.json`);
    exec(`git commit -m "chore: bump version to ${newVersion}"`);
    exec(`git tag v${newVersion}`);
    
    // 5. 构建 Android APK
    console.log('\n🏗️  开始构建 Android APK...');
    exec('npm run build:test:android');
    
    // 6. 推送到远端
    console.log('\n📤 推送到远端...');
    exec('git push origin main');
    exec(`git push origin v${newVersion}`);
    
    // 7. 查找生成的 APK 文件
    console.log('\n🔍 查找 APK 文件...');
    const apkPattern = execOutput('find . -name "*.apk" -type f -not -path "*/node_modules/*" | head -n 1');
    
    if (!apkPattern) {
      throw new Error('未找到 APK 文件');
    }
    
    console.log(`找到 APK: ${apkPattern}`);
    
    // 8. 创建 GitHub Release
    console.log('\n🚀 创建 GitHub Release...');
    exec(`gh release create v${newVersion} "${apkPattern}" --title "Release v${newVersion}" --notes "Release v${newVersion}"`);
    
    console.log('\n✅ 部署完成！');
    
  } catch (error) {
    console.error('\n❌ 部署失败:', error.message);
    process.exit(1);
  }
}

deploy();
