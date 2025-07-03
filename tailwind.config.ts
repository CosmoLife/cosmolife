import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// 2025 Advanced Color Palette
				holo: {
					primary: 'hsl(var(--holo-primary))',
					secondary: 'hsl(var(--holo-secondary))',
					accent: 'hsl(var(--holo-accent))',
					chrome: 'hsl(var(--holo-chrome))'
				},
				cyber: {
					electric: 'hsl(var(--cyber-electric))',
					magenta: 'hsl(var(--cyber-magenta))',
					lime: 'hsl(var(--cyber-lime))',
					orange: 'hsl(var(--cyber-orange))',
					purple: 'hsl(var(--cyber-purple))'
				},
				neuro: {
					light: 'hsl(var(--neuro-light))',
					dark: 'hsl(var(--neuro-dark))',
					highlight: 'hsl(var(--neuro-highlight))',
					shadow: 'hsl(var(--neuro-shadow))'
				},
				quantum: {
					flux: 'hsl(var(--quantum-flux))',
					particle: 'hsl(var(--quantum-particle))',
					wave: 'hsl(var(--quantum-wave))'
				},
				magnetic: {
					core: 'hsl(var(--magnetic-core))',
					field: 'hsl(var(--magnetic-field))',
					pulse: 'hsl(var(--magnetic-pulse))'
				},
				// Legacy Cosmo Life brand colors
				cosmo: {
					blue: '#00D4FF',
					purple: '#8B5CF6',
					green: '#10B981',
					'dark-blue': '#1E293B',
					'neon-blue': '#00F5FF',
					'neon-purple': '#A855F7',
					'neon-green': '#22D3EE'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				// Legacy animations
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				'neon-pulse': {
					'0%, 100%': { boxShadow: '0 0 5px currentColor, 0 0 10px currentColor, 0 0 15px currentColor' },
					'50%': { boxShadow: '0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor' }
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0px)' },
					'50%': { transform: 'translateY(-20px)' }
				},
				'glow': {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0.8' }
				},
				
				// 2025 Advanced Animations
				'holo-shift': {
					'0%': { backgroundPosition: '0% 50%' },
					'50%': { backgroundPosition: '100% 50%' },
					'100%': { backgroundPosition: '0% 50%' }
				},
				'cyber-pulse': {
					'0%, 100%': { 
						textShadow: '0 0 5px currentColor, 0 0 10px currentColor, 0 0 15px currentColor',
						transform: 'scale(1)'
					},
					'50%': { 
						textShadow: '0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor, 0 0 40px currentColor',
						transform: 'scale(1.02)'
					}
				},
				'quantum-shift': {
					'0%': { transform: 'scale(1) rotate(0deg)', opacity: '0.03' },
					'33%': { transform: 'scale(1.1) rotate(120deg)', opacity: '0.05' },
					'66%': { transform: 'scale(0.9) rotate(240deg)', opacity: '0.02' },
					'100%': { transform: 'scale(1) rotate(360deg)', opacity: '0.03' }
				},
				'quantum-rotate': {
					'0%': { transform: 'rotate(0deg)' },
					'100%': { transform: 'rotate(360deg)' }
				},
				'magnetic-pulse': {
					'0%': { transform: 'translate(-50%, -50%) scale(0)', opacity: '1' },
					'100%': { transform: 'translate(-50%, -50%) scale(1)', opacity: '0' }
				},
				'grid-move': {
					'0%': { transform: 'translate(0, 0)' },
					'100%': { transform: 'translate(50px, 50px)' }
				},
				'holographic-spin': {
					'0%': { 
						transform: 'rotateY(0deg) rotateX(0deg)',
						filter: 'hue-rotate(0deg)'
					},
					'25%': { 
						transform: 'rotateY(90deg) rotateX(10deg)',
						filter: 'hue-rotate(90deg)'
					},
					'50%': { 
						transform: 'rotateY(180deg) rotateX(0deg)',
						filter: 'hue-rotate(180deg)'
					},
					'75%': { 
						transform: 'rotateY(270deg) rotateX(-10deg)',
						filter: 'hue-rotate(270deg)'
					},
					'100%': { 
						transform: 'rotateY(360deg) rotateX(0deg)',
						filter: 'hue-rotate(360deg)'
					}
				},
				'neural-glow': {
					'0%, 100%': { 
						boxShadow: '0 0 20px hsl(280 100% 70% / 0.3)',
						transform: 'scale(1)'
					},
					'50%': { 
						boxShadow: '0 0 40px hsl(180 100% 50% / 0.6), 0 0 60px hsl(300 100% 60% / 0.3)',
						transform: 'scale(1.05)'
					}
				},
				'energy-flow': {
					'0%': { 
						backgroundPosition: '0% 50%',
						transform: 'scale(1) rotate(0deg)'
					},
					'50%': { 
						backgroundPosition: '100% 50%',
						transform: 'scale(1.1) rotate(180deg)'
					},
					'100%': { 
						backgroundPosition: '0% 50%',
						transform: 'scale(1) rotate(360deg)'
					}
				}
			},
			animation: {
				// Legacy animations
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'neon-pulse': 'neon-pulse 2s ease-in-out infinite',
				'float': 'float 6s ease-in-out infinite',
				'glow': 'glow 2s ease-in-out infinite',
				
				// 2025 Advanced Animations
				'holo-shift': 'holo-shift 3s ease-in-out infinite',
				'cyber-pulse': 'cyber-pulse 2s ease-in-out infinite',
				'quantum-shift': 'quantum-shift 20s ease-in-out infinite',
				'quantum-rotate': 'quantum-rotate 8s linear infinite',
				'magnetic-pulse': 'magnetic-pulse 1s ease-out',
				'grid-move': 'grid-move 20s linear infinite',
				'holographic-spin': 'holographic-spin 10s ease-in-out infinite',
				'neural-glow': 'neural-glow 3s ease-in-out infinite',
				'energy-flow': 'energy-flow 4s ease-in-out infinite'
			},
			backgroundImage: {
				'cosmo-gradient': 'linear-gradient(135deg, #1E293B 0%, #3B82F6 50%, #8B5CF6 100%)',
				'neon-gradient': 'linear-gradient(90deg, #00D4FF 0%, #8B5CF6 50%, #10B981 100%)',
				'holo-gradient': 'var(--gradient-holographic)',
				'cyber-gradient': 'var(--gradient-cyber)',
				'quantum-gradient': 'var(--gradient-quantum)',
				'magnetic-gradient': 'var(--gradient-magnetic)'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;