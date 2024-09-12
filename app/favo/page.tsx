"use client"
import React, { useState, useEffect } from 'react';
import { getStringArray, removeString, clearStringArray, STORAGE_FAVO_KEY } from '../utils/storageString';

const FavoritesTable = () => {
    const [favorites, setFavorites] = useState<string[]>([]);

    useEffect(() => {
        setFavorites(getStringArray(STORAGE_FAVO_KEY));
    }, []);

    const handleRemove = (index: number) => {
        removeString(index, STORAGE_FAVO_KEY);
        setFavorites(getStringArray(STORAGE_FAVO_KEY));
    };

    const handleClearAll = () => {
        clearStringArray(STORAGE_FAVO_KEY);
        setFavorites([]);
    };

    return (
        <div>
            <h2>お気に入り管理</h2>
            <button className="alert-button" onClick={handleClearAll}>すべて削除</button>
            <table>
                <tbody>
                    {favorites.map((item, index) => (
                        <tr key={index}>
                            <td>
                                <button className="alert-button" onClick={() => handleRemove(index)}>削除</button>
                            </td>
                            <td><pre>{item}</pre></td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <a href="/"><button className="user-button">戻る</button></a>
        </div>
    );
};

export default FavoritesTable;
