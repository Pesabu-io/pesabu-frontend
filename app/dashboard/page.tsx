import Sidebar from '@/components/Sidebar'
import UserHeader from '@/components/UserHeader'
import React from 'react'

function dashboard() {
  return (
    <>
         <div
          className={`min-h-screen flex flex-col transition-colors duration-300 ${
             "bg-themeTeal"
          }`}
        >
          {/* Include Header above Sidebar */}
          <UserHeader />
          <div className="flex flex-1">
            {/* Sidebar occupies the left part */}
            <Sidebar />
            {/* Main content shifts right beside the sidebar */}
            <main className="flex-1 p-2 lg:ml-64">children</main>
          </div>
        </div>
    </>
  )
}

export default dashboard