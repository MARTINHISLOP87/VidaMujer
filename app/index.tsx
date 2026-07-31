import { Redirect } from 'expo-router';
import { ScreenLoader } from '@/components/common/ScreenLoader';
import { useApp } from '@/contexts/AppContext';
export default function Index() { const { profile, isLoading } = useApp(); if (isLoading) return <ScreenLoader />; return <Redirect href={profile?.onboarded ? '/(tabs)' : '/onboarding'} />; }
