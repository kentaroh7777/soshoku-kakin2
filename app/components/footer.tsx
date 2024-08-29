"use client"
import React from 'react';
import styles from './footer.module.css';
import Script from 'next/script';
import { useEffect } from 'react';

const MagformScriptLoader = () => {
    // JSで生成されたコンテンツが必ずページ最後に配置されるので、生成後に無理やり移動させる
    useEffect(() => {
        const moveContent = () => {
            const generatedForm = document.querySelector('form[data-uid="7549b48e01"]');
            const targetContainer = document.getElementById('script-target-container');
            
            if (generatedForm && targetContainer) {
                targetContainer.appendChild(generatedForm);
            }
        };

        // スクリプトの実行後にコンテンツを移動
        const intervalId = setInterval(() => {
            const generatedForm = document.querySelector('form[data-uid="7549b48e01"]');
            if (generatedForm) {
                moveContent();
                clearInterval(intervalId);
            }
        }, 100);

        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className={styles.container}>
            <div id="script-target-container" className={styles.magform}></div>
            <Script
                src="https://aidesignlab.ck.page/7549b48e01/index.js"
                strategy="lazyOnload"
                data-uid="7549b48e01"
            />
        </div>
    )
}

const Footer = () => {
  return (
    <footer className={styles.footer}>
        <div className={styles.container}>
            <img src="/chatgpt.png" alt="このサービスはChatGPTに作ってもらいました！AIを活用する方法をメルマガでインプット" style={{width: '100%', maxWidth: '800px', height: 'auto'}} />

            <MagformScriptLoader />

            <a className="twitter-timeline" data-lang="ja" data-height="500" href="https://twitter.com/chibinftcom?ref_src=twsrc%5Etfw">Tweets by chibinftcom</a>
        </div>
    </footer>
  );
}

export default Footer;
