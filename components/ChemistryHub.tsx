'use client';

import { useEffect, useState } from 'react';
import CompatibilityExperience from '@/components/CompatibilityExperience';
import MiniChemistryExperience from '@/components/MiniChemistryExperience';
import ParticipationSelector, { ParticipationMode } from '@/components/ParticipationSelector';
import TestSelector from '@/components/TestSelector';
import { InvitePayload, parseInviteToken } from '@/lib/invite-link';
import { CHEMISTRY_TESTS, ChemistryTestType } from '@/lib/mini-tests';

export default function ChemistryHub() {
  const [selectedTest, setSelectedTest] = useState<ChemistryTestType | null>(null);
  const [mode, setMode] = useState<ParticipationMode | null>(null);
  const [invite, setInvite] = useState<InvitePayload | null>(null);

  useEffect(() => {
    const initializeInvite = () => {
      const token = window.location.hash.startsWith('#invite=')
        ? window.location.hash.slice('#invite='.length)
        : '';
      const payload = token ? parseInviteToken(token) : null;
      if (!payload) return;
      setInvite(payload);
      setSelectedTest(payload.testType);
      setMode('invite');
    };
    const timeout = window.setTimeout(initializeInvite, 0);
    return () => window.clearTimeout(timeout);
  }, []);

  const resetSelection = () => {
    setSelectedTest(null);
    setMode(null);
    setInvite(null);
    if (window.location.hash) window.history.replaceState(null, '', window.location.pathname);
  };

  if (!selectedTest) {
    return (
      <section className="rounded-[2rem] border border-white/80 bg-white/85 p-5 shadow-2xl shadow-pink-200/50 backdrop-blur md:p-8">
        <TestSelector onSelect={(testType) => {
          setSelectedTest(testType);
          setMode(null);
        }} />
      </section>
    );
  }

  if (selectedTest === 'overall') {
    return <CompatibilityExperience onChooseTest={resetSelection} />;
  }

  if (!mode) {
    const test = CHEMISTRY_TESTS.find(({ id }) => id === selectedTest);
    if (!test) return null;
    return (
      <ParticipationSelector
        test={test}
        onSelect={setMode}
        onBack={resetSelection}
      />
    );
  }

  return (
    <MiniChemistryExperience
      testType={selectedTest}
      mode={mode}
      invite={invite}
      onChooseMode={() => {
        setMode(null);
        setInvite(null);
        if (window.location.hash) window.history.replaceState(null, '', window.location.pathname);
      }}
      onChooseTest={resetSelection}
    />
  );
}
