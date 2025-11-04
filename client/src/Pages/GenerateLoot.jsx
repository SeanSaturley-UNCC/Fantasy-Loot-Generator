import { useCallback, useEffect, useState } from "react";
import "../App.css";
import { generateLoot, saveLoot } from "../requests/lootRequests";
import { checkSession, logoutUser } from "../requests/userRequests";
import { useNavigate } from "react-router-dom";

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

    const rarityColors = {
        Common: "#9E9E9E",
        Uncommon: "#388E3C",
        Rare: "#1E88E5",
        Epic: "#8E24AA",
        Legendary: "#FFD700",
    };

    if (initializing) {
        return <div className="App">Loading...</div>;
    }

    return (
        <div className="App">
            <h1>Fantasy Loot Generator</h1>

            <p>Welcome, <strong>{user?.username}</strong>!</p>

            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', alignItems: 'center' }}>
                <button
                    className="generate-btn"
                    onClick={handleGenerateItem}
                    disabled={loading}
                >
                    {loading ? "Generating…" : "Generate Item"}
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

            {item && (
                <div
                    className="item-card"
                    style={{ borderColor: rarityColors[item.rarity] || "#333" }}
                    aria-live="polite"
                >
                    <h2 style={{ color: rarityColors[item.rarity] || "#333" }}>
                        {item.name}
                    </h2>

                    <p><strong>Type:</strong> {item.type}</p>
                    <p><strong>Rarity:</strong> {item.rarity}</p>

                    {Array.isArray(item.stats) && item.stats.length > 0 && (
                        <>
                            <p><strong>Stats:</strong></p>
                            <ul>
                                {item.stats.map((s, i) => (
                                    <li key={i}>
                                        {s.stat}: {s.value}
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}

                    {Array.isArray(item.effects) && item.effects.length > 0 && (
                        <>
                            <p><strong>Effects:</strong></p>
                            <ul>
                                {item.effects.map((e, i) => (
                                    <li key={i}>{e}</li>
                                ))}
                            </ul>
                        </>
                    )}

                    <button
                        className="save-item-btn"
                        onClick={() => handleSaveLoot(item)}
                        style={{
                            backgroundColor: '#28a745',
                            color: 'white',
                            border: 'none',
                            padding: '8px 16px',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            marginTop: '15px'
                        }}
                    >
                        Save Item
                    </button>
                </div>
            )}
        </div>
    );
}
