import { useCallback, useEffect, useState } from "react";
import "../App.css";
import { getUserInventory, discardLoot } from "../requests/lootRequests";
import { checkSession, logoutUser } from "../requests/userRequests";
import { useNavigate } from "react-router-dom";
import { LootCard } from "../components/LootCard";

export const ViewInventory = () => {
    const [inventory, setInventory] = useState([]);
    const [initializing, setInitializing] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);
    const [sortBy, setSortBy] = useState('');
    const [sortOrder, setSortOrder] = useState(1);
    const navigate = useNavigate();

    useEffect(() => {
        const handleCheckSession = async () => {
            try {
                const userToBe = await checkSession();
                setUser(userToBe);
                if (!userToBe.username) {
                    navigate('/login');
                }
                // Fetch user inventory after authentication
                await fetchInventory(userToBe._id);
                setInitializing(false);
            } catch (err) {
                navigate('/login');
            }
        };
        handleCheckSession();
    }, [navigate]);

    const fetchInventory = async (userId, sortByParam = null, sortOrderParam = null) => {
        setLoading(true);
        setError(null);
        try {
            const inventoryData = await getUserInventory(userId, sortByParam, sortOrderParam);
            setInventory(inventoryData || []);
        } catch (error) {
            setError('Failed to fetch inventory. ' + error.message);
        }
        setLoading(false);
    };

    const handleSortChange = async (newSortBy, newSortOrder) => {
        setSortBy(newSortBy);
        setSortOrder(newSortOrder);
        if (user?._id) {
            await fetchInventory(user._id, newSortBy, newSortOrder);
        }
    };

    const handleLogout = useCallback(async () => {
        try {
            await logoutUser(user?._id);
            navigate('/login');
        } catch (error) {
            // Handle logout error silently
        }
    }, [user, navigate]);

    const handleDiscardItem = async (itemId) => {
        if (window.confirm('Are you sure you want to discard this item?')) {
            try {
                await discardLoot(itemId);
                // Remove from local state after successful API call
                setInventory(prev => prev.filter(item => item._id !== itemId));
                alert('Item discarded successfully!');
            } catch (err) {
                alert('Failed to discard item. ' + err.message);
            }
        }
    };

    if (initializing) {
        return <div className="App">Loading...</div>;
    }

    return (
        <div className="App">
            <h1>Your Inventory - {inventory.length} item(s)</h1>

            <p>Welcome, <strong>{user?.username}</strong>!</p>

            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', alignItems: 'center', marginBottom: '20px' }}>
                <button
                    onClick={() => navigate('/generate')}
                    style={{
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        padding: '10px 20px',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontSize: '16px'
                    }}
                >
                    Generate More Loot
                </button>

                <button
                    className="logout-btn"
                    onClick={handleLogout}
                    style={{
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        padding: '10px 20px',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontSize: '16px'
                    }}
                >
                    Logout
                </button>
            </div>

            {/* Sorting Controls */}
            <div style={{ 
                display: 'flex', 
                gap: '15px', 
                justifyContent: 'center', 
                alignItems: 'center', 
                marginBottom: '20px',
                padding: '15px',
                backgroundColor: '#f8f9fa',
                borderRadius: '8px',
                maxWidth: '600px',
                margin: '0 auto 20px auto'
            }}>
                <label style={{ fontWeight: 'bold' }}>Sort by:</label>
                <select 
                    value={sortBy} 
                    onChange={(e) => {
                        const newSortBy = e.target.value;
                        if (newSortBy) {
                            handleSortChange(newSortBy, sortOrder);
                        } else {
                            handleSortChange(null, null);
                        }
                    }}
                    style={{
                        padding: '8px 12px',
                        borderRadius: '4px',
                        border: '1px solid #ccc',
                        backgroundColor: 'white'
                    }}
                >
                    <option value="">Default (Date Created)</option>
                    <option value="rarity">Rarity</option>
                    <option value="type">Type</option>
                    <option value="name">Name</option>
                    <option value="value">Value</option>
                </select>

                {sortBy && (
                    <>
                        <label style={{ fontWeight: 'bold' }}>Order:</label>
                        <select 
                            value={sortOrder} 
                            onChange={(e) => handleSortChange(sortBy, parseInt(e.target.value))}
                            style={{
                                padding: '8px 12px',
                                borderRadius: '4px',
                                border: '1px solid #ccc',
                                backgroundColor: 'white'
                            }}
                        >
                            <option value={1}>Ascending</option>
                            <option value={-1}>Descending</option>
                        </select>
                    </>
                )}

                {sortBy && (
                    <button
                        onClick={() => {
                            setSortBy('');
                            setSortOrder(1);
                            handleSortChange(null, null);
                        }}
                        style={{
                            backgroundColor: '#6c757d',
                            color: 'white',
                            border: 'none',
                            padding: '8px 12px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '14px'
                        }}
                    >
                        Clear Sort
                    </button>
                )}
            </div>

            {loading && <div>Loading inventory...</div>}
            {error && <div className="error">{error}</div>}

            {!loading && !error && (
                <>
                    {inventory.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '40px' }}>
                            <h3>Your inventory is empty!</h3>
                            <p>Generate some loot to get started.</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', maxWidth: '1200px', margin: '0 auto', justifyContent: 'center' }}>
                            {inventory.map((item) => (
                                <LootCard
                                    key={item._id}
                                    item={item}
                                    buttonText="Discard Item"
                                    buttonColor="#dc3545"
                                    onButtonClick={(item) => handleDiscardItem(item._id)}
                                />
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};
