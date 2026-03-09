import { lazy, Suspense } from 'react';
import { HeroSection } from '../components/sections';
import { LazySection } from '../components/LazySection';

const PainPointsSection = lazy(() =>
  import('../components/sections').then((m) => ({ default: m.PainPointsSection }))
);
const AssistantIntroSection = lazy(() =>
  import('../components/sections').then((m) => ({ default: m.AssistantIntroSection }))
);
const AutomationChannelsSection = lazy(() =>
  import('../components/sections').then((m) => ({ default: m.AutomationChannelsSection }))
);
const WhatChangesSection = lazy(() =>
  import('../components/sections').then((m) => ({ default: m.WhatChangesSection }))
);
const ThreeStepsSection = lazy(() =>
  import('../components/sections').then((m) => ({ default: m.ThreeStepsSection }))
);
const WhyChooseSection = lazy(() =>
  import('../components/sections').then((m) => ({ default: m.WhyChooseSection }))
);
const TestimonialsSection = lazy(() =>
  import('../components/sections').then((m) => ({ default: m.TestimonialsSection }))
);
const FAQSection = lazy(() =>
  import('../components/sections').then((m) => ({ default: m.FAQSection }))
);
const CTASection = lazy(() =>
  import('../components/sections').then((m) => ({ default: m.CTASection }))
);

export function LandingPage() {
  return (
    <>
      <main>
        <HeroSection />
        <LazySection>
          <Suspense fallback={<div style={{ minHeight: '50vh' }} aria-hidden />}>
            <AutomationChannelsSection />
          </Suspense>
        </LazySection>
        <LazySection>
          <Suspense fallback={null}>
            <AssistantIntroSection />
          </Suspense>
        </LazySection>
        <LazySection>
          <Suspense fallback={null}>
            <WhatChangesSection />
          </Suspense>
        </LazySection>
        <LazySection>
          <Suspense fallback={null}>
            <PainPointsSection />
          </Suspense>
        </LazySection>
        <LazySection>
          <Suspense fallback={null}>
            <ThreeStepsSection />
          </Suspense>
        </LazySection>
        <LazySection>
          <Suspense fallback={null}>
            <WhyChooseSection />
          </Suspense>
        </LazySection>
        <LazySection>
          <Suspense fallback={null}>
            <TestimonialsSection />
          </Suspense>
        </LazySection>
        <LazySection>
          <Suspense fallback={null}>
            <FAQSection />
          </Suspense>
        </LazySection>
        <LazySection>
          <Suspense fallback={null}>
            <CTASection />
          </Suspense>
        </LazySection>
      </main>
    </>
  );
}
