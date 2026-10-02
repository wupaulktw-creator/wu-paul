#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import readline from 'readline';
import git from 'isomorphic-git';
import http from 'isomorphic-git/http/node';

const repoRoot = process.cwd();
const defaultRemoteUrl = 'https://github.com/wupaulktw-creator/wu-paul.git';

async function askTokenInteractive() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  return new Promise((resolve) => {
    rl.question('請輸入您的 GitHub Personal Access Token (PAT): ', (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

async function main() {
  console.log('🚀 FastenerTool Link V2 - GitHub 自動推送腳本');
  console.log('----------------------------------------------------');

  let token = process.argv[2] || process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
  let targetUrl = process.argv[3] || defaultRemoteUrl;

  if (!token) {
    if (process.stdin.isTTY) {
      token = await askTokenInteractive();
    }
  }

  if (!token) {
    console.error('❌ 未提供 GitHub Token！');
    console.error('\n使用方式:');
    console.error('  1. 帶入參數: node scripts/push-to-github.js <YOUR_GITHUB_TOKEN>');
    console.error('  2. 設定環境變數: GITHUB_TOKEN=<YOUR_GITHUB_TOKEN> node scripts/push-to-github.js');
    console.error('\n如何取得 GitHub Token:');
    console.error('  請前往: https://github.com/settings/tokens/new?scopes=repo&description=wu-paul-sync');
    console.error('  勾選 [repo] 權限並複製生成的 token (格式如: ghp_xxxxxxxxxxxxxxxxxxxx)');
    process.exit(1);
  }

  console.log(`📦 目標 Repository: ${targetUrl}`);
  console.log(`📌 分支: main`);

  try {
    // 1. Stage any modified or untracked files
    const status = await git.statusMatrix({ fs, dir: repoRoot });
    const filesToStage = status.filter(row => row[2] !== 0).map(row => row[0]);

    if (filesToStage.length > 0) {
      console.log(`📝 偵測到 ${filesToStage.length} 個待更新檔案，正在加入暫存區...`);
      for (const filepath of filesToStage) {
        await git.add({ fs, dir: repoRoot, filepath });
      }

      const sha = await git.commit({
        fs,
        dir: repoRoot,
        message: `feat: sync FastenerTool Link V2 platform (${new Date().toISOString().slice(0, 10)})`,
        author: {
          name: 'wupaulktw-creator',
          email: 'wupaulktw@users.noreply.github.com'
        }
      });
      console.log(`✅ 已建立新提交: ${sha.slice(0, 7)}`);

      // Ensure main ref is updated
      await git.writeRef({
        fs,
        dir: repoRoot,
        ref: 'refs/heads/main',
        value: sha,
        force: true
      });
    } else {
      console.log('✨ 工作目錄乾淨，無待提交修改。');
    }

    // 2. Push to GitHub
    console.log(`\n⏳ 正在推送到 GitHub (${targetUrl})...`);
    const pushResult = await git.push({
      fs,
      http,
      dir: repoRoot,
      url: targetUrl,
      ref: 'main',
      force: true,
      onAuth: () => ({
        username: token,
        password: ''
      })
    });

    if (pushResult && pushResult.ok) {
      console.log('\n🎉 成功推送到 GitHub Repository！');
      console.log(`🔗 GitHub Repo: ${targetUrl.replace('.git', '')}`);
      console.log(`🌐 Cloudflare Pages: https://wu-paul.pages.dev/`);
      console.log('📌 Cloudflare Pages 將在 1~2 分鐘內自動完成建置並上線！');
    } else {
      console.log('Push 完成回應:', pushResult);
    }
  } catch (err) {
    console.error('\n❌ 推送失敗:', err.message);
    if (err.data && err.data.response) {
      console.error('詳細資訊:', err.data.response);
    }
    if (err.message.includes('401') || err.message.includes('403')) {
      console.error('\n⚠️ 認證失敗：請確認 Token 是否具有該儲存庫的寫入權限 (repo 權限)。');
    } else if (err.message.includes('404')) {
      console.error(`\n⚠️ 找不到儲存庫：請確認 GitHub 上是否已建立專案「${targetUrl}」`);
      console.error('建立連結: https://github.com/new?name=wu-paul');
    }
    process.exit(1);
  }
}

main();
