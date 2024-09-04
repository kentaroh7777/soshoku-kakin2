'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import styles from './textDecoratorClient.module.css';
import { loginUserID } from '../utils/useAuth'
import { getStringArray, addString, saveStringArray, MAX_ELEMENTS, STORAGE_FAVO_KEY, STORAGE_PREMIUM_KEY } from '../utils/storageString';

const Slider = dynamic(() => import('react-slick'), { ssr: false }) as React.ComponentType<SliderSettings>;

interface SliderSettings {
  children?: React.ReactNode;
  dots?: boolean;
  infinite?: boolean;
  speed?: number;
  slidesToShow?: number;
  slidesToScroll?: number;
  centerMode?: boolean;
  centerPadding?: string;
  arrows?: boolean;
  prevArrow?: React.ReactNode;
  nextArrow?: React.ReactNode;
  responsive?: {
    breakpoint: number;
    settings: SliderSettings;
  }[];
}

// カスタム矢印コンポーネントを先に定義
function PrevArrow(props: { className?: string; style?: React.CSSProperties; onClick?: () => void }) {
    const { className, style, onClick } = props;
    return (
        <div
        className={`${className} ${styles.customArrow} ${styles.prevArrow}`}
        style={{ ...style }}
        onClick={onClick}
        />
    );
}
  
function NextArrow(props: { className?: string; style?: React.CSSProperties; onClick?: () => void }) {
    const { className, style, onClick } = props;
    return (
        <div
        className={`${className} ${styles.customArrow} ${styles.nextArrow}`}
        style={{ ...style }}
        onClick={onClick}
        />
    );
}

