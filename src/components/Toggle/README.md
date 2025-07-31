# Toggle Component

A modern, accessible toggle switch component that adapts to your theme's primary color.

## Features

✅ **Theme-Aware**: Uses `--primary-color` from your current theme  
✅ **Accessible**: Full keyboard navigation and screen reader support  
✅ **Smooth Animations**: Cubic-bezier transitions with reduced motion support  
✅ **Multiple Sizes**: Small, medium, and large variants  
✅ **TypeScript**: Fully typed interface  
✅ **Responsive**: Works on all devices  

## Usage

### Basic Toggle

```tsx
import { Toggle } from '../components/Toggle';

function MyComponent() {
  const [isEnabled, setIsEnabled] = useState(false);

  return (
    <Toggle
      checked={isEnabled}
      onChange={setIsEnabled}
      label="Enable notifications"
    />
  );
}
```

### Size Variants

```tsx
<Toggle size="small" label="Small toggle" />
<Toggle size="medium" label="Medium toggle" />
<Toggle size="large" label="Large toggle" />
```

### Controlled vs Uncontrolled

```tsx
// Controlled (recommended)
<Toggle
  checked={value}
  onChange={(checked) => setValue(checked)}
  label="Controlled toggle"
/>

// Uncontrolled (uses internal state)
<Toggle
  label="Uncontrolled toggle"
  onChange={(checked) => console.log('Changed:', checked)}
/>
```

### Disabled State

```tsx
<Toggle
  disabled={true}
  label="Disabled toggle"
  checked={true}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `checked` | `boolean` | `false` | Controlled checked state |
| `onChange` | `(checked: boolean) => void` | - | Callback when toggle changes |
| `disabled` | `boolean` | `false` | Disable the toggle |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Size variant |
| `label` | `string` | - | Label text |
| `id` | `string` | - | HTML id attribute |
| `className` | `string` | `''` | Additional CSS classes |

## Theming

The toggle automatically uses these CSS variables from your theme:

- `--primary-color`: Active toggle background
- `--primary-color-100`: Focus ring color
- `--card-text-color`: Label text color
- `--card-border-color`: Inactive toggle border/background
- `--muted-text-color`: Disabled state color

## Accessibility

- **Keyboard Navigation**: Space and Enter keys toggle the switch
- **Screen Readers**: Proper ARIA roles and labels
- **Focus Management**: Visible focus indicators
- **High Contrast**: Enhanced borders in high contrast mode
- **Reduced Motion**: Respects `prefers-reduced-motion` setting

## Examples in Different Themes

The toggle will automatically adapt to your current theme:

- **Ocean Theme**: Cyan active color (`#21B37A`)
- **Comfort Theme**: Green active color (`#16825D`)
- **Northern Lights**: Blue active color (`#38BDF8`)
- **Golden Hour**: Orange active color (`#F2994A`)

No additional configuration needed! 🎨✨ 