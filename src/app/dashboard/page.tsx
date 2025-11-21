import Header from '@/components/Header';
import Greeting from '@/components/Greeting';
import OverviewCards from '@/components/OverviewCards';
import MainMenu from '@/components/MainMenu';
import Announcements from '@/components/Announcements';
import Footer from '@/components/Footer';

export default function DashboardPage() {
  return (
    <div className="dashboard-page">
      <Header />
      <main className="dashboard-main">
        <Greeting />
        <OverviewCards />
        <MainMenu />
        <Announcements />
      </main>
      <Footer />
    </div>
  );
}

