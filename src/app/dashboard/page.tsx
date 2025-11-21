import Header from '@/components/Header';
import OverviewCards from '@/components/OverviewCards';
import Announcements from '@/components/Announcements';
import Tasks from '@/components/Tasks';
import BuildingMap from '@/components/BuildingMap';
import Footer from '@/components/Footer';

export default function DashboardPage() {
  return (
    <div className="app">
      <Header />
      <main className="main-container">
        <OverviewCards />
        <div className="two-column-grid">
          <Announcements />
          <Tasks />
        </div>
        <BuildingMap />
      </main>
      <Footer />
    </div>
  );
}

