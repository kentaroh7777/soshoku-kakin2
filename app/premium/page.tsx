"use client"
import React, { useState, useEffect } from 'react';
import { getStringArray, removeString, clearStringArray, saveStringArray, updateString, STORAGE_PREMIUM_KEY } from '../utils/storageString';

const FavoritesTable = () => {
    const [premium, setPremium] = useState<string[]>([]);
    const [newPremium, setNewPremium] = useState<string>('');

    useEffect(() => {
        setPremium(getStringArray(STORAGE_PREMIUM_KEY));
    }, []);

    const handleRemove = (index: number) => {
        removeString(index, STORAGE_PREMIUM_KEY);
        setPremium(getStringArray(STORAGE_PREMIUM_KEY));
    };

    const handleClearAll = () => {
        clearStringArray(STORAGE_PREMIUM_KEY);
        setPremium([]);
    };

    return (
        <div>
            <h2>プレミアム装飾管理</h2>
            <p>「TEXT」の部分がユーザーの入力テキストに置換されます。</p>
            <button className="alert-button" onClick={handleClearAll}>すべて削除</button>
            <table>
                <tbody>
                    {premium.map((item, index) => (
                        <tr key={index}>
                            <td>
                                <textarea 
                                    value={item} 
                                    onChange={(e) => {
                                        const updatedPremium = [...premium];
                                        updatedPremium[index] = e.target.value;
                                        setPremium(updatedPremium);
                                    }} 
                                    rows={4} 
                                    cols={50}
                                />
                            </td>
                            <td>
                                <button 
                                    className="user-button" 
                                    onClick={() => {
                                        updateString(index, premium[index], STORAGE_PREMIUM_KEY);
                                        saveStringArray(premium, STORAGE_PREMIUM_KEY);
                                    }}
                                >
                                    保存
                                </button>
                            </td>
                            <td>
                                <button className="alert-button" onClick={() => handleRemove(index)}>削除</button>
                            </td>
                        </tr>
                    ))}
                    <tr>
                        <td>
                            <textarea 
                                    value={newPremium} 
                                    onChange={(e) => setNewPremium(e.target.value)}
                                    rows={4} 
                                    cols={50}
                                />
                        </td>
                        <td>
                            <button 
                                    className="user-button" 
                                    onClick={() => {
                                      setPremium([...premium, newPremium]);
                                      saveStringArray([...premium, newPremium], STORAGE_PREMIUM_KEY);
                                      setNewPremium('');
                                    }}
                                >
                                    追加
                                </button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <a href="/"><button className="user-button">戻る</button></a>
        </div>
    );
};

export default FavoritesTable;
