# 🚀 Fantasy Loot Generator

## [View it live](https://lootgenserver.psanto.com) at https://lootgenserver.psanto.com

### Logging in
user any of the following users to see the site
| Username | Password     |
|----------|-------------|
| user1    | password123 |
| user2    | password123 |
| user3    | password123 |
| user4    | password123 |
| user5    | password123 |

### User Flow
1. Create Account & Login
- Click "Create Account" or navigate to /create-user
- Enter a username and password
- Click "Create Account"
- You'll be redirected to the login page
- Enter your credentials and click "Login"
- Upon successful login, you're redirected to the Generate Loot page

2. Generate & Save Items
- After logging in, you land on the Generate Loot page (/generate)
- Click the "Generate Item" button
    - A random item appears with:
        - Name (e.g., "Fire Sword", "Healing Potion")
        - Type (Sword, Shield, Armor, Bow, Potion)
        - Rarity (Common, Uncommon, Rare, Epic, Legendary)
        - Stats (Attack/Defense/Potency values)
        - Effects (special abilities)
        - Gold Value
- Review the generated item
- If you like it, click "Save to Inventory"
    - The item is added to your inventory
    - The item card clears, ready for another generation
- Repeat steps 2-4 to build your collection (generate multiple items)

3. View Your Inventory
- Click "Inventory" in the navigation bar
- You'll see all your saved items displayed as cards
- You can:
    - Sort by: Name, Type, Rarity, Value, Date Created
    - Filter items to find specific types or rarities
    - Discard unwanted items (removes them permanently)

4. Create a Trade Offer
- From your Inventory page, click "Create Trade" button
- You'll be taken to the Create Trade page (/create-trade)
- Select items you want to offer:
    - Your inventory appears on the left
    - Click on 1-3 items you're willing to trade away
    - Selected items highlight or show a checkmark
- Choose a trading partner:
    - Select another user from the dropdown list
- Select items you want to request:
    - The selected user's inventory appears on the right
    - Click on 1-3 items you want from them
- Click "Create Trade Offer"
- Trade is created with status "Pending"

5. View & Manage Trades
- Click "Trades" in the navigation bar
- You'll see two sections:
    - Incoming Trades (Offers to You):
        -   Trades where others want items from you
        -   Shows what they're offering and what they want
        -   Actions:
            -   Accept - Trade executes, items swap inventories
            -   Decline - Trade is rejected and archived
    -   Outgoing Trades (Your Offers):
      - Trades you've created
        Shows what you offered and requested
        See current status: Pending, Accepted, or Declined
        Can cancel pending trades if desired
  
6. Complete a Trade
- Go to Trades page
- Review an incoming trade offer
- Check the items being offered vs. requested
- Click "Accept Trade"
- Items are automatically swapped:
    - Requested items move to your inventory
    - Offered items move to the other user's inventory
- Trade status updates to "Accepted"
- Check your Inventory to see your new items!
- 
8. Logout
- Click "Logout" button in the nav bar
- Session ends and you're redirected to the login page


---

## 🧰 1. Installation

Make sure you have the following installed:

- [Docker Compose](https://docs.docker.com/compose/install/)  
- (Dev only) [NPM](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)

---

## 🏃 2. Running the Project

### A - Installing Packages
```bash
cd client; npm install; cd ../
cd server; npm install; cd ../
```

### Production
```bash
docker compose -f docker-compose.prod.yml up --build -d
```

### Development
```bash
npm run dev
```
