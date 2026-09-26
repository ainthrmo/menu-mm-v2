import { Hero10, type Hero10Props } from '@/components/ui/hero-10'

const values = {
  title: 'Build faster interfaces',
  titleLine2Prefix: 'with',
  titleHighlight: 'Ready-Made Blocks',
  description:
    'Compose beautiful products from accessible, production-ready UI blocks that drop straight into your codebase.',
  socialProof: 'Trusted by 2k+ product teams',
  images: [
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80',
  ],
  imageAlts: ['Restaurant dining experience', 'Atmospheric cafe table', 'Artisan gourmet food'],
  animation: 'subtle',
  primaryCTA: {
    ctaEnabled: true,
    text: 'Get Started',
    link: '/auth/sign-up',
    variant: 'default',
    size: 'default',
  },
  secondaryCTA: {
    ctaEnabled: true,
    text: 'How it works',
    link: '#solution',
    variant: 'outline',
    size: 'default',
  },
} satisfies Hero10Props

export default function Hero10Example() {
  return <Hero10 {...values} />
}
