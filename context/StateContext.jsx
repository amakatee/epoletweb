// context/StateContext.jsx
'use client';

import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const StateContext = ({ children }) => {
    const [show, setShow] = useState(false);
    const [index, setIndex] = useState(0);

    const closeImg = () => {
        setShow(false);
    };

    const openImg = (newIndex) => {
        setIndex(newIndex);
        setShow(true);
    };

    return (
        <CartContext.Provider
            value={{
                show,
                setShow,
                index,
                setIndex,
                closeImg,
                openImg,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCartContext = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCartContext must be used within a StateContext Provider');
    }
    return context;
};

// Also export as useImageModal for compatibility with your product page
export const useImageModal = useCartContext;