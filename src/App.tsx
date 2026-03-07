import { lazy, Suspense } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HeroSection } from './components/sections';
import { LazySection } from './components/LazySection';
import { Toaster } from 'sileo';
import { useRecurrentPurchaseToasts } from './hooks/useRecurrentPurchaseToasts';
import { SalesAssistantWidget } from './components/SalesAssistantWidget';
import './App.css';

/* Below-fold sections: code-split and render only when scrolled into view */
const PainPointsSection = lazy(() =>
  import('./components/sections').then((m) => ({ default: m.PainPointsSection }))
);
const AssistantIntroSection = lazy(() =>
  import('./components/sections').then((m) => ({ default: m.AssistantIntroSection }))
);
const AutomationChannelsSection = lazy(() =>
  import('./components/sections').then((m) => ({ default: m.AutomationChannelsSection }))
);
const WhatChangesSection = lazy(() =>
  import('./components/sections').then((m) => ({ default: m.WhatChangesSection }))
);
const ThreeStepsSection = lazy(() =>
  import('./components/sections').then((m) => ({ default: m.ThreeStepsSection }))
);
const WhyChooseSection = lazy(() =>
  import('./components/sections').then((m) => ({ default: m.WhyChooseSection }))
);
const TestimonialsSection = lazy(() =>
  import('./components/sections').then((m) => ({ default: m.TestimonialsSection }))
);
const FAQSection = lazy(() =>
  import('./components/sections').then((m) => ({ default: m.FAQSection }))
);
const CTASection = lazy(() =>
  import('./components/sections').then((m) => ({ default: m.CTASection }))
);

function App() {
  useRecurrentPurchaseToasts();

  return (
    <>
      <Toaster
        position="bottom-left"
        offset={{ bottom: 18, left: 18 }}
        theme="system"
      />
      <Header />
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
      <Footer />
      <SalesAssistantWidget />
    </>
  );
}

export default App;
