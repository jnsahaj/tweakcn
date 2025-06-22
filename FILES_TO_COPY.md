# Files to Copy from TweakCN Repository

## Directory Structure to Create in Your New App

```
your-nextjs-app/
├── app/
│   ├── examples/
│   │   └── dashboard/
│   │       ├── custom-theme-applier.tsx
│   │       ├── layout.tsx
│   │       └── page.tsx
│   ├── globals.css (update existing)
│   └── layout.tsx (update existing)
├── components/
│   ├── examples/
│   │   └── dashboard/
│   │       ├── components/
│   │       │   ├── app-sidebar.tsx
│   │       │   ├── chart-area-interactive.tsx
│   │       │   ├── chart-bar-mixed.tsx
│   │       │   ├── chart-pie-donut.tsx
│   │       │   ├── data-table.tsx
│   │       │   ├── nav-documents.tsx
│   │       │   ├── nav-main.tsx
│   │       │   ├── nav-secondary.tsx
│   │       │   ├── nav-user.tsx
│   │       │   ├── section-cards.tsx
│   │       │   └── site-header.tsx
│   │       ├── data.json
│   │       └── index.tsx
│   ├── ui/
│   │   ├── accordion.tsx
│   │   ├── alert-dialog.tsx
│   │   ├── alert.tsx
│   │   ├── aspect-ratio.tsx
│   │   ├── avatar.tsx
│   │   ├── badge.tsx
│   │   ├── breadcrumb.tsx
│   │   ├── button.tsx
│   │   ├── calendar.tsx
│   │   ├── card.tsx
│   │   ├── carousel.tsx
│   │   ├── chart.tsx
│   │   ├── checkbox.tsx
│   │   ├── collapsible.tsx
│   │   ├── command.tsx
│   │   ├── context-menu.tsx
│   │   ├── dialog.tsx
│   │   ├── drawer.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── form.tsx
│   │   ├── hover-card.tsx
│   │   ├── input-otp.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── menubar.tsx
│   │   ├── navigation-menu.tsx
│   │   ├── pagination.tsx
│   │   ├── popover.tsx
│   │   ├── progress.tsx
│   │   ├── radio-group.tsx
│   │   ├── resizable.tsx
│   │   ├── scroll-area.tsx
│   │   ├── select.tsx
│   │   ├── separator.tsx
│   │   ├── sheet.tsx
│   │   ├── sidebar.tsx
│   │   ├── skeleton.tsx
│   │   ├── slider.tsx
│   │   ├── sonner.tsx
│   │   ├── switch.tsx
│   │   ├── table.tsx
│   │   ├── tabs.tsx
│   │   ├── textarea.tsx
│   │   ├── toast.tsx
│   │   ├── toaster.tsx
│   │   ├── toggle-group.tsx
│   │   ├── toggle.tsx
│   │   ├── tooltip.tsx
│   │   └── use-toast.ts
│   └── theme-provider.tsx (create new - see guide)
├── hooks/
│   └── use-mobile.tsx (create new - see guide)
├── lib/
│   └── utils.ts (create new - see guide)
└── tailwind.config.ts (update existing)
```

## Exact Files to Copy from TweakCN

### 1. Dashboard Page Files
```
app/examples/dashboard/custom-theme-applier.tsx
app/examples/dashboard/layout.tsx
app/examples/dashboard/page.tsx
```

### 2. Dashboard Example Components
```
components/examples/dashboard/index.tsx
components/examples/dashboard/data.json
components/examples/dashboard/components/app-sidebar.tsx
components/examples/dashboard/components/chart-area-interactive.tsx
components/examples/dashboard/components/chart-bar-mixed.tsx
components/examples/dashboard/components/chart-pie-donut.tsx
components/examples/dashboard/components/data-table.tsx
components/examples/dashboard/components/nav-documents.tsx
components/examples/dashboard/components/nav-main.tsx
components/examples/dashboard/components/nav-secondary.tsx
components/examples/dashboard/components/nav-user.tsx
components/examples/dashboard/components/section-cards.tsx
components/examples/dashboard/components/site-header.tsx
```

### 3. UI Components (All files in components/ui/)
```
components/ui/accordion.tsx
components/ui/alert-dialog.tsx
components/ui/alert.tsx
components/ui/aspect-ratio.tsx
components/ui/avatar.tsx
components/ui/badge.tsx
components/ui/breadcrumb.tsx
components/ui/button.tsx
components/ui/calendar.tsx
components/ui/card.tsx
components/ui/carousel.tsx
components/ui/chart.tsx
components/ui/checkbox.tsx
components/ui/collapsible.tsx
components/ui/command.tsx
components/ui/context-menu.tsx
components/ui/dialog.tsx
components/ui/drawer.tsx
components/ui/dropdown-menu.tsx
components/ui/form.tsx
components/ui/hover-card.tsx
components/ui/input-otp.tsx
components/ui/input.tsx
components/ui/label.tsx
components/ui/menubar.tsx
components/ui/navigation-menu.tsx
components/ui/pagination.tsx
components/ui/popover.tsx
components/ui/progress.tsx
components/ui/radio-group.tsx
components/ui/resizable.tsx
components/ui/scroll-area.tsx
components/ui/select.tsx
components/ui/separator.tsx
components/ui/sheet.tsx
components/ui/sidebar.tsx
components/ui/skeleton.tsx
components/ui/slider.tsx
components/ui/sonner.tsx
components/ui/switch.tsx
components/ui/table.tsx
components/ui/tabs.tsx
components/ui/textarea.tsx
components/ui/toast.tsx
components/ui/toaster.tsx
components/ui/toggle-group.tsx
components/ui/toggle.tsx
components/ui/tooltip.tsx
components/ui/use-toast.ts
```

## Copy Commands (from TweakCN root)

If you're using the terminal to copy files, here are the commands:

```bash
# Create directories first
mkdir -p ../your-new-app/app/examples/dashboard
mkdir -p ../your-new-app/components/examples/dashboard/components
mkdir -p ../your-new-app/components/ui
mkdir -p ../your-new-app/hooks
mkdir -p ../your-new-app/lib

# Copy dashboard page files
cp app/examples/dashboard/custom-theme-applier.tsx ../your-new-app/app/examples/dashboard/
cp app/examples/dashboard/layout.tsx ../your-new-app/app/examples/dashboard/
cp app/examples/dashboard/page.tsx ../your-new-app/app/examples/dashboard/

# Copy dashboard example components
cp -r components/examples/dashboard/* ../your-new-app/components/examples/dashboard/

# Copy all UI components
cp -r components/ui/* ../your-new-app/components/ui/
```

## Important Notes

1. **Don't forget to update `components/ui/sidebar.tsx`** - Make sure it has `"use client"` at the top
2. **Create the files mentioned in the guide** - `theme-provider.tsx`, `use-mobile.tsx`, and `utils.ts` need to be created manually as shown in the guide
3. **Update configuration files** - `tailwind.config.ts`, `app/globals.css`, and `app/layout.tsx` need to be updated as shown in the guide
4. **Install all dependencies** - Use the npm/pnpm install command from the guide 