import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { checkSession, getAllUsers } from '../requests/userRequests';
import { getUserInventory } from '../requests/lootRequests';
import { createTrade } from '../requests/tradeRequests';
import { User } from '../Types';
import './CreateTrade.css';

export const CreateTrade = () => {
    const [user, setUser] = useState<any>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<string>('');
    const [myInventory, setMyInventory] = useState<any[]>([]);
    const [theirInventory, setTheirInventory] = useState<any[]>([]);
    const [selectedMyItems, setSelectedMyItems] = useState<string[]>([]);
    const [selectedTheirItems, setSelectedTheirItems] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [initializing, setInitializing] = useState(true);
    const [mySortBy, setMySortBy] = useState<string>('name');
    const [theirSortBy, setTheirSortBy] = useState<string>('name');
    const navigate = useNavigate();
    const location = useLocation();

    // Get pre-selected item from navigation state
    const preSelectedItem = location.state?.itemId;

    useEffect(() => {
        const init = async () => {
            try {
                const userData = await checkSession();
                setUser(userData);

                // Load my inventory
                if (userData?._id) {
                    const myInv = await getUserInventory(userData._id, null, null);
                    setMyInventory(myInv);

                    // Pre-select item if passed from inventory
                    if (preSelectedItem) {
                        setSelectedMyItems([preSelectedItem]);
                    }

                    const usersToBe = await getAllUsers()
                    setUsers(usersToBe.filter((u: User) => u._id !== userData._id))
                }
                
                setInitializing(false);
            } catch (err) {
                console.error('Error initializing:', err);
                setInitializing(false);
            }
        };
        init();
    }, [preSelectedItem]);

    useEffect(() => {
        if (selectedUser && selectedUser !== user?._id) {
            loadTheirInventory();
        }
    }, [selectedUser]);

    const loadTheirInventory = async () => {
        try {
            const inv = await getUserInventory(selectedUser, null, null);
            setTheirInventory(inv);
        } catch (error) {
            console.error('Error loading their inventory:', error);
            setTheirInventory([]);
        }
    };

    const toggleMyItem = (itemId: string) => {
        setSelectedMyItems(prev => 
            prev.includes(itemId) 
                ? prev.filter(id => id !== itemId)
                : [...prev, itemId]
        );
    };

    const toggleTheirItem = (itemId: string) => {
        setSelectedTheirItems(prev => 
            prev.includes(itemId) 
                ? prev.filter(id => id !== itemId)
                : [...prev, itemId]
        );
    };

    const handleCreateTrade = async () => {
        if (selectedMyItems.length === 0) {
            alert('Please select at least one item to offer');
            return;
        }
        if (selectedTheirItems.length === 0) {
            alert('Please select at least one item to request');
            return;
        }
        if (!selectedUser) {
            alert('Please select a user to trade with');
            return;
        }

        setLoading(true);
        try {
            await createTrade({
                offeredItemIds: selectedMyItems,
                requestedItemIds: selectedTheirItems,
                offeredByUserId: user._id,
                requestedFromUserId: selectedUser
            });
            alert('Trade offer created successfully!');
            navigate('/trades');
        } catch (error: any) {
            alert('Failed to create trade: ' + error.message);
        }
        setLoading(false);
    };

    const getRarityColor = (rarity: string) => {
        const colors: Record<string, string> = {
            Common: "#9E9E9E",
            Uncommon: "#388E3C",
            Rare: "#1E88E5",
            Epic: "#8E24AA",
            Legendary: "#FFD700",
        };
        return colors[rarity] || "#333";
    };

    const calculateTotalValue = (items: any[], selectedIds: string[]) => {
        return items
            .filter(item => selectedIds.includes(item._id))
            .reduce((sum, item) => sum + item.value, 0);
    };

    const sortInventory = (items: any[], sortBy: string) => {
        const sorted = [...items];
        
        switch (sortBy) {
            case 'name':
                return sorted.sort((a, b) => a.name.localeCompare(b.name));
            case 'rarity':
                const rarityOrder: Record<string, number> = { 
                    'Common': 1, 
                    'Uncommon': 2, 
                    'Rare': 3, 
                    'Epic': 4, 
                    'Legendary': 5 
                };
                return sorted.sort((a, b) => (rarityOrder[b.rarity] || 0) - (rarityOrder[a.rarity] || 0));
            case 'value':
                return sorted.sort((a, b) => b.value - a.value);
            case 'type':
                return sorted.sort((a, b) => a.type.localeCompare(b.type));
            default:
                return sorted;
        }
    };

    const sortedMyInventory = sortInventory(myInventory, mySortBy);
    const sortedTheirInventory = sortInventory(theirInventory, theirSortBy);

    if (initializing) {
        return <div className="App">Loading...</div>;
    }

    return (
        <div className="create-trade-container">
            <div className="create-trade-header">
                <h1>⚔️ Create Trade Offer</h1>
                <button className="back-btn" onClick={() => navigate('/inventory')}>
                    ← Back to Inventory
                </button>
            </div>

            <div className="trade-setup">
                <div className="user-selector">
                    <label htmlFor="user-select">Trade with:</label>
                    <select
                        id="user-select"
                        value={selectedUser}
                        onChange={(e) => setSelectedUser(e.target.value)}
                        className="user-select"
                    >
                        <option value="">
                            {users.length === 0 ? 'No users found...' : 'Select a user...'}
                        </option>
                        {users.map((u) => (
                            <option key={u._id} value={u._id}>
                                {u.username}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="trade-summary">
                    <div className="summary-item">
                        <span>Your Offer: {selectedMyItems.length} items</span>
                        <span className="value">Total Value: {calculateTotalValue(myInventory, selectedMyItems)} gold</span>
                    </div>
                    <div className="trade-arrow">⇄</div>
                    <div className="summary-item">
                        <span>You Request: {selectedTheirItems.length} items</span>
                        <span className="value">Total Value: {calculateTotalValue(theirInventory, selectedTheirItems)} gold</span>
                    </div>
                </div>
            </div>

            <div className="trade-columns">
                <div className="inventory-column">
                    <div className="column-header">
                        <h2>Your Items (Offer)</h2>
                        <div className="sort-controls">
                            <label>Sort by:</label>
                            <select 
                                value={mySortBy} 
                                onChange={(e) => setMySortBy(e.target.value)}
                                className="sort-select"
                            >
                                <option value="name">Name</option>
                                <option value="rarity">Rarity</option>
                                <option value="value">Value</option>
                                <option value="type">Type</option>
                            </select>
                        </div>
                    </div>
                    <p className="column-hint">Select items to offer in the trade</p>
                    {myInventory.length === 0 ? (
                        <p className="empty-message">No items in your inventory</p>
                    ) : (
                        <div className="items-grid">
                            {sortedMyInventory.map((item) => (
                                <div
                                    key={item._id}
                                    className={`trade-item-card ${selectedMyItems.includes(item._id) ? 'selected' : ''}`}
                                    onClick={() => toggleMyItem(item._id)}
                                >
                                    <div className="item-checkbox">
                                        {selectedMyItems.includes(item._id) && '✓'}
                                    </div>
                                    <img 
                                        src={`/images/${item.name}.png`}
                                        alt={item.name}
                                        className="item-thumbnail"
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.src = '/images/Blindbox.png';
                                        }}
                                    />
                                    <h3 style={{ color: getRarityColor(item.rarity) }}>
                                        {item.name}
                                    </h3>
                                    <p className="item-type">{item.type}</p>
                                    <span 
                                        className="rarity-badge"
                                        style={{ backgroundColor: getRarityColor(item.rarity) }}
                                    >
                                        {item.rarity}
                                    </span>
                                    <p className="item-value">{item.value} gold</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="inventory-column">
                    <div className="column-header">
                        <h2>Their Items (Request)</h2>
                        <div className="sort-controls">
                            <label>Sort by:</label>
                            <select 
                                value={theirSortBy} 
                                onChange={(e) => setTheirSortBy(e.target.value)}
                                className="sort-select"
                            >
                                <option value="name">Name</option>
                                <option value="rarity">Rarity</option>
                                <option value="value">Value</option>
                                <option value="type">Type</option>
                            </select>
                        </div>
                    </div>
                    <p className="column-hint">Select items you want in return</p>
                    {!selectedUser ? (
                        <p className="empty-message">Enter a user ID above to view their inventory</p>
                    ) : theirInventory.length === 0 ? (
                        <p className="empty-message">This user has no items</p>
                    ) : (
                        <div className="items-grid">
                            {sortedTheirInventory.map((item) => (
                                <div
                                    key={item._id}
                                    className={`trade-item-card ${selectedTheirItems.includes(item._id) ? 'selected' : ''}`}
                                    onClick={() => toggleTheirItem(item._id)}
                                >
                                    <div className="item-checkbox">
                                        {selectedTheirItems.includes(item._id) && '✓'}
                                    </div>
                                    <img 
                                        src={`/images/${item.name}.png`}
                                        alt={item.name}
                                        className="item-thumbnail"
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.src = '/images/Blindbox.png';
                                        }}
                                    />
                                    <h3 style={{ color: getRarityColor(item.rarity) }}>
                                        {item.name}
                                    </h3>
                                    <p className="item-type">{item.type}</p>
                                    <span 
                                        className="rarity-badge"
                                        style={{ backgroundColor: getRarityColor(item.rarity) }}
                                    >
                                        {item.rarity}
                                    </span>
                                    <p className="item-value">{item.value} gold</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="trade-actions">
                <button 
                    className="create-trade-btn"
                    onClick={handleCreateTrade}
                    disabled={loading || selectedMyItems.length === 0 || selectedTheirItems.length === 0}
                >
                    {loading ? 'Creating Trade...' : 'Create Trade Offer'}
                </button>
                <button 
                    className="cancel-btn"
                    onClick={() => navigate('/inventory')}
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};
