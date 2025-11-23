
import React, { useState } from 'react';
import './LootCard.css';

export const LootCard = ({ 
    item, 
    buttonText, 
    buttonColor = '#28a745', 
    onButtonClick, 
    buttonStyle = {} 
}) => {
    const [isFlipped, setIsFlipped] = useState(false);

    const rarityColors = {
        Common: "#9E9E9E",
        Uncommon: "#388E3C",
        Rare: "#1E88E5",
        Epic: "#8E24AA",
        Legendary: "#FFD700",
    };

    const defaultButtonStyle = {
        backgroundColor: buttonColor,
        color: 'white',
        border: 'none',
        padding: '8px 16px',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '14px',
        marginTop: '15px',
        ...buttonStyle
    };

    // Generate an image based on item name
    const getItemImage = (itemName) => {
        // Use the item name directly to match the image file
        const imageName = `${itemName}.png`;
        
        return (
            <img 
                src={`/images/${imageName}`}
                alt={itemName}
                style={{
                    width: '120px',
                    height: '120px',
                    objectFit: 'contain',
                    marginBottom: '10px',
                    filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))'
                }}
                onError={(e) => {
                    // Fallback to Blindbox if image not found
                    if (e.target.src.indexOf('Blindbox.png') === -1) {
                        e.target.src = '/images/Blindbox.png';
                    } else {
                        e.target.style.display = 'none';
                    }
                }}
            />
        );
    };

    const handleCardClick = (e) => {
        // Don't flip if clicking on a button
        if (e.target.tagName === 'BUTTON') return;
        setIsFlipped(!isFlipped);
    };

    return (
        <div className="loot-card-container" onClick={handleCardClick}>
            <div className={`loot-card ${isFlipped ? 'flipped' : ''}`}>
                {/* Front Side */}
                <div className="loot-card-front">
                    <div 
                        className="rarity-border"
                        style={{ borderColor: rarityColors[item.rarity] || "#333" }}
                    >
                        <div className="item-image">
                            {getItemImage(item.name)}
                        </div>
                        
                        <h2 
                            className="item-name"
                            style={{ color: rarityColors[item.rarity] || "#333" }}
                        >
                            {item.name}
                        </h2>
                        
                        <div 
                            className="rarity-badge"
                            style={{ 
                                backgroundColor: rarityColors[item.rarity] || "#333",
                                color: 'white',
                                padding: '4px 8px',
                                borderRadius: '12px',
                                fontSize: '12px',
                                fontWeight: 'bold',
                                marginTop: '10px'
                            }}
                        >
                            {item.rarity}
                        </div>
                        
                        <div className="flip-hint" style={{ 
                            marginTop: '15px', 
                            fontSize: '12px', 
                            color: '#666',
                            fontStyle: 'italic' 
                        }}>
                            Click to see details
                        </div>
                    </div>
                </div>

                {/* Back Side */}
                <div className={`loot-card-back ${item.rarity.toLowerCase()}`}>
                    <div 
                        className="rarity-border"
                        style={{ borderColor: rarityColors[item.rarity] || "#333" }}
                    >
                        <h3 
                            style={{ 
                                color: rarityColors[item.rarity] || "#333",
                                marginBottom: '15px',
                                fontSize: '16px',
                                fontWeight: 'bold',
                                textAlign: 'center'
                            }}
                        >
                            {item.name}
                        </h3>

                        {Array.isArray(item.stats) && item.stats.length > 0 && (
                            <div className="stats-section">
                                <p>Stats:</p>
                                <ul>
                                    {item.stats.map((s, i) => (
                                        <li key={i}>
                                            {s.stat}: <strong>{s.value}</strong>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {Array.isArray(item.effects) && item.effects.length > 0 && (
                            <div className="effects-section">
                                <p>Effects:</p>
                                <ul>
                                    {item.effects.map((e, i) => (
                                        <li key={i}>
                                            {e}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {buttonText && onButtonClick && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onButtonClick(item);
                                }}
                                style={defaultButtonStyle}
                            >
                                {buttonText}
                            </button>
                        )}
                        
                        <div className="flip-hint" style={{ 
                            marginTop: '10px', 
                            fontSize: '11px', 
                            color: '#6c757d',
                            fontStyle: 'italic',
                            textAlign: 'center'
                        }}>
                            Click to flip back
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};