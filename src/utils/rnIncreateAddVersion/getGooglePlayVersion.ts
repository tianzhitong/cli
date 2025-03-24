import path from 'node:path';
import { google } from 'googleapis';
import { authenticate } from '@google-cloud/local-auth';

async function getGooglePlayVersion(packageName: string) {
    try {
        // 认证设置
        const keyFile = path.join(process.cwd(), 'google-play-credentials.json'); // 你的API密钥文件路径

        const auth = await authenticate({
            keyfilePath: keyFile,
            scopes: ['https://www.googleapis.com/auth/androidpublisher'],
        });

        // 创建 Android Publisher API 客户端
        const androidPublisher = google.androidpublisher({
            version: 'v3',
            auth,
        });

        // 获取当前在 Production 渠道发布的版本
        const res = await androidPublisher.edits.track({
            packageName: packageName, // 例如 'com.shortplay'
            editId: 'temp-edit-id', // 这会在API调用时被忽略，但需要提供
            track: 'production',
        });

        if (res.data && res.data.releases && res.data.releases.length > 0) {
            const latestRelease = res.data.releases[0];
            console.log('Google Play 最新版本:', latestRelease.name);
            console.log('版本代码:', latestRelease.versionCodes);

            return {
                versionName: latestRelease.name,
                versionCodes: latestRelease.versionCodes,
            };
        } else {
            console.log('未找到发布版本信息');
            return null;
        }
    } catch (error) {
        console.error('获取 Google Play 版本失败:', error);
        throw error;
    }
}

export default getGooglePlayVersion;
