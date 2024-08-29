"use client"
import React, { useState, useEffect } from 'react';
import { getStringArray, removeString, clearStringArray } from '../utils/storageString';


const FavoritesTable = () => {
    const [favorites, setFavorites] = useState<string[]>([]);

    useEffect(() => {
        setFavorites(getStringArray());
    }, []);

    const handleRemove = (index: number) => {
        removeString(index);
        setFavorites(getStringArray());
    };

    const handleClearAll = () => {
        clearStringArray();
        setFavorites([]);
    };

    return (
        <div>
            <h2>お気に入り管理</h2>
            <button onClick={handleClearAll}>Clear All</button>
            <table>
                <tbody>
                    {favorites.map((item, index) => (
                        <tr key={index}>
                            <td><pre>{item}</pre></td>
                            <td>
                                <button onClick={() => handleRemove(index)}>Remove</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <a href="/"><button className="user-button">戻る</button></a>
        </div>
    );
};

export default FavoritesTable;
