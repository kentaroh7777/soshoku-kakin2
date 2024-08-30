import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import fetch from 'node-fetch';
import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import { AddressInfo } from 'net';
import { spawn } from 'child_process';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

let server: any;
let url: string;

// stripeでローカルホストをlistenさせる
const { exec } = require('child_process');

let stripeProcess: any;

beforeAll(async () => {
  await app.prepare();
  server = createServer((req, res) => {
    const parsedUrl = parse(req.url!, true);
    handle(req, res, parsedUrl);
  });
  await new Promise<void>((resolve) => {
    server.listen(0, () => {
      const address = server.address() as AddressInfo;
      url = `http://localhost:${address.port}`;
      resolve();
    });
  });

  // stripeでローカルホストをlistenさせる
//  stripeProcess = exec('stripe listen --forward-to localhost:3000/api/pay/stripehook', (error, stdout, stderr) => {
//  stripeProcess = spawn('stripe', ['listen', '--forward-to', 'localhost:3000/api/pay/stripehook']);
  // 環境変数を設定してコマンドを実行
  const env = Object.assign({}, process.env);

    stripeProcess = exec('/usr/local/bin/stripe listen --forward-to localhost:3000/api/pay/stripehook', { env: env }, (error: any,stdout: any,stderr: any)=>{
        if (error) {
            console.error(`実行エラー: ${error}`);
            console.error(`実行エラー: ${error.message}`);
            console.error(`エラーコード: ${error.code}`);
            console.error(`シグナル: ${error.signal}`);
        }
        console.log(`標準出力: ${stdout}`);
        if (stderr) {
            console.error(`標準エラー出力: ${stderr}`);
        }
    });
});

afterAll(() => {
  server.close();
  if (stripeProcess) {
    stripeProcess.kill();
  }
});


describe('Stripe Webhook Handler', () => {
  it('should create a user on customer.subscription.created event', async () => {

    // ここでユーザー作成のロジックを確認する
  });

  it('should delete a user on customer.subscription.deleted event', async () => {

    // ここでユーザー削除のロジックを確認する
  });


});

