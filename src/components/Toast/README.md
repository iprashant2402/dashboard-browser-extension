# Toast Notification Component

A flexible toast notification component with support for different types, auto-dismiss, and custom icons.

## Features

- **Multiple Types**: Success, Warning, Error
- **Auto-dismiss**: Configurable duration with visual progress bar
- **Custom Icons**: Support for custom icons or default type-based icons
- **Responsive**: Works on mobile and desktop
- **Accessible**: Proper ARIA labels and keyboard support
- **Smooth Animations**: Slide-in/out animations with fade effects

## Usage

### Basic Setup

First, add the ToastContainer to your app root:

```tsx
import { ToastContainer } from './components/Toast';

function App() {
  return (
    <div>
      {/* Your app content */}
      <ToastContainer />
    </div>
  );
}
```

### Using the useToast Hook

```tsx
import { useToast } from './components/Toast';

function MyComponent() {
  const { showToast } = useToast();

  const handleSuccess = () => {
    showToast({
      type: 'success',
      message: 'Operation completed successfully!',
      duration: 3000
    });
  };

  const handleWarning = () => {
    showToast({
      type: 'warning',
      message: 'Please check your input before proceeding.',
      duration: 5000
    });
  };

  const handleError = () => {
    showToast({
      type: 'error',
      message: 'Something went wrong. Please try again.',
      duration: 7000
    });
  };

  const handleCustomIcon = () => {
    showToast({
      type: 'success',
      message: 'Custom icon notification!',
      icon: <CustomIcon />,
      duration: 4000
    });
  };

  return (
    <div>
      <button onClick={handleSuccess}>Show Success</button>
      <button onClick={handleWarning}>Show Warning</button>
      <button onClick={handleError}>Show Error</button>
      <button onClick={handleCustomIcon}>Show Custom Icon</button>
    </div>
  );
}
```

## API Reference

### Toast Types

- `'success'` - Green color with checkmark icon
- `'warning'` - Orange color with warning icon  
- `'error'` - Red color with error icon

### showToast Parameters

- `type: ToastType` - The type of toast (success/warning/error)
- `message: string` - The message to display
- `icon?: React.ReactNode` - Optional custom icon (overrides default type icon)
- `duration?: number` - Duration in milliseconds (default: 5000ms)

### Features

- **Auto-dismiss**: Toasts automatically disappear after the specified duration
- **Manual dismiss**: Users can click the X button to dismiss early
- **Progress bar**: Visual indicator showing time remaining
- **Stacking**: Multiple toasts stack vertically
- **Responsive**: Adapts to mobile screens
- **Smooth animations**: Slide in from right, fade out when dismissed 