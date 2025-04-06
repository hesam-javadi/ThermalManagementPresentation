# CPU Thermal Management Presentation

A modern, interactive presentation on CPU and GPU thermal management built with React, TypeScript, and styled-components. This presentation features retro-futuristic UI design with interactive 3D models, data visualizations, and smooth transitions.

![CPU Thermal Management Presentation](src/assets/preview.png)

## 🚀 Features

- **Interactive 3D Models** of CPUs and cooling components
- **Animated Transitions** between slides and sections
- **Responsive Design** that adapts to any screen size
- **Custom Cursor** with trail effect
- **Keyboard Navigation** for seamless presentation flow
- **Modular Architecture** for easy customization
- **Retro-Tech Aesthetic** with grid overlays and glowing effects

## 📋 Table of Contents

- [Installation](#installation)
- [Running the Presentation](#running-the-presentation)
- [Keyboard Controls](#keyboard-controls)
- [Customizing the Presentation](#customizing-the-presentation)
  - [Modifying Slides](#modifying-slides)
  - [Changing Visual Assets](#changing-visual-assets)
  - [Styling Changes](#styling-changes)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## 🔧 Installation

To run this presentation locally, follow these steps:

```bash
# Clone the repository
git clone https://github.com/hesam-javadi/ThermalManagementPresentation.git

# Navigate to the project directory
cd cpu-thermal-presentation

# Install dependencies
npm install

# Start the development server
npm run dev
```

## 🎮 Running the Presentation

After starting the development server, open your browser and navigate to `http://localhost:3000` to view the presentation.

## ⌨️ Keyboard Controls

The presentation supports the following keyboard controls:

- **Space / Right Arrow**: Navigate to the next section or slide
- **Backspace / Left Arrow**: Navigate to the previous section or slide
- **Tab**: Toggle between section navigation and slide navigation modes
- **Mouse Wheel**: Scroll through sections

## 🎨 Customizing the Presentation

### Modifying Slides

Each slide is a separate React component in the `src/slides` directory. To modify a slide:

1. Open the corresponding file (e.g., `Introduction.tsx`, `HeatImpact.tsx`)
2. Update the content in the `sections` array
3. Modify the title, text, or list items as needed

Example of modifying a slide section:

```tsx
{
  id: 1,
  title: "Your Section Title",
  content: (
    <SectionContent>
      <SectionTitle>Your Custom Title</SectionTitle>
      <SectionText>
        Your custom text goes here. Describe your topic in detail.
      </SectionText>
      
      <RelatedItemsList>
        <ListTitle>Key Points</ListTitle>
        <ListItem>
          <ListItemTitle>First Point</ListItemTitle>
          <ListItemText>Description of your first point.</ListItemText>
        </ListItem>
        <!-- Add more list items as needed -->
      </RelatedItemsList>
    </SectionContent>
  )
}
```

### Adding or Removing Slides

To add a new slide:

1. Create a new file in the `src/slides` directory (e.g., `YourNewSlide.tsx`)
2. Copy the structure from an existing slide like `ThermalManagement.tsx`
3. Customize the content for your needs
4. Import and add your slide to the `slides` array in `App.tsx`:

```tsx
import YourNewSlide from './slides/YourNewSlide';

// In the App component:
const slides = [
  // Existing slides...
  <YourNewSlide key="your-new-slide" />,
];

// Update totalSlides value to match the total number of slides
const totalSlides = 7; // If adding a 7th slide
```

To remove a slide:

1. Remove the slide component from the `slides` array in `App.tsx`
2. Update the `totalSlides` value accordingly

### Changing Visual Assets

The presentation uses various visual assets:

1. **3D Models**: Modify or replace components in `src/components/`
2. **Images**: Replace images in the `src/assets/` directory
3. **Icons**: Update icon components directly in the files

For the ThermalManagement slide, you can replace the images by changing the import paths:

```tsx
// In ThermalManagement.tsx
import yourNewImage from '../assets/your-new-image.png';

// Then update the visualContent:
visualContent: <SectionImage src={yourNewImage} alt="Your Image Description" />
```

### Styling Changes

To modify the visual style:

1. Global styles are defined in `src/styles/GlobalStyles.ts`
2. Component-specific styles use styled-components within each file
3. Main color scheme variables:
   - Primary color: `--primary` (currently cyan)
   - Background: Dark gradient
   - Text colors: Various white/gray shades

Example of changing the primary color:

```css
/* In GlobalStyles.ts */
:root {
  --primary: #ff00ff; /* Change to your preferred color (e.g., magenta) */
  --gradient-1: linear-gradient(to right, #ff00ff, #aa00ff);
}
```

## 📁 Project Structure

```
cpu-thermal-presentation/
├── public/                  # Static assets
├── src/                     # Source code
│   ├── assets/              # Images and other assets
│   ├── components/          # Reusable components
│   │   ├── BackgroundEffect.tsx      # 3D background
│   │   ├── CircuitThermalVisualization.tsx  # 3D model
│   │   ├── Controls.tsx              # Navigation controls
│   │   ├── GridForeground.tsx        # Grid overlay
│   │   ├── IntelCpuWithWindEffect.tsx # CPU visualization
│   │   └── Slide.tsx                 # Slide wrapper
│   ├── context/             # React context providers
│   │   └── NavigationContext.tsx     # Navigation state
│   ├── slides/              # Individual presentation slides
│   │   ├── Conclusion.tsx           # Conclusion slide
│   │   ├── HeatImpact.tsx           # Heat Impact slide
│   │   ├── Introduction.tsx         # Introduction slide
│   │   ├── TheEnd.tsx               # Final slide
│   │   ├── ThermalManagement.tsx    # Thermal solutions slide
│   │   └── ThermalTechnologies.tsx  # Technologies slide
│   ├── styles/              # Global styles
│   │   └── GlobalStyles.ts          # CSS variables and global styles
│   ├── App.tsx              # Main application component
│   └── main.tsx             # Entry point
├── tsconfig.json            # TypeScript configuration
├── package.json             # Dependencies and scripts
└── README.md                # This file
```

## 🤝 Contributing

Contributions are welcome! Feel free to submit pull requests or open issues to improve the presentation.

---

Created with ❤️ for CPU thermal management education. Feel free to use, modify, and share with proper attribution.
