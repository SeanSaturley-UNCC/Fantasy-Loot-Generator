import { useCallback, useEffect, useState } from "react";
import "../app.css";
import { getUserInventory, discardLoot } from "../requests/lootRequests";
import { checkSession, logoutUser } from "../requests/userRequests";
import { useNavigate } from "react-router-dom";
import { LootCard } from "../components/LootCard";

export const ViewInventory = () => {
    const [inventory, setInventory] = useState<any[]>([]);
    const [initializing, setInitializing] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<any>(null);
    const [user, setUser] = useState<any>(null);
    const [sortBy, setSortBy] = useState('');
    const [sortOrder, setSortOrder] = useState(1);
    const navigate = useNavigate();

    useEffect(() => {
        const handleCheckSession = async () => {
            try {
                const userToBe: any = await checkSession();
                setUser(userToBe);
                // Fetch user inventory after authentication
                if (userToBe?._id) {
                    await fetchInventory(userToBe._id);
                }
                setInitializing(false);
            } catch (err) {
                console.error('Error loading session:', err);
                setInitializing(false);
            }
        };
        handleCheckSession();
    }, []);

    const fetchInventory = async (userId: any, sortByParam: string | null = null, sortOrderParam: number | null = null) => {
        setLoading(true);
        setError(null);
        try {
            const inventoryData = await getUserInventory(userId, sortByParam, sortOrderParam);
            setInventory(inventoryData || []);
        } catch (error: any) {
            setError('Failed to fetch inventory. ' + error.message);
        }
        setLoading(false);
    };

    const handleSortChange = async (newSortBy: any, newSortOrder: any) => {
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

    const handleDiscardItem = async (itemId: any) => {
        if (window.confirm('Are you sure you want to discard this item?')) {
            try {
                await discardLoot(itemId);
                // Remove from local state after successful API call
                setInventory(prev => prev.filter(item => item._id !== itemId));
                alert('Item discarded successfully!');
            } catch (err: any) {
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
                                    onButtonClick={(item: any) => handleDiscardItem(item._id)}
                                />
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};
