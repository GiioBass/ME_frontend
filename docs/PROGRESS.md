# Mystic Explorers (Frontend) - Informe de Modernización y Arquitectura

Este documento describe la modernización integral, refactorización y sincronización de `ME_frontend` con las capacidades del nuevo backend (`ME_backend`), completada en 3 fases estructuradas.

---

## 1. Resumen de Fases Ejecutadas

### Fase 1: Limpieza & Deuda Técnica
- **Eliminación de Temporales**: Remoción de archivos de log obsoletos (`frontend.log`).
- **Resolución de Linter (ESLint)**: Corrección de tipos explícitos `any` en `EntityList.tsx` y `MainGameHUD.tsx`. Ahora pasa `eslint .` con 0 errores y 0 advertencias.
- **Sincronización de Tipos TypeScript (`src/api.ts`)**:
  - `PlayerStats`: `hp`, `max_hp`, `mp`, `max_mp`, `level`, `xp`, `strength`, `defense`, `gold`, `character_class`, `hunger`, `thirst`, `max_weight`.
  - `Quest` y `QuestObjective`: estructura de misiones, seguimiento de objetivos (kill, gather, talk) y recompensas.
  - `Skill`: habilidades de combate por clase con coste de MP, cooldowns y daño/curación.
  - `ActiveDialogue` y `DialogueOption`: árbol interactivo de conversación con NPCs.
  - `Recipe`: fórmulas de crafteo y requisitos de estaciones de trabajo.

### Fase 2: Modularización & Capa de Servicios
- **Capa de API (`src/api.ts`)**:
  - Funciones tipadas para todos los endpoints:
    - Diálogo y NPCs: `actionTalk()`, `actionDialogue()`.
    - Comercio y Tienda: `actionBuy()`, `actionSell()`.
    - Misiones: `actionQuests()`, `actionQuestTurnIn()`.
    - Clases y Combate: `actionSelectClass()`, `actionUseSkill()`, `actionGetSkills()`.
    - Crafteo: `actionCraft()`, `actionGetRecipes()`.
- **Motor de Juego Reactivo (`src/hooks/useGameEngine.ts`)**:
  - Manejadores centralizados (`handleTalk`, `handleDialogueChoice`, `handleBuy`, `handleSell`, `handleQuestTurnIn`, `handleSelectClass`, `handleUseSkill`, `handleCraft`).
  - Sincronización atómica del estado (`gameState`), inventario y bitácora de eventos del terminal.

### Fase 3: Nuevas Funcionalidades & Excelencia UI/UX
- **Modal de Diálogo Interactivo (`src/components/Modals/DialogueModal.tsx`)**:
  - Interfaz de conversación con NPCs (Elder, Silas, Ted, etc.), citas narrativas y opciones de respuesta interactivas.
- **Modal de Tienda & Mercado (`src/components/Modals/ShopModal.tsx`)**:
  - Pestañas de Compra (inventario del mercader) y Venta (inventario del jugador) con visualizador de balance de Oro en vivo.
- **Modal de Bitácora de Misiones (`src/components/Modals/QuestJournalModal.tsx`)**:
  - Seguimiento de progreso en tiempo real de objetivos (`[2/3] Giant Rat`), vista de recompensas y reclamo de recompensas con un clic.
- **Modal de Taller y Crafteo (`src/components/Modals/CraftingModal.tsx`)**:
  - Detección de estaciones de trabajo (Campfire, Forge, Alchemy Lab), comprobación de materiales en inventario y ensamblaje.
- **Barra de Habilidades de Combate (`src/components/Combat/SkillBar.tsx`)**:
  - Hotbar interactiva con habilidades de clase (Fighter, Marksman, Mage, Adventurer), consumo de Maná (MP), selección automática de objetivos e indicadores de estado.
- **Modal de Especialización de Clase (`src/components/Modals/ClassSelectModal.tsx`)**:
  - Selector in-game de especialización (Guerrero, Tirador, Mago).
- **Bio-Metrics Mejorado (`src/components/StatusPanel/BioMetrics.tsx`)**:
  - Barra de Maná (MP azul cian), contador de Oro con icono de bolsa de monedas, badge de clase estilizado por arquetipo, nivel y estadísticas de Ataque y Defensa.
- **Sector Data & Lista de Entidades (`LocationInfo.tsx`, `EntityList.tsx`)**:
  - Visualización de ciudadanos/NPCs presentes con botones rápidos "Talk" y "Trade", y estaciones de trabajo con botón "Craft".
- **Pantalla de Registro / Login (`src/components/LoginScreen.tsx`)**:
  - Selección de arquetipo inicial al registrar un nuevo operador.

---

## 2. Mapa de Componentes y Modales

```
src/
├── api.ts                     # Cliente Axios con tipos completos TypeScript
├── hooks/
│   └── useGameEngine.ts       # Hook orquestador del estado del juego y acciones
├── layouts/
│   └── MainGameHUD.tsx        # HUD principal responsivo para Desktop y Mobile
├── components/
│   ├── Combat/
│   │   └── SkillBar.tsx       # Hotbar de hechizos y habilidades de combate
│   ├── Modals/
│   │   ├── DialogueModal.tsx  # Modal de conversación con NPCs
│   │   ├── ShopModal.tsx      # Modal de mercado / tienda
│   │   ├── QuestJournalModal.tsx # Diario de misiones y recompensas
│   │   ├── CraftingModal.tsx  # Taller de crafteo y estaciones
│   │   ├── ClassSelectModal.tsx # Selector de especialización de clase
│   │   └── CommandListModal.tsx # Glosario de comandos
│   ├── StatusPanel/
│   │   ├── BioMetrics.tsx     # HP, MP, Hambre, Sed, Oro, Nivel, Clase, Equipo
│   │   ├── LocationInfo.tsx   # Sector actual, coordenadas, interactables
│   │   ├── EntityList.tsx     # NPCs, enemigos y objetos detectados
│   │   ├── NavigationGrid.tsx # Controles de movimiento direccional
│   │   ├── InventoryModal.tsx # Gestión de inventario y peso
│   │   ├── WaypointsModal.tsx # Fast travel y campamentos
│   │   ├── CampChestModal.tsx # Almacenamiento seguro en campamento
│   │   └── RadarModal.tsx     # Exploración de largo alcance
│   ├── Terminal/
│   │   └── GameTerminal.tsx   # Consola de comandos retro-futurista
│   └── LoginScreen.tsx        # Autenticación y selección de clase inicial
```

---

## 3. Estado de Verificación y Compilación
- **TypeScript & Vite Build**: `npm run build` completa con código de salida `0` y 0 errores.
- **ESLint**: `npm run lint` completa con 0 advertencias y 0 errores.
- **Backend Tests**: `./venv/bin/pytest` 33 pruebas unitarias e integrales pasando al 100%.
