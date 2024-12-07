'use client'

import Banner from '@/components/Banner'
import LoansSection from '@/components/Loans'
import ReportsOverview from '@/components/ReportsOverview'
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
            <main className="flex-1 p-2 lg:ml-64">
                <Banner />

              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="w-full">
                  <ReportsOverview />
                </div>
                {/* <div className="w-full">
                  <PurchaseReturnChart />
                </div> */}
              </div>
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="w-full">
                  <LoansSection />
                </div>
                {/* <div className="w-full">
                  <PurchaseReturnChart />
                </div> */}
              </div>
            </main>
          </div>
        </div>
    </>
  )
}

export default dashboard