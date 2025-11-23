import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllTrades, respondToTrade } from '../requests/tradeRequests';
import { checkSession } from '../requests/userRequests';
import './ViewTrades.css';

interface LootItem {
    _id: string;
    name: string;
    type: string;
    rarity: string;
    value: number;
}

interface User {
    _id: string;
    username: string;
}

interface Trade {
    _id: string;
    offeredByUser: User;
    requestedFromUser: User;
    offeredItems: LootItem[];
    requestedItems: LootItem[];
    status: 'Pending' | 'Accepted' | 'Declined';
    createdAt: string;
}

const ViewTrades: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'sent' | 'received'>('received');
    const [sentTrades, setSentTrades] = useState<Trade[]>([]);
    const [receivedTrades, setReceivedTrades] = useState<Trade[]>([]);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState<string>('');
    const navigate = useNavigate();

    useEffect(() => {
        const init = async () => {
            try {
                const session = await checkSession();
                if (session?._id) {
                    setUserId(session._id);
                    await loadTrades(session._id);
                }
            } catch (error) {
                console.error('Error loading trades:', error);
                setLoading(false);
            }
        };
        init();
    }, []);

    const loadTrades = async (uid: string) => {
        try {
            console.log('userId for loading trades:', uid);
            setLoading(true);
            const trades = await getAllTrades(uid, 'all')
            console.log('Fetched trades:', trades);
            
            const sent = trades.filter((trade: Trade) => trade.offeredByUser._id === uid);
            const received = trades.filter((trade: Trade) => trade.requestedFromUser._id === uid);
            
            setSentTrades(sent);
            setReceivedTrades(received);
        } catch (error) {
            console.error('Error loading trades:', error);
        }
        setLoading(false);
    };

    const handleRespondToTrade = async (tradeId: string, accept: boolean) => {
        try {
            await respondToTrade(tradeId, { 
                userId, 
                action: accept ? 'approve' : 'deny' 
            });
            await loadTrades(userId);
        } catch (error) {
            console.error('Error responding to trade:', error);
            alert('Failed to respond to trade');
        }
    };

    const getRarityColor = (rarity: string) => {
        const colors: Record<string, string> = {
            'Common': '#9e9e9e',
            'Uncommon': '#4caf50',
            'Rare': '#2196f3',
            'Epic': '#9c27b0',
            'Legendary': '#ff9800'
        };
        return colors[rarity] || '#333';
    };

    const calculateTotalValue = (items: LootItem[]) => {
        return items.reduce((sum, item) => sum + item.value, 0);
    };

    const getStatusClass = (status: string) => {
        switch (status) {
            case 'Accepted':
                return 'status-accepted';
            case 'Declined':
                return 'status-declined';
            case 'Pending':
            default:
                return 'status-pending';
        }
    };

    const renderTradeCard = (trade: Trade, isSent: boolean) => {
        const otherUser = isSent ? trade.requestedFromUser : trade.offeredByUser;
        const myItems = isSent ? trade.offeredItems : trade.requestedItems;
        const theirItems = isSent ? trade.requestedItems : trade.offeredItems;

        return (
            <div key={trade._id} className="trade-card">
                <div className="trade-header">
                    <div className="trade-info">
                        <h3>{isSent ? 'Trade Offer to' : 'Trade Request from'} {otherUser.username}</h3>
                        <span className={`trade-status ${getStatusClass(trade.status)}`}>
                            {trade.status}
                        </span>
                    </div>
                    <span className="trade-date">
                        {new Date(trade.createdAt).toLocaleDateString()}
                    </span>
                </div>

                <div className="trade-items-container">
                    <div className="trade-side">
                        <h4>You Give</h4>
                        <div className="items-list">
                            {myItems.map((item) => (
                                <div key={item._id} className="trade-item">
                                    <img 
                                        src={`/images/${item.name}.png`}
                                        alt={item.name}
                                        className="item-icon"
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.src = '/images/Blindbox.png';
                                        }}
                                    />
                                    <div className="item-details">
                                        <span 
                                            className="item-name"
                                            style={{ color: getRarityColor(item.rarity) }}
                                        >
                                            {item.name}
                                        </span>
                                        <span className="item-type">{item.type}</span>
                                        <span className="item-value">{item.value}g</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="total-value">
                            Total: {calculateTotalValue(myItems)} gold
                        </div>
                    </div>

                    <div className="trade-arrow">⇄</div>

                    <div className="trade-side">
                        <h4>You Get</h4>
                        <div className="items-list">
                            {theirItems.map((item) => (
                                <div key={item._id} className="trade-item">
                                    <img 
                                        src={`/images/${item.name}.png`}
                                        alt={item.name}
                                        className="item-icon"
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.src = '/images/Blindbox.png';
                                        }}
                                    />
                                    <div className="item-details">
                                        <span 
                                            className="item-name"
                                            style={{ color: getRarityColor(item.rarity) }}
                                        >
                                            {item.name}
                                        </span>
                                        <span className="item-type">{item.type}</span>
                                        <span className="item-value">{item.value}g</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="total-value">
                            Total: {calculateTotalValue(theirItems)} gold
                        </div>
                    </div>
                </div>

                {!isSent && trade.status === 'Pending' && (
                    <div className="trade-actions">
                        <button 
                            className="accept-btn"
                            onClick={() => handleRespondToTrade(trade._id, true)}
                        >
                            Accept Trade
                        </button>
                        <button 
                            className="decline-btn"
                            onClick={() => handleRespondToTrade(trade._id, false)}
                        >
                            Decline Trade
                        </button>
                    </div>
                )}
            </div>
        );
    };

    if (loading) {
        return (
            <div className="view-trades-container">
                <div className="loading">Loading trades...</div>
            </div>
        );
    }

    return (
        <div className="view-trades-container">
            <div className="trades-header">
                <h1>My Trades</h1>
                <button 
                    className="create-trade-btn"
                    onClick={() => navigate('/create-trade')}
                >
                    + Create New Trade
                </button>
            </div>

            <div className="tabs">
                <button 
                    className={`tab ${activeTab === 'received' ? 'active' : ''}`}
                    onClick={() => setActiveTab('received')}
                >
                    Received ({receivedTrades.length})
                </button>
                <button 
                    className={`tab ${activeTab === 'sent' ? 'active' : ''}`}
                    onClick={() => setActiveTab('sent')}
                >
                    Sent ({sentTrades.length})
                </button>
            </div>

            <div className="trades-content">
                {activeTab === 'received' ? (
                    receivedTrades.length === 0 ? (
                        <div className="empty-state">
                            <p>No trades received yet</p>
                        </div>
                    ) : (
                        <div className="trades-list">
                            {receivedTrades.map(trade => renderTradeCard(trade, false))}
                        </div>
                    )
                ) : (
                    sentTrades.length === 0 ? (
                        <div className="empty-state">
                            <p>No trades sent yet</p>
                            <button 
                                className="create-trade-link"
                                onClick={() => navigate('/create-trade')}
                            >
                                Create your first trade
                            </button>
                        </div>
                    ) : (
                        <div className="trades-list">
                            {sentTrades.map(trade => renderTradeCard(trade, true))}
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

export default ViewTrades;
