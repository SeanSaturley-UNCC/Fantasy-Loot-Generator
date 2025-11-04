import { useCallback, useEffect, useState } from "react";
import "../App.css";
import { generateLoot, saveLoot } from "../requests/lootRequests";
import { checkSession, logoutUser } from "../requests/userRequests";
import { useNavigate } from "react-router-dom";
import { LootCard } from "../components/LootCard";

export const App = () => {
    const [item, setItem] = useState(null);
    const [initializing, setInitializing] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);
    const navigate = useNavigate()

    useEffect(() => {
        const handleCheckSession = async () => {
            try {
                const userToBe = await checkSession()
                setUser(userToBe);
                if (!userToBe.username) {
                    navigate('/login')
                }
                setInitializing(false);
            } catch (err) {
                navigate('/login')
            }
        }
        handleCheckSession();
    }, [])

    const handleGenerateItem = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await generateLoot();
            setItem(data);
        } catch (error) {
            setError('Failed to generate item. ' + error.message);
        }
        setLoading(false);
    };

    const handleLogout = useCallback(async () => {
        try {
            await logoutUser(user?._id);
            navigate('/login')
        } catch (error) {
            
        }
    }, [user, navigate]);

    const handleSaveLoot = async (
        loot
    ) => {
        try {
            await saveLoot(loot)
            alert('Item saved successfully!')
        } catch (err) {
            alert('Failed to save item. ' + err.message)
        }
    }

    if (initializing) {
        return <div className="App">Loading...</div>;
    }

    return (
        <div className="App">
            <h1>Fantasy Loot Generator</h1>

            <p>Welcome, <strong>{user?.username}</strong>!</p>

            <div style={{ display: 'flex', gap: '5px', justifyContent: 'center', alignItems: 'center' }}>
                <button
                    className="generate-btn"
                    onClick={handleGenerateItem}
                    disabled={loading}
                >
                    {loading ? "Generating…" : "Generate Item"}
                </button>

                <button
                    onClick={() => navigate('/inventory')}
                    style={{
                        backgroundColor: '#28a745',
                        color: 'white',
                        border: 'none',
                        padding: '10px 20px',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontSize: '16px'
                    }}
                >
                    View Inventory
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
                            name: "Generate Your First Item",
                            type: "Mystery",
                            rarity: "Common",
                            stats: [{ stat: "Excitement", value: "∞" }],
                            effects: ["Click the button above to begin your adventure!"]
                        }}
                        buttonText={null}
                        onButtonClick={null}
                    />
                )}
            </div>
        </div>
    );
}
