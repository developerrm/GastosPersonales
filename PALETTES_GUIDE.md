# Guía de Paletas de Colores y Diseño (FinanzTitan)

Esta guía explica la arquitectura de diseño, el sistema de paletas de colores y el motor de cálculo de accesibilidad (`colorEngine.js`) utilizado en **FinanzTitan** para garantizar que la interfaz se mantenga hermosa, vibrante y 100% legible, sin importar qué tema se elija.

## 1. Arquitectura de Diseño (Design Tokens)

El sistema de colores está construido utilizando **Design Tokens** (Variables CSS) que permiten cambiar toda la paleta de la aplicación instantáneamente.
Estos tokens se encuentran definidos en el archivo `src/index.css`.

### Tokens Principales:
- `--color-bg-body`: Fondo general de la aplicación.
- `--color-bg-card`: Fondo translúcido/vidrio de los componentes (efecto Glassmorphism).
- `--color-bg-card-solid`: Color sólido opaco para áreas de máximo contraste o fallback.
- `--color-accent`: Color de acento primario (ej. los botones principales y enlaces).
- `--color-text-main` / `--color-text-muted`: Colores de texto. Se configuran con alta legibilidad en relación al fondo principal.
- `--color-table-head` / `--color-table-sticky`: Colores específicos para mantener la jerarquía de las tablas (ej. la Matriz Multi-Mes).

### Modo de Uso
Todos los componentes de React utilizan utilidades de **Tailwind CSS** o estilos en línea combinados con estos variables. Por ejemplo:
```jsx
style={{ backgroundColor: 'var(--color-bg-card-solid)', borderColor: 'var(--color-border)' }}
```

## 2. Catálogo de Temas Activos

Los temas se administran mediante el archivo `src/services/themeService.js`. En él se define un catálogo completo de temas claros y oscuros. Cada tema define colores de base, iconos y nombres. 

Actualmente el catálogo incluye:

**Modos Oscuros (Dark Mode):**
- **Titanium Gold**: Estilo metálico titanio con acentos dorados (Por defecto).
- **Cyber Neon**: Espacial oscuro con azul cian.
- **Emerald Obsidian**: Carbón oscuro y verde menta.
- **Amethyst Royal**: Índigo oscuro y púrpura real.
- **Sunset Bronze**: Cobre cálido y carbón.
- **OLED Pure Black**: Negro ultra profundo para pantallas OLED.

**Modos Claros (Light Mode & Pastel):**
- **Rose Blossom (Pink Balloon)**: Fondo crema suave, elementos fucsia neón, muy vibrante.
- **Cupcake Pastel**: Menta y rosa pálido con acentos azul petróleo.
- **Titanium Minimal (Claro)**: Un tema claro corporativo ultra minimalista.

## 3. Motor de Cálculo de Accesibilidad y Contraste (Color Engine)

Uno de los principales problemas de tener múltiples paletas (especialmente pasteles o muy claros) es que el texto puede perder legibilidad (ej. texto blanco sobre fondo menta, o amarillo pálido sobre blanco).

Para solucionar esto de manera inteligente, el proyecto incluye un motor matemático de cálculo de color en `src/utils/colorEngine.js`.
Este motor utiliza las pautas **WCAG 2.1 (Web Content Accessibility Guidelines)** para calcular la **luminancia relativa** y asegurar un contraste óptimo.

### Funciones Clave del Motor:

1. **`getRelativeLuminance(hex)`**: Calcula la luminancia [0 a 1] del color.
2. **`isLight(colorStr)`**: Determina si un color es inherentemente claro o pastel.
3. **`getContrastingTextColor(bgHex)`**: Selecciona texto oscuro (`#0f172a`) o texto claro (`#ffffff`) dependiendo de cuál garantiza mayor contraste contra el fondo.
4. **`getAccessibleBadgeStyle(baseColor, isLightMode)`**: Devuelve los colores de fondo, borde y texto ideales para las etiquetas/burbujas de los bancos. 
   - En temas oscuros, usa opacidad leve.
   - En temas claros, oscurece dinámicamente el texto sobre la etiqueta para mantener la legibilidad.
5. **`getModifiedAmountStyle(isLightMode)` / `getTableFooterStyle(isLightMode)`**: Generan un esquema pre-calculado para resaltar la tabla principal (Matriz) basándose en el modo actual del sistema.

### ¿Cómo aplicarlo a componentes nuevos?
Si creas una etiqueta que usa el color del usuario y necesitas que el texto se lea bien, importa la utilidad:
```jsx
import { isLight, getContrastingTextColor } from '../utils/colorEngine';

// Luego en el render...
const textColor = getContrastingTextColor(bank.color);
<span style={{ backgroundColor: bank.color, color: textColor }}>
  {bank.name}
</span>
```

## 4. Instrucciones: Cómo Agregar una Nueva Paleta

Para agregar una paleta de colores nueva, simplemente sigue 2 pasos:

**Paso 1: Agregar el Tema al Servicio (JS)**
Abre `src/services/themeService.js` y agrega el nuevo tema al array `THEMES`:
```javascript
{
  id: 'mi-tema',
  name: 'Mi Nuevo Tema',
  category: 'dark', // 'dark' o 'light' (importante para el colorEngine)
  description: 'Un breve resumen de sus colores',
  badgeClass: 'from-blue-500 to-indigo-600',
  primaryColor: '#3b82f6',
  bgColor: '#0f172a',
  surfaceColor: '#1e293b',
  swatches: ['#0f172a', '#1e293b', '#3b82f6', '#818cf8', '#ffffff'],
  icon: '🎨'
}
```

**Paso 2: Registrar las Variables (CSS)**
Abre `src/index.css` y crea un nuevo bloque para tu tema utilizando el selector `[data-theme="mi-tema"]`:
```css
[data-theme="mi-tema"] {
  color-scheme: dark;
  --color-bg-body: #0f172a;
  --color-bg-card: rgba(30, 41, 59, 0.85);
  --color-bg-card-solid: #1e293b;
  /* ... mapea el resto de las variables (ver index.css original para referencia) */
}
```

La aplicación leerá tu tema de forma automática en el selector de la Interfaz y `colorEngine.js` ajustará textos en las tablas gracias al campo `category`.
