const STORAGE_KEY = 'soshokuFavoritesArray';
export const MAX_ELEMENTS = 10;

// 配列を取得する関数
export function getStringArray() {
    const storedArray = localStorage.getItem(STORAGE_KEY);
    return storedArray ? JSON.parse(storedArray) : [];
}

// 配列を保存する関数
export function saveStringArray(array: string[]) {
    if (array.length > MAX_ELEMENTS) {
        array = array.slice(0, MAX_ELEMENTS);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(array));
}

// 新しい要素を追加する関数
export function addString(newString: string) {
    let array = getStringArray();
    array.push(newString);
    if (array.length > MAX_ELEMENTS) {
        array.shift(); // 最古の要素を削除
    }
    saveStringArray(array);
}

// 特定のインデックスの要素を更新する関数
export function updateString(index: number, updatedString: string) {
    let array = getStringArray();
    if (index >= 0 && index < array.length) {
        array[index] = updatedString;
        saveStringArray(array);
    }
}

// 特定のインデックスの要素を削除する関数
export function removeString(index: number) {
    let array = getStringArray();
    if (index >= 0 && index < array.length) {
        array.splice(index, 1);
        saveStringArray(array);
    }
}

// 配列をクリアする関数
export function clearStringArray() {
    localStorage.removeItem(STORAGE_KEY);
}
