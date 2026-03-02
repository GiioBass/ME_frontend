# Mystic Explorers - Frontend User Manual

This document provides a guide on how to use the web interface of Mystic Explorers and understand its core features, ensuring a seamless experience for the player.

## 1. Interaction Overview

The frontend interface acts as a comprehensive Heads-Up Display (HUD) that mirrors a retro-futuristic or terminal-based exploration aesthetic. You interact with the game primarily through the **Command Terminal** at the bottom of the screen, while the UI panels dynamically update to reflect the world and your status.

### Status Panels
*   **BioMetrics:** Displays your current Health Points (HP), Maximum Health, Experience (XP), current carrying weight, and maximum weight capacity.
*   **Location Info:** Displays the current biome, location name, time of day (including Day/Night cycles), and the descriptive text of your immediate surroundings.
*   **Navigation Grid:** A visual D-pad that shows available exits (North, South, East, West). You can click these buttons instead of typing `go north`.
*   **Radar / Scanner:** An aesthetic minimap representation. (In development: will show nearby chunk layouts).
*   **Entity List (Ground):** Displays items and enemies currently present in the room.

## 2. Using Waypoints and Fast Travel

In the harsh world of Mystic Explorers, the player can establish secure waypoints to quickly return to important locations (like a merchant, a newly found dungeon, or a safe zone).

### Making a Camp (Waypoint)
Waypoints are **not created automatically** when you discover a Point of Interest (POI). Instead, the player decides when and where to set up a camp.
1.  Navigate to a cell you want to mark as safe or important.
2.  In the terminal, type the command: `camp [Name_of_your_Camp]`
    *   *Example:* `camp Base1` or `camp BanditLoot`
3.  The coordinates of this specific cell are now saved to your player data permanently.

### Fast Traveling
Once a waypoint is established, you can instantly return to it from anywhere in the world, provided you have enough energy/HP to make the trip.
1.  Click the **Fast Travel / Waypoints** button on the UI (Map Pin icon) or type `travel [Name]`.
2.  A modal will open showing your discovered network of waypoints.
3.  Clicking **Travel** will consume HP (Energy) based on the distance between your current location and the target camp.
4.  *Warning:* Fast traveling over very long distances without enough HP will result in failure or death.

## 3. Inventory and Chest Management

### Personal Backpack
Your inventory is limited by weight.
*   To pick up an item, click **TAKE 1** or **TAKE ALL** on the Entity List, or type `take [Item Name] [qty]`.
*   To drop items, open your Inventory (Backpack icon) and use the **DROP** buttons, or type `drop [Item Name] [qty]`.
*   *Note:* Dropped items disappear forever. They do not persist on the floor.

### Camp Storage (Chests)
*(Feature pending backend link)*
Camp Chests allow you to circumvent your maximum weight limit by storing items persistently in a specific location (LocationDB.camp_storage).
1.  Click the **Storage Unit** icon when standing on a valid camp tile.
2.  You can easily swap items between your Backpack and the Camp Chest using the arrow buttons.
3.  Items stored in a Camp Chest remain tied to those exact world coordinates.

## 4. Combat System

When enemies are present in the room, they will appear in red within the Entity List.
*   Click **ENGAGE TARGET** or type `attack [Enemy Name]`.
*   Combat is turn-based. You will hit the enemy, and if it survives, it will hit you back immediately.
*   Keep an eye on your BioMetrics panel. If your HP reaches 0, you will die and respawn at the origin `(0,0,0)`.

## 5. Console Commands Reference

*   `move [north/south/east/west]` or `go [direction]`
*   `look` - Examine the room again.
*   `scout` - Check adjacent chunks for important landmarks.
*   `inventory` - List items and weight via text.
*   `take [item] [qty]` - Pick up items.
*   `drop [item] [qty]` - Destroy items from backpack.
*   `equip [item]`, `unequip [slot]` - Manage gear.
*   `camp [name]` - Create a fast-travel node.
*   `travel [name]` - Teleport to a node.
