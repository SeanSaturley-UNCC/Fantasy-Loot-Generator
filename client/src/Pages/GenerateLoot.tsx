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
            <h1>Fantasy Loot Generator</h1>

            <div style={{ display: 'flex', gap: '5px', justifyContent: 'center', alignItems: 'center', marginTop: '20px' }}>
                <button
                    className="generate-btn"
                    onClick={handleGenerateItem}
                    disabled={loading}
                >
                    {loading ? "Generating…" : "Generate Item"}
                </button>

            </div>

            {error && <div className="error">{error}</div>}

            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                marginTop: '30px'
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
                            effects: ["Click the button above to begin your adventure!"],
                            value: 0,
                            createdAt: new Date(),
                            updatedAt: new Date()
                        } as any}
                    />
                )}
            </div>
        </div>
    );
}
