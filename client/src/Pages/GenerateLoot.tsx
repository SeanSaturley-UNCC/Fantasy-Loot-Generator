import { useCallback, useEffect, useState } from "react";
import "../app.css";
import { generateLoot, saveLoot } from "../requests/lootRequests";
import { checkSession, logoutUser } from "../requests/userRequests";
import { useNavigate } from "react-router-dom";
import { LootCard } from "../components/LootCard";
import { LootDocument, SaveLootBody } from "../Types";

export const GenerateLoot = () => {
    const [item, setItem] = useState<LootDocument | null>(null);
    const [initializing, setInitializing] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [user, setUser] = useState<any>(null);
    const navigate = useNavigate()

    useEffect(() => {
        const handleCheckSession = async () => {
            try {
                const userToBe = await checkSession()
                setUser(userToBe)
                setInitializing(false);
            } catch (err) {
                console.error('Error loading session:', err);
                setInitializing(false);
            }
        }
        handleCheckSession();
    }, [])

    const handleGenerateItem = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await generateLoot();
            setItem(data as any);
        } catch (error: any) {
            setError('Failed to generate item. ' + error.message);
        }
        setLoading(false);
    };

    const handleLogout = useCallback(async () => {
        try {
            if (user?._id) {
                await logoutUser(user._id);
            }
            navigate('/login')
        } catch (error) {
            
        }
    }, [user, navigate]);

    const handleSaveLoot = async (lootItem: LootDocument) => {
        try {
            const body: SaveLootBody = {
                userId: user._id,
                loot: {
                    name: lootItem.name,
                    type: lootItem.type,
                    rarity: lootItem.rarity,
                    description: '',
                    value: lootItem.value
                }
            }
            await saveLoot(body)
            alert('Item saved successfully!')
        } catch (err: any) {
            // @ts-ignore
            alert('Failed to save item. ' + err?.response?.data?.error ?? 'Unknown error occurred.')
        }
    }

    if (initializing) {
        return <div className="App">Loading...</div>;
    }

    return (
        <div className="App">
            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'flex-start',
                marginTop: '30px',
                gap: '30px',
                flexWrap: 'wrap'
            }}>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '20px'
                }}>
                    {item ? (
                        <LootCard
                            item={item}
                            buttonText="Save Item to Inventory"
                            buttonColor="#28a745"
                            onButtonClick={handleSaveLoot}
                        />
                    ) : (
                        <LootCard
                            item={{
                                _id: 'placeholder',
                                name: "Generate Your First Item",
                                type: "Sword",
                                rarity: "Common",
                                stats: [{ stat: "Excitement", value: 100 }],
                                effects: ["Click the button below to begin your adventure!"],
                                value: 0,
                                createdAt: new Date(),
                                updatedAt: new Date()
                            } as any}
                        />
                    )}

                    <button
                        className="generate-btn"
                        onClick={handleGenerateItem}
                        disabled={loading}
                        style={{ width: '250px' }}
                    >
                        {loading ? "Generating…" : "Generate Item"}
                    </button>

                    {error && <div className="error">{error}</div>}
                </div>

                <div style={{
                    maxWidth: '400px',
                    background: 'white',
                    padding: '25px',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    textAlign: 'left'
                }}>
                    <h2 style={{ 
                        marginTop: 0, 
                        color: '#667eea',
                        fontSize: '24px',
                        borderBottom: '2px solid #667eea',
                        paddingBottom: '10px'
                    }}>
                        ⚔️ Loot Guide
                    </h2>
                    
                    <div style={{ marginBottom: '20px' }}>
                        <h3 style={{ color: '#333', fontSize: '18px', marginBottom: '10px' }}>
                            📦 Rarity Tiers
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span style={{ 
                                    color: '#9e9e9e', 
                                    fontWeight: 'bold',
                                    minWidth: '100px'
                                }}>Common</span>
                                <span style={{ fontSize: '14px', color: '#666' }}>60% drop rate, 1x value</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span style={{ 
                                    color: '#4caf50', 
                                    fontWeight: 'bold',
                                    minWidth: '100px'
                                }}>Uncommon</span>
                                <span style={{ fontSize: '14px', color: '#666' }}>25% drop rate, 1.5x value</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span style={{ 
                                    color: '#2196f3', 
                                    fontWeight: 'bold',
                                    minWidth: '100px'
                                }}>Rare</span>
                                <span style={{ fontSize: '14px', color: '#666' }}>10% drop rate, 2.5x value</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span style={{ 
                                    color: '#9c27b0', 
                                    fontWeight: 'bold',
                                    minWidth: '100px'
                                }}>Epic</span>
                                <span style={{ fontSize: '14px', color: '#666' }}>4% drop rate, 4x value</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span style={{ 
                                    color: '#ff9800', 
                                    fontWeight: 'bold',
                                    minWidth: '100px'
                                }}>Legendary</span>
                                <span style={{ fontSize: '14px', color: '#666' }}>1% drop rate, 7x value</span>
                            </div>
                        </div>
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <h3 style={{ color: '#333', fontSize: '18px', marginBottom: '10px' }}>
                            🗡️ Item Types
                        </h3>
                        <ul style={{ 
                            margin: 0, 
                            paddingLeft: '20px',
                            color: '#666',
                            fontSize: '14px',
                            lineHeight: '1.8'
                        }}>
                            <li><strong>Sword</strong> - Offensive weapons with attack stats</li>
                            <li><strong>Shield</strong> - Defensive gear with defense stats</li>
                            <li><strong>Armor</strong> - Protective equipment with defense stats</li>
                            <li><strong>Bow</strong> - Ranged weapons with attack stats</li>
                            <li><strong>Potion</strong> - Consumables with potency effects</li>
                        </ul>
                    </div>

                    <div>
                        <h3 style={{ color: '#333', fontSize: '18px', marginBottom: '10px' }}>
                            💰 Trading System
                        </h3>
                        <p style={{ 
                            margin: 0, 
                            color: '#666',
                            fontSize: '14px',
                            lineHeight: '1.6'
                        }}>
                            Save items to your inventory and trade them with other players! 
                            Higher rarity items are worth more gold and make better trade offers.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
