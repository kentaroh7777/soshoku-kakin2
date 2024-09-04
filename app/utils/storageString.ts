export const MAX_ELEMENTS = 10;
export const STORAGE_FAVO_KEY = 'soshokuFavoritesArray';
export const STORAGE_PREMIUM_KEY = 'soshokuPremiumArray';

// 配列を取得する関数
export function getStringArray(storageKey: string) {
    const storedArray = localStorage.getItem(storageKey);
    return storedArray ? JSON.parse(storedArray) : [];
}

// 配列を保存する関数
export function saveStringArray(array: string[], storageKey: string) {
    if (array.length > MAX_ELEMENTS) {
        array = array.slice(0, MAX_ELEMENTS);
    }
    localStorage.setItem(storageKey, JSON.stringify(array));
}

// 新しい要素を追加する関数
export function addString(newString: string, storageKey: string) {
    let array = getStringArray(storageKey);
    array.push(newString);
    if (array.length > MAX_ELEMENTS) {
        array.shift(); // 最古の要素を削除
    }
    saveStringArray(array, storageKey);
}

// 特定のインデックスの要素を更新する関数
export function updateString(index: number, updatedString: string, storageKey: string) {
    let array = getStringArray(storageKey);
    if (index >= 0 && index < array.length) {
        array[index] = updatedString;
        saveStringArray(array, storageKey);
    }
}

// 特定のインデックスの要素を削除する関数
export function removeString(index: number, storageKey: string) {
    let array = getStringArray(storageKey);
    if (index >= 0 && index < array.length) {
        array.splice(index, 1);
        saveStringArray(array, storageKey);
    }
}

// 配列をクリアする関数
export function clearStringArray(storageKey: string) {
    localStorage.removeItem(storageKey);
}
