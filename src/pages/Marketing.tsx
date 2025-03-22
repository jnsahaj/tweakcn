"use client"

import logo from "@/assets/logo.png"
import og from "@/assets/og-image.png"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from "framer-motion"
import {
    ArrowRight,
    BarChart,
    Check,
    ChevronRight,
    Eye,
    FileCode,
    Layers,
    Menu,
    Moon,
    Paintbrush,
    Palette,
    Repeat,
    Sliders,
    Smartphone,
    Sun,
    Users,
    Wand2,
    X,
} from "lucide-react"
import { useCallback, useEffect, useMemo, useState } from "react"
import { useTheme } from "../components/theme-provider"
import { getPresetThemeStyles, presets } from "../utils/theme-presets"
import { useEditorStore } from "@/store/editorStore"
const ColorBox = ({ color }: { color: string }) => {
    return (
        <div
            className="w-3 h-3 rounded-sm border-muted"
            style={{ backgroundColor: color }}
        />
    );
};
export default function LandingPage() {
    const [isScrolled, setIsScrolled] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const { theme, toggleTheme } = useTheme();
    const [mounted, setMounted] = useState(false)
    const [styles, setStyles] = useState({});
    const { themeState, applyThemePreset } = useEditorStore();
    const mode = themeState.currentMode;
    const presetNames = useMemo(() => ["default", ...Object.keys(presets)], [presets]);
    const value = presetNames?.find((name) => name === mode);
    const randomize = useCallback(() => {
        const random = Math.floor(Math.random() * presetNames.length);
        applyThemePreset(presetNames[random]);
    }, [applyThemePreset, presetNames]);


    useEffect(() => {
        setMounted(true)
        const handleScroll = () => {
            if (window.scrollY > 10) {
                setIsScrolled(true)
            } else {
                setIsScrolled(false)
            }
        }

        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    }

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 },
    }

    const features = [
        {
            title: "Visual Theme Customizer",
            description: "Customize your shadcn/ui components with a real-time preview to see changes instantly.",
            icon: <Palette className="size-5" />,
        },
        {
            title: "Button Customization",
            description: "Full control over button styles including colors, dimensions, typography, and effects.",
            icon: <Sliders className="size-5" />,
        },
        {
            title: "Color Control",
            description: "Customize background, text, and border colors with an intuitive color picker interface.",
            icon: <Paintbrush className="size-5" />,
        },
        {
            title: "Dimension Control",
            description: "Adjust padding, border radius, and other dimensions to match your design system.",
            icon: <Layers className="size-5" />,
        },
        {
            title: "Typography Settings",
            description: "Fine-tune font size, weight, and text transform to create the perfect look.",
            icon: <FileCode className="size-5" />,
        },
        {
            title: "State Management",
            description: "Preview and customize hover, focus, and active states for interactive components.",
            icon: <Eye className="size-5" />,
        },
    ]

    const handleStyleChange = (newStyles) => {
        setStyles(newStyles);
    };

    return (
        <div className="flex min-h-[100dvh] justify-items-center items-center flex-col bg-background text-foreground" style={styles}>
            <header
                className={`sticky top-0 z-50 w-full backdrop-blur-lg transition-all duration-300 ${isScrolled ? "bg-background/80 shadow-sm" : "bg-transparent"}`}
            >
                <div className="container flex h-16 px-4 min-w-full items-center justify-between">
                    <div className="flex items-center gap-2 font-bold">
                        <img src={logo} alt="tweakcn" className="h-8 w-8 mr-1 md:mr-2" title="Nothing here yet..." />
                        <span>tweakcn</span>
                    </div>
                    <nav className="hidden md:flex gap-8">
                        <a
                            href="#features"
                            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                        >
                            Features
                        </a>
                        <a
                            href="#how-it-works"
                            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                        >
                            How It Works
                        </a>
                        <a
                            href="#examples"
                            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                        >
                            Examples
                        </a>
                        <a
                            href="#roadmap"
                            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                        >
                            Roadmap
                        </a>
                        <a
                            href="#faq"
                            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                        >
                            FAQ
                        </a>
                    </nav>
                    <div className="hidden md:flex gap-4 items-center">
                        <Button variant="secondary" size="icon" onClick={toggleTheme}>
                            {theme === "light" ? (
                                <Sun className="h-6 w-6" />
                            ) : (
                                <Moon className="h-6 w-6" />
                            )}
                        </Button>
                        <Button className="rounded-full">
                            Try It Now
                            <ChevronRight className="ml-1 size-4" />
                        </Button>
                    </div>
                    <div className="flex items-center gap-4 md:hidden">
                        <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full">
                            {mounted && theme === "dark" ? <Sun className="size-[18px]" /> : <Moon className="size-[18px]" />}
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                            {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
                            <span className="sr-only">Toggle menu</span>
                        </Button>
                    </div>
                </div>
                {/* Mobile menu */}
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="md:hidden absolute top-16 inset-x-0 bg-background/95 backdrop-blur-lg border-b"
                    >
                        <div className="container py-4 flex flex-col gap-4">
                            <a href="#features" className="py-2 text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
                                Features
                            </a>
                            <a href="#how-it-works" className="py-2 text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
                                How It Works
                            </a>
                            <a href="#examples" className="py-2 text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
                                Examples
                            </a>
                            <a href="#roadmap" className="py-2 text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
                                Roadmap
                            </a>
                            <a href="#faq" className="py-2 text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
                                FAQ
                            </a>
                            <div className="flex flex-col gap-2 pt-2 border-t">
                                <Button className="rounded-full">
                                    Try It Now
                                    <ChevronRight className="ml-1 size-4" />
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </header>
            <main className="flex-1">
                {/* Hero Section */}
                <section className="w-full py-20 md:py-32 lg:py-40 overflow-hidden">
                    <div className="container px-4 md:px-6 relative">
                        <div className="absolute inset-0 -z-10 h-full w-full bg-background"></div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="text-center max-w-3xl mx-auto mb-12"
                        >
                            <Badge className="mb-4 rounded-full px-4 py-1.5 text-sm font-medium" variant="secondary">
                                Currently in Beta
                            </Badge>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                                Make Your shadcn/ui Components Stand Out
                            </h1>
                            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                                A powerful visual theme editor for shadcn/ui components with Tailwind CSS support. Customize your
                                components visually and export the code instantly.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Button size="lg" className="rounded-full h-12 px-8">
                                    Try It Now
                                    <ArrowRight className="ml-2 size-4" />
                                </Button>
                                <Button size="lg" variant="outline" className="rounded-full h-12 px-8">
                                    View Examples
                                </Button>
                            </div>
                            <div className="flex items-center justify-center gap-4 mt-6 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                    <Check className="size-4 text-primary" />
                                    <span>No login required</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Check className="size-4 text-primary" />
                                    <span>Free to use</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Check className="size-4 text-primary" />
                                    <span>Open source</span>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.2 }}
                            className="relative mx-auto max-w-5xl"
                        >
                            <div className="rounded-xl overflow-hidden shadow-2xl border border-border/40 bg-gradient-to-b from-background to-muted/20">
                                <img
                                    src={og}
                                    alt="tweakcn interface showing button customization"
                                    className="w-full h-auto"
                                />
                                <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-black/10"></div>
                            </div>
                            <div className="absolute -bottom-6 -right-6 -z-10 h-[300px] w-[300px] rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 blur-3xl opacity-70"></div>
                            <div className="absolute -top-6 -left-6 -z-10 h-[300px] w-[300px] rounded-full bg-gradient-to-br from-secondary/30 to-primary/30 blur-3xl opacity-70"></div>
                        </motion.div>
                    </div>
                </section>

                {/* Theme Preset Selector Section */}
                <section id="theme-selector" className="w-full py-20 md:py-32">
                    <div className="container px-4 md:px-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            className="flex flex-col items-center justify-center space-y-4 text-center mb-12"
                        >
                            <Badge className="rounded-full px-4 py-1.5 text-sm font-medium" variant="secondary">
                                Theme Presets
                            </Badge>
                            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Preview and Select a Theme</h2>
                            <p className="max-w-[800px] text-muted-foreground md:text-lg">
                                Click on a theme below to preview how it transforms the page.
                            </p>
                        </motion.div>

                        {/* Theme Selector Buttons */}
                        <div className="flex flex-wrap justify-center gap-4 mt-8">
                            {presetNames.map((presetName) => {
                                const themeStyles = getPresetThemeStyles(presetName)[mode === 'dark' ? 'dark' : 'light'];
                                const isSelected = presetName === themeState.preset;
                                console.log(presetName)
                                console.log(themeState)
                                console.log(isSelected)
                                return (
                                    <Button
                                        key={presetName}
                                        className={`flex items-center relative border transition-all`}
                                        variant="outline"
                                        style={{
                                            backgroundColor: themeStyles.background,
                                            color: themeStyles.foreground,
                                            borderColor: themeStyles.border,
                                        }}
                                        onClick={() => applyThemePreset(presetName)}
                                    >
                                        <div className="flex gap-0.5 mr-2">
                                            <ColorBox color={themeStyles.primary} />
                                            <ColorBox color={themeStyles.accent} />
                                            <ColorBox color={themeStyles.secondary} />
                                            <ColorBox color={themeStyles.muted} />
                                        </div>
                                        <span className="capitalize">
                                            {presetName.replace(/-/g, " ")}
                                        </span>
                                        {isSelected && (
                                            <span className=" right-2 text-xs">
                                                <Check className="h-10 w-10" />
                                            </span>
                                        )}
                                    </Button>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="w-full py-20 md:py-32">
                    <div className="container px-4 md:px-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            className="flex flex-col items-center justify-center space-y-4 text-center mb-12"
                        >
                            <Badge className="rounded-full px-4 py-1.5 text-sm font-medium" variant="secondary">
                                Features
                            </Badge>
                            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Powerful Customization Tools</h2>
                            <p className="max-w-[800px] text-muted-foreground md:text-lg">
                                tweakcn provides all the tools you need to customize your shadcn/ui components and make them unique.
                            </p>
                        </motion.div>

                        <motion.div
                            variants={container}
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true }}
                            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
                        >
                            {features.map((feature, i) => (
                                <motion.div key={i} variants={item}>
                                    <Card className="h-full overflow-hidden border-border/40 bg-gradient-to-b from-background to-muted/10 backdrop-blur transition-all hover:shadow-md">
                                        <CardContent className="p-6 flex flex-col h-full">
                                            <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                                                {feature.icon}
                                            </div>
                                            <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                                            <p className="text-muted-foreground">{feature.description}</p>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </section>

                {/* How It Works Section */}
                <section id="how-it-works" className="w-full py-20 md:py-32 bg-muted/30 relative overflow-hidden">
                    <div className="absolute inset-0 -z-10 h-full w-full bg-background"></div>

                    <div className="container px-4 md:px-6 relative">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            className="flex flex-col items-center justify-center space-y-4 text-center mb-16"
                        >
                            <Badge className="rounded-full px-4 py-1.5 text-sm font-medium" variant="secondary">
                                How It Works
                            </Badge>
                            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Simple Process, Beautiful Results</h2>
                            <p className="max-w-[800px] text-muted-foreground md:text-lg">
                                Customize your shadcn/ui components in just a few simple steps.
                            </p>
                        </motion.div>

                        <div className="grid md:grid-cols-3 gap-8 md:gap-12 relative">

                            {[
                                {
                                    step: "01",
                                    title: "Select Component",
                                    description: "Choose the shadcn/ui component you want to customize from our growing library.",
                                },
                                {
                                    step: "02",
                                    title: "Customize Visually",
                                    description: "Use our intuitive interface to adjust colors, dimensions, typography, and effects.",
                                },
                                {
                                    step: "03",
                                    title: "Export Code",
                                    description: "Copy the generated React component or Tailwind CSS code directly into your project.",
                                },
                            ].map((step, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: i * 0.1 }}
                                    className="relative z-10 flex flex-col items-center text-center space-y-4"
                                >
                                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/70 text-primary-foreground text-xl font-bold shadow-lg">
                                        {step.step}
                                    </div>
                                    <h3 className="text-xl font-bold">{step.title}</h3>
                                    <p className="text-muted-foreground">{step.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Roadmap Section */}
                <section id="roadmap" className="w-full py-20 md:py-32 bg-muted/30 relative overflow-hidden">
                    <div className="absolute inset-0 -z-10 h-full w-full bg-background/20 "></div>

                    <div className="container px-4 md:px-6 relative">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            className="flex flex-col items-center justify-center space-y-4 text-center mb-16"
                        >
                            <Badge className="rounded-full px-4 py-1.5 text-sm font-medium" variant="secondary">
                                Roadmap
                            </Badge>
                            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">What's Coming Next</h2>
                            <p className="max-w-[800px] text-muted-foreground md:text-lg">
                                We're constantly working to improve tweakcn and add new features. Here's what's on our roadmap.
                            </p>
                        </motion.div>

                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {[
                                {
                                    title: "Global Theme Editor",
                                    description: "Create and manage complete themes with presets for your entire application.",
                                    status: "In Progress",
                                    icon: <Palette className="size-5" />,
                                },
                                {
                                    title: "More Components",
                                    description: "Support for Input, Select, and other shadcn/ui components.",
                                    status: "Coming Soon",
                                    icon: <Layers className="size-5" />,
                                },
                                {
                                    title: "Theme Import/Export",
                                    description: "Save and share your custom themes with others.",
                                    status: "Planned",
                                    icon: <Repeat className="size-5" />,
                                },
                                {
                                    title: "Responsive Preview",
                                    description: "Preview your components across different device sizes.",
                                    status: "Planned",
                                    icon: <Smartphone className="size-5" />,
                                },
                                {
                                    title: "Collaboration Features",
                                    description: "Work together with your team on theme customization.",
                                    status: "Future",
                                    icon: <Users className="size-5" />,
                                },
                                {
                                    title: "Theme Analytics",
                                    description: "Get insights into how your themes perform across devices and browsers.",
                                    status: "Future",
                                    icon: <BarChart className="size-5" />,
                                },
                            ].map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: i * 0.1 }}
                                >
                                    <Card className="h-full overflow-hidden border-border/40 bg-gradient-to-b from-background to-muted/10 backdrop-blur transition-all hover:shadow-md">
                                        <CardContent className="p-6 flex flex-col h-full">
                                            <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                                                {item.icon}
                                            </div>
                                            <div className="flex justify-between items-center mb-2">
                                                <h3 className="text-xl font-bold">{item.title}</h3>
                                                <Badge
                                                    variant={
                                                        item.status === "In Progress"
                                                            ? "default"
                                                            : item.status === "Coming Soon"
                                                                ? "secondary"
                                                                : "outline"
                                                    }
                                                >
                                                    {item.status}
                                                </Badge>
                                            </div>
                                            <p className="text-muted-foreground">{item.description}</p>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section id="faq" className="w-full py-20 md:py-32">
                    <div className="container px-4 md:px-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            className="flex flex-col items-center justify-center space-y-4 text-center mb-12"
                        >
                            <Badge className="rounded-full px-4 py-1.5 text-sm font-medium" variant="secondary">
                                FAQ
                            </Badge>
                            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Frequently Asked Questions</h2>
                            <p className="max-w-[800px] text-muted-foreground md:text-lg">
                                Find answers to common questions about tweakcn.
                            </p>
                        </motion.div>

                        <div className="mx-auto max-w-3xl">
                            <Accordion type="single" collapsible className="w-full">
                                {[
                                    {
                                        question: "What is tweakcn?",
                                        answer:
                                            "tweakcn is a visual theme editor for shadcn/ui components with Tailwind CSS support. It helps you customize your components to make them stand out, without having to write complex CSS or Tailwind classes manually.",
                                    },
                                    {
                                        question: "Is tweakcn free to use?",
                                        answer:
                                            "Yes, tweakcn is completely free to use during the beta period. We may introduce premium features in the future, but the core functionality will always remain free.",
                                    },
                                    {
                                        question: "Do I need to know Tailwind CSS to use tweakcn?",
                                        answer:
                                            "No, you don't need to know Tailwind CSS to use tweakcn. Our visual editor makes it easy to customize components without writing any code. However, having some knowledge of Tailwind CSS will help you understand the generated code better.",
                                    },
                                    {
                                        question: "Which components are currently supported?",
                                        answer:
                                            "Currently, tweakcn supports the Button component from shadcn/ui. We're actively working on adding support for more components like Input, Select, and others in future updates.",
                                    },
                                    {
                                        question: "Can I use tweakcn with my existing shadcn/ui project?",
                                        answer:
                                            "Yes, tweakcn is designed to work with existing shadcn/ui projects. You can customize components and export the code to integrate with your project seamlessly.",
                                    },
                                    {
                                        question: "Is tweakcn open source?",
                                        answer:
                                            "Yes, tweakcn is open source. You can find the source code on GitHub and contribute to the project if you'd like to help improve it.",
                                    },
                                ].map((faq, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 10 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.3, delay: i * 0.05 }}
                                    >
                                        <AccordionItem value={`item-${i}`} className="border-b border-border/40 py-2">
                                            <AccordionTrigger className="text-left font-medium hover:no-underline">
                                                {faq.question}
                                            </AccordionTrigger>
                                            <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
                                        </AccordionItem>
                                    </motion.div>
                                ))}
                            </Accordion>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="w-full py-20 md:py-32 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground relative overflow-hidden">
                    <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
                    <div className="absolute -top-24 -left-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>

                    <div className="container px-4 md:px-6 relative">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="flex flex-col items-center justify-center space-y-6 text-center"
                        >
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
                                Ready to Make Your Components Stand Out?
                            </h2>
                            <p className="mx-auto max-w-[700px] text-primary-foreground/80 md:text-xl">
                                Start customizing your shadcn/ui components today and create a unique look for your application.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 mt-4">
                                <Button size="lg" variant="secondary" className="rounded-full h-12 px-8 text-base">
                                    Try It Now
                                    <ArrowRight className="ml-2 size-4" />
                                </Button>
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="rounded-full h-12 px-8 text-base bg-transparent border-white text-white hover:bg-white/10"
                                >
                                    View on GitHub
                                </Button>
                            </div>
                            <p className="text-sm text-primary-foreground/80 mt-4">No login required. Free to use. Open source.</p>
                        </motion.div>
                    </div>
                </section>
            </main>
            <footer className="w-full border-t bg-background/95 backdrop-blur-sm">
                <div className="container flex flex-col gap-8 px-4 py-10 md:px-6 lg:py-16 min-w-full">
                    <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 font-bold">
                                <img src={logo} alt="tweakcn" className="h-8 w-8 mr-1 md:mr-2" title="Nothing here yet..." />
                                <span>tweakcn</span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                A powerful visual theme editor for shadcn/ui components with Tailwind CSS support. Make your components
                                stand out.
                            </p>
                            <div className="flex gap-4">
                                <a href="https://github.com/jnsahaj/tweakcn" className="text-muted-foreground hover:text-foreground transition-colors">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="size-5"
                                    >
                                        <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
                                        <path d="M9 18c-4.51 2-5-2-7-2"></path>
                                    </svg>
                                    <span className="sr-only">GitHub</span>
                                </a>
                                <a href="https://x.com/iamsahaj_xyz" className="text-muted-foreground hover:text-foreground transition-colors">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="size-5"
                                    >
                                        <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                                    </svg>
                                    <span className="sr-only">Twitter</span>
                                </a>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <h4 className="text-sm font-bold">Product</h4>
                            <ul className="space-y-2 text-sm">
                                <li>
                                    <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
                                        Features
                                    </a>
                                </li>
                                <li>
                                    <a href="#examples" className="text-muted-foreground hover:text-foreground transition-colors">
                                        Examples
                                    </a>
                                </li>
                                <li>
                                    <a href="#roadmap" className="text-muted-foreground hover:text-foreground transition-colors">
                                        Roadmap
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div className="space-y-4">
                            <h4 className="text-sm font-bold">Resources</h4>
                            <ul className="space-y-2 text-sm">
                                <li>
                                    <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                                        Documentation
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                                        GitHub
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                                        Discord
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div className="space-y-4">
                            <h4 className="text-sm font-bold">About</h4>
                            <ul className="space-y-2 text-sm">
                                <li>
                                    <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                                        Team
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                                        Contact
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                                        Privacy Policy
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="flex flex-col gap-4 sm:flex-row justify-between items-center border-t border-border/40 pt-8">
                        <p className="text-xs text-muted-foreground">
                            &copy; {new Date().getFullYear()} tweakcn. All rights reserved.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                                Privacy Policy
                            </a>
                            <a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                                Terms of Service
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}