export default function TextDecoratorClient() {
  const userID = loginUserID()
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [sliderInitialized, setSliderInitialized] = useState(false);
  const [copied, setCopied] = useState(false);
  const [favorites, setFavorites] = useState<{id:string, content:string}[]>([]);
  const [premium, setPremium] = useState<{id:string, content:string}[]>([]);

  useEffect(() => {
    // ローカルストレージからお気に入りを復元
    const favorite_content = getStringArray(STORAGE_FAVO_KEY);
    setFavorites(favorite_content.map((fav:string) => (
      {id: Math.random().toString(36), content: fav}
    )));
    // ローカルストレージからプレミアム装飾を復元。置き換え文字列は'TEXT'
    const premium_content = getStringArray(STORAGE_PREMIUM_KEY);
    if (premium_content.length > 0) {
      setPremium(premium_content.map((premium:string, index:number) => (
        {id: `style${12 + index}`, content: premium.replace(/TEXT/g, `Style${12 + index}`)}
      )));
    } else {
      //ローカルストレージにプレミアムがない場合は、デフォルトを設定&保存
      setPremium(premiumDefault);
      saveStringArray(premiumDefault.map((premium: {id:string, content:string}) => premium.content.replace(/Style\d+/g, 'TEXT')), STORAGE_PREMIUM_KEY);
    }
  }, []);

  useEffect(() => {
    setSliderInitialized(true);
  }, []);

  const settings: React.ComponentProps<typeof Slider> = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: '0px',
    arrows: true,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    responsive: [
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 2,
          }
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
          }
        }
      ]
  };

  const sampleStyles = [
    { id: 'style1', content: '◤Style1◢' },
    { id: 'style2', content: '◤◢◤Style2◢◤◢' },
    { id: 'style3', content: '◤◢◤◢◤◢◤◢\nStyle3\n◤◢◤◢◤◢◤◢' },
    { id: 'style4', content: '◤￣￣￣￣￣￣◥\nStyle4\n◣＿＿＿＿＿＿◢' },
    { id: 'style5', content: '┏━━━━┓\nStyle5\n┗━━━━┛' },
    { id: 'style6', content: '◇━━━━◇\nStyle6\n◇━━━━◇' },
    { id: 'style7', content: '╋━━━━╋\nStyle7\n╋━━━━╋' },
    { id: 'style8', content: '■━━━━■\nStyle8\n■━━━━■' },
    { id: 'style9', content: '▼△▼△▼△▼\nStyle9\n▼△▼△▼△▼' },
    { id: 'style10', content: '＿人人人人人＿\n＞　Style10　＜\n￣Y^Y^Y^Y^Y￣' },
    { id: 'style11', content: '╭━━━━╮\n　Style11　\n╰━━ｖ━╯' }
  ];

  const premiumDefault = [
    { id: 'style12', content: '【Style12】' },
    { id: 'style13', content: '『Style13』' },
    { id: 'style14', content: '《Style14》' },
    { id: 'style15', content: '〔Style15〕' },
    { id: 'style16', content: '≪Style16≫' },
    { id: 'style17', content: '「Style17」' },
    { id: 'style18', content: '（Style18）' },
    { id: 'style19', content: '〈Style19〉' },
    { id: 'style20', content: '［Style20］' },
  ];

  const generateDecoratedText = (style: {id: string, content: string}) => {
    const decoratedText = style.content.replace(new RegExp(style.id, 'i'), inputText);
    setOutputText(decoratedText);
    return decoratedText;
  };

  const copyToClipboard = (text: string) => {
    console.log(`copyToClipboard() text: ${text}`);
    navigator.clipboard.writeText(text)
      .then(() => {
        setCopied(true);
        setTimeout(() => {
          setCopied(false);
        }, 2000);
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
      });
  };
  
  const handleAddToFavorites = () => {
    if (favorites.length < MAX_ELEMENTS) {
      addString(outputText, STORAGE_FAVO_KEY);
      setFavorites([...favorites, {id: Math.random().toString(36), content: outputText}]);
    } else {
      alert(`お気に入りは${MAX_ELEMENTS}個までしか保存できません。`);
    }
  };

  return (
    <div className={styles.container}>
      <h2><img src="/text-decoration-generator.png" alt="Xテキスト装飾ジェネレーター" style={{ width: '100%', display: 'block', margin: '0 auto' }} /></h2>
      
      <div className={styles.inputContainer}>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="テキストを入力してください。"
          className={styles.input}
        />
        <div className={styles.output}>{outputText}</div>
        {userID !== "" && (
          <div className={styles.favoButtonContainer}>
            <button className={styles.favoButton} onClick={handleAddToFavorites}>お気に入りに追加</button>
          </div>
        )}
        {copied && <div className={styles.copied}>テキストがコピーされました！</div>}
      </div>

      <div className={styles.banner}>
        <img src="/soshokuerande.png" alt="好きな装飾を選んでね" style={{ width: '50%', display: 'block', margin: '0 auto' }} />
      </div>

      {sliderInitialized && (
        <div className={styles.carouselContainer}>
          <Slider {...settings}>
            {sampleStyles.map((style) => (
              <div 
                key={style.id}
                className={styles.slide}
                onClick={() => {
                  const decoratedText = generateDecoratedText(style);
                  copyToClipboard(decoratedText);
                }}
              >
                <pre key={style.id} className={styles.sampleText}>
                    {style.content}
                </pre>
              </div>
            ))}
          </Slider>
          {userID !== "" && (
            <div className={styles.premiumContainer}>
              <h3>プレミアムユーザー専用装飾</h3>
              <Slider {...settings}>
                {premium.map((style) => (
                  <div 
                    key={style.id}
                    className={styles.slide}
                    onClick={() => {
                      const decoratedText = generateDecoratedText(style);
                      copyToClipboard(decoratedText);
                    }}
                  >
                    <pre key={style.id} className={styles.sampleText}>
                        {style.content}
                    </pre>
                  </div>
                ))}
              </Slider>
              {userID !== "" && (
                <div className={styles.favoButtonContainer}>
                  <a href="/premium"><button className={styles.favoButton}>プレミアム装飾編集</button></a>
                </div>
              )} 
              <h3 className={styles.favoHeader}>お気に入り</h3>
              <div className={styles.favoContainer}>
                {favorites.map((fav) => (
                  <div 
                    key={fav.id}
                    className={styles.favoCard}
                    onClick={() => {
//                      const decoratedText = generateDecoratedText(fav);
                      setOutputText(fav.content);
                      copyToClipboard(fav.content);
                    }}
                  >
                    <pre key={fav.id}
                    className={styles.sampleText}>
                        {fav.content}
                    </pre>
                  </div>
                ))}
              </div>
              <div className={styles.favoButtonContainer}>
                <a href="/favo"><button className={styles.favoButton}>お気に入り編集</button></a>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}