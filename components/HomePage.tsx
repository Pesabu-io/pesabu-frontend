import React from 'react';
import Header from './Header';

function HomePage() {
  return ( 
    <div className="bg-themeTeal min-h-screen ">
      <div className='max-w-7xl mx-auto'>

      {/* Header */}
      <Header />

      {/* Hero Section */}
      <div className="mx-auto h-full px-4 py-10 sm:max-w-xl md:max-w-full md:px-24 md:py-36 lg:max-w-screen-xl lg:px-8 text-white">
        <div className="flex flex-col items-center justify-between lg:flex-row">
          <div>
            <div className="lg:max-w-xl lg:pr-5">
              {/* Adjusted Heading */}
              <h2 className="mb-4 max-w-lg text-3xl font-light leading-snug tracking-tight sm:text-5xl">
                Transforming Lending <br />
                <span className="my-1 inline-block font-bold relative text-transparent bg-clip-text bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500">
                  with AI-powered insights
                </span>
              </h2>

              {/* New Paragraph */}
              <p className="mb-6 text-base leading-relaxed sm:text-lg">
                Discover how cutting-edge AI technology can revolutionize your
                lending operations, optimize decision-making, and unlock new
                opportunities. With data-driven insights, the future of lending
                is here.
              </p>
            </div>

            <div className="mt-10 flex flex-col items-center md:flex-row">
              <a
                href="/"
                className="mb-3 inline-flex h-12 w-full items-center justify-center rounded bg-white px-6 font-medium tracking-wide text-themeTeal shadow-md transition duration-200 md:mr-4 md:mb-0 md:w-auto focus:outline-none hover:bg-gray-200"
              >
                Get Started
              </a>
              <a
                href="/"
                aria-label=""
                className="underline-offset-2 inline-flex items-center font-semibold underline transition-colors duration-200 hover:underline"
              >
                Watch how it works
              </a>
            </div>
          </div>
          <div className="relative hidden lg:ml-32 lg:block lg:w-1/2">
            <img
              className="rounded-3xl shadow-xl"
              src="https://www.pesabu.co.ke/images/463/12160989/bg.png"
              alt="Hero Image"
            />
          </div>
        </div>
      </div>
      </div>

    </div>
  );
}

export default HomePage;
