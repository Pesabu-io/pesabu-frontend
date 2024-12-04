import React from 'react';

function HomePage() {
  return (
    <div className="bg-themeTeal min-h-screen">
      {/* Header */}
      <header className="relative flex max-w-screen-xl flex-col px-4 py-4 text-white md:mx-auto md:flex-row md:items-center bg-themeTeal shadow-md">
        <a
          href="#"
          className="flex cursor-pointer items-center whitespace-nowrap text-2xl font-black text-white"
        >
          <span className="mr-2 text-4xl">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              role="img"
              width="1em"
              height="1em"
              preserveAspectRatio="xMidYMid meet"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M6.925 16.875Q5.2 16.225 4.1 14.713Q3 13.2 3 11.25q0-1.975.938-3.513Q4.875 6.2 6 5.15q1.125-1.05 2.062-1.6L9 3v2.475q0 .625.45 1.062q.45.438 1.075.438q.35 0 .65-.15q.3-.15.5-.425L12 6q.95.55 1.625 1.35t1.025 1.8l-1.675 1.675q-.05-.6-.287-1.175q-.238-.575-.638-1.05q-.35.2-.738.287q-.387.088-.787.088q-1.1 0-1.987-.612Q7.65 7.75 7.25 6.725q-.95.925-1.6 2.062Q5 9.925 5 11.25q0 .775.275 1.462q.275.688.75 1.213q.05-.5.287-.938q.238-.437.588-.787L9 10.1l2.15 2.1q.05.05.1.125t.1.125l-1.425 1.425q-.05-.075-.087-.125q-.038-.05-.088-.1L9 12.925l-.7.7q-.125.125-.212.287q-.088.163-.088.363q0 .3.175.537q.175.238.45.363ZM9 10.1Zm0 0ZM7.4 22L6 20.6L19.6 7L21 8.4L17.4 12H21v2h-5.6l-.5.5l1.5 1.5H21v2h-2.6l2.1 2.1l-1.4 1.4l-2.1-2.1V22h-2v-4.6l-1.5-1.5l-.5.5V22h-2v-3.6Z"
              />
            </svg>
          </span>
          Pesabu
        </a>
      </header>

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
                  <span className="absolute inset-0 text-transparent bg-clip-text bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500 text-2xl animate-pulse"></span>
                </span>
              </h2>

              {/* New Paragraph */}
              <p className="mb-6 text-base leading-relaxed sm:text-lg">
                Discover how cutting-edge AI technology can revolutionize your lending operations, optimize decision-making, and unlock new opportunities. With data-driven insights, the future of lending is here.
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
              src="/images/hero-image.png"
              alt="Hero Image"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
