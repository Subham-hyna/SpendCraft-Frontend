import CalendarScreen from '@/screens/CalendarScreen'
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Calender | SpendCraft",
  description: "Calender page",
};

const CalendarPage = () => {
  return (
    <CalendarScreen />
  )
}

export default CalendarPage;