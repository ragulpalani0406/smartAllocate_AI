import { useCallback, useEffect, useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import DashboardView from './components/DashboardView';
import AllocationWizardView from './components/AllocationWizardView';
import EmployeeDirectoryView from './components/EmployeeDirectoryView';
import TaskManagementView from './components/TaskManagementView';
import EmailHubView from './components/EmailHubView';
import EmployeeDetailModal from './components/EmployeeDetailModal';
import DevReportsModal from './components/DevReportsModal';
import { fetchStats, fetchEmployeeById } from './api';
import './App.css';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isDevReportOpen, setIsDevReportOpen] = useState(false);
  const [taskForAllocation, setTaskForAllocation] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const loadStatsData = useCallback(async () => {
    try {
      const data = await fetchStats();
      setStats(data);
    } catch (err) {
      console.error('Error loading stats:', err);
    }
  }, []);

  useEffect(() => {
    loadStatsData();
  }, [loadStatsData]);

  const handleOpenEmployeeById = async (empId) => {
    try {
      const emp = await fetchEmployeeById(empId);
      setSelectedEmployee(emp);
    } catch (err) {
      console.error('Error loading employee:', err);
    }
  };

  const handleSelectTaskForAllocation = (task) => {
    setTaskForAllocation(task);
    setActiveTab('allocate');
  };

  const handleOpenNewAllocation = () => {
    setTaskForAllocation(null);
    setActiveTab('allocate');
  };

  const handleSidebarTabChange = (tab) => {
    if (tab === 'devreports') {
      setIsDevReportOpen(true);
    } else {
      if (tab === 'allocate') {
        setTaskForAllocation(null);
      }
      setActiveTab(tab);
    }

    setIsSidebarOpen(false);
  };

  return (
    <div className="app-shell bg-app min-h-screen w-full text-white flex flex-col" style={{ selection: 'background-color: rgba(0,230,118,0.4)' }}>
      <Header
        stats={stats}
        onReloadSuccess={loadStatsData}
        onOpenDevReport={() => setIsDevReportOpen(true)}
        onOpenNewAllocation={handleOpenNewAllocation}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      <div className="app-layout flex-1 flex min-h-0 min-w-0 overflow-hidden">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={handleSidebarTabChange}
          unreadNotificationsCount={stats?.notifications_count ?? 0}
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
        />

        <main className="app-main flex-1 min-h-0 min-w-0 overflow-y-auto overflow-x-hidden p-4 md:p-6 lg:p-8 pb-24 md:pb-8">
          <div className="app-content mx-auto w-full max-w-[1600px] text-left">
            {activeTab === 'dashboard' && (
              <DashboardView
                stats={stats}
                onNavigateTab={setActiveTab}
                onSelectEmployee={setSelectedEmployee}
              />
            )}

            {activeTab === 'allocate' && (
              <AllocationWizardView
                presetTask={taskForAllocation}
                onAllocationConfirmed={loadStatsData}
                onOpenEmployeeDetail={handleOpenEmployeeById}
              />
            )}

            {activeTab === 'directory' && (
              <EmployeeDirectoryView onSelectEmployee={setSelectedEmployee} />
            )}

            {activeTab === 'tasks' && (
              <TaskManagementView
                onSelectTaskForAllocation={handleSelectTaskForAllocation}
                onOpenEmployeeDetail={handleOpenEmployeeById}
              />
            )}

            {activeTab === 'notifications' && <EmailHubView />}
          </div>
        </main>
      </div>

      {selectedEmployee && (
        <EmployeeDetailModal
          employee={selectedEmployee}
          onClose={() => setSelectedEmployee(null)}
          onAssignTask={() => {
            setSelectedEmployee(null);
            handleOpenNewAllocation();
          }}
        />
      )}

      <DevReportsModal
        isOpen={isDevReportOpen}
        onClose={() => setIsDevReportOpen(false)}
      />
    </div>
  );
}
