import React from 'react';
import './ManagingCommittee.css';

// Traditional Lotus Motif SVG
const LotusIcon = ({ className = 'w-6 h-6', color = '#B49350' }) => (
  <svg
    viewBox="0 0 100 70"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    {/* Center petal */}
    <path
      d="M50 8 C50 8 58 25 58 42 C58 50 54 55 50 56 C46 55 42 50 42 42 C42 25 50 8 50 8 Z"
      fill={color}
    />
    {/* Inner side petals */}
    <path
      d="M50 18 C58 26 72 34 72 45 C72 52 66 56 60 56 C55 56 52 53 50 50 C48 53 45 56 40 56 C34 56 28 52 28 45 C28 34 42 26 50 18 Z"
      fill={color}
      opacity="0.88"
    />
    {/* Outer side petals */}
    <path
      d="M50 28 C62 34 84 40 84 50 C84 56 78 59 72 59 C65 59 58 55 54 50 C52 53 48 55 46 55 C42 55 35 59 28 59 C22 59 16 56 16 50 C16 40 38 34 50 28 Z"
      fill={color}
      opacity="0.75"
    />
    {/* Base pod / calyx */}
    <path
      d="M36 57 C42 61 58 61 64 57 C61 61 56 63 50 63 C44 63 39 61 36 57 Z"
      fill={color}
    />
    <circle cx="50" cy="46" r="2.5" fill="#FAF6EE" />
  </svg>
);

// Small decorative divider with central diamond
const CardDivider = ({ className = 'my-2' }) => (
  <div
    className={`flex items-center justify-center gap-1.5 w-16 mx-auto ${className}`}
    aria-hidden="true"
  >
    <span className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-[#B49350]/60" />
    <span className="w-1.5 h-1.5 rotate-45 bg-[#B49350]/80 shrink-0" />
    <span className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-[#B49350]/60" />
  </div>
);

// Ornamental corner brackets component
const CardCorners = () => (
  <>
    <div className="mc-card-inner" aria-hidden="true" />
    <span className="mc-corner mc-corner-tl" aria-hidden="true" />
    <span className="mc-corner mc-corner-tr" aria-hidden="true" />
    <span className="mc-corner mc-corner-bl" aria-hidden="true" />
    <span className="mc-corner mc-corner-br" aria-hidden="true" />
  </>
);

// Office Bearers Data
const PRESIDENT = {
  designation: 'PRESIDENT',
  name: 'Yaggati Pratap',
};

const LEADERSHIP_ROW = [
  { designation: 'VICE PRESIDENT', name: 'Vitta Radhika' },
  { designation: 'SECRETARY', name: 'Medehal Raghunath' },
  { designation: 'JOINT SECRETARY', name: 'Br. Narayana Chaitanya' },
  { designation: 'JOINT SECRETARY', name: 'K.G. Ramesh' },
];

const TREASURER = {
  designation: 'TREASURER',
  name: 'M. Jagadeesh Chandra Bose',
};

// Honorary Members Data
const HONORARY_MEMBERS = [
  'Vitta Ramesh',
  'Adappa Mohan Reddy',
  'H. Sujatha',
];

// 7 Committee Members Data
const COMMITTEE_MEMBERS = [
  'E. Sreenivasulu',
  'B. Sreenivasulu Setty',
  'K. Bhagya Lakshmi',
  'K. Jaya Lakshmi',
  'U. Jyothi',
  'P. Ramesh Kummar',
  'T. G. Murali',
];

export const ManagingCommittee = () => {
  return (
    <section
      aria-label="Managing Committee"
      className="mc-section rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 space-y-10 sm:space-y-12 relative overflow-hidden transition-all duration-300"
    >
      {/* ---------------------------------------------------- */}
      {/* 1. SECTION HEADING GROUP                             */}
      {/* ---------------------------------------------------- */}
      <header className="text-center space-y-3 max-w-2xl mx-auto">
        {/* Lotus Motif between horizontal gold lines */}
        <div className="flex items-center justify-center gap-3 sm:gap-4 w-full">
          <span className="h-[1px] w-12 sm:w-20 bg-gradient-to-r from-transparent via-[#B49350]/80 to-[#B49350]" />
          <LotusIcon className="w-6 h-6 sm:w-8 sm:h-8 shrink-0 text-[#B49350]" color="#B49350" />
          <span className="h-[1px] w-12 sm:w-20 bg-gradient-to-l from-transparent via-[#B49350]/80 to-[#B49350]" />
        </div>

        {/* Small uppercase label */}
        <p className="text-xs sm:text-sm mc-designation uppercase">
          OUR CENTER
        </p>

        {/* Main Heading */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mc-heading-serif mc-text-navy tracking-wide">
          MANAGING COMMITTEE
        </h2>

        {/* Decorative gold divider beneath heading */}
        <div className="flex items-center justify-center gap-2 pt-0.5" aria-hidden="true">
          <span className="w-8 sm:w-12 h-[1px] bg-gradient-to-r from-transparent to-[#B49350]" />
          <span className="w-1.5 h-1.5 rotate-45 bg-[#B49350]" />
          <span className="w-12 sm:w-16 h-[1.5px] bg-[#B49350]" />
          <span className="w-1.5 h-1.5 rotate-45 bg-[#B49350]" />
          <span className="w-8 sm:w-12 h-[1px] bg-gradient-to-l from-transparent to-[#B49350]" />
        </div>

        {/* Subtitle */}
        <p className="text-sm sm:text-base mc-text-subtitle font-medium leading-relaxed">
          Working together for a stronger community and a brighter future
        </p>
      </header>

      {/* ---------------------------------------------------- */}
      {/* 2. OFFICE BEARERS SECTION                            */}
      {/* ---------------------------------------------------- */}
      <div className="space-y-6 sm:space-y-8">
        {/* PRESIDENT (Prominent, Centered Card) */}
        <div className="flex justify-center">
          <article className="mc-card w-full max-w-md p-6 sm:p-7 flex flex-col items-center justify-center text-center">
            <CardCorners />
            <span className="text-xs sm:text-sm mc-designation uppercase">
              {PRESIDENT.designation}
            </span>
            <CardDivider className="my-2.5 w-20" />
            <h3 className="text-xl sm:text-2xl md:text-[26px] font-bold mc-name-serif mc-text-navy leading-snug">
              {PRESIDENT.name}
            </h3>
          </article>
        </div>

        {/* LEADERSHIP ROW (Vice President, Secretary, 2 Joint Secretaries) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {LEADERSHIP_ROW.map((member, index) => (
            <article
              key={index}
              className="mc-card p-4 sm:p-5 flex flex-col items-center justify-center text-center min-h-[110px]"
            >
              <CardCorners />
              <span className="text-[11px] sm:text-xs mc-designation uppercase">
                {member.designation}
              </span>
              <CardDivider className="my-2 w-16" />
              <h3 className="text-base sm:text-lg font-bold mc-name-serif mc-text-navy leading-snug">
                {member.name}
              </h3>
            </article>
          ))}
        </div>

        {/* TREASURER (Centered Card below leadership row - sized identical to Joint Secretary cards) */}
        <div className="flex justify-center">
          <article className="mc-card w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(25%-0.9375rem)] max-w-xs p-4 sm:p-5 flex flex-col items-center justify-center text-center min-h-[110px]">
            <CardCorners />
            <span className="text-[11px] sm:text-xs mc-designation uppercase">
              {TREASURER.designation}
            </span>
            <CardDivider className="my-2 w-16" />
            <h3 className="text-base sm:text-lg font-bold mc-name-serif mc-text-navy leading-snug">
              {TREASURER.name}
            </h3>
          </article>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 3. HONORARY MEMBERS HEADING & GRID                   */}
      {/* ---------------------------------------------------- */}
      <div className="space-y-6 pt-2">
        {/* Honorary Members Heading with decorative lines */}
        <div className="flex items-center justify-center gap-3 sm:gap-4 max-w-md mx-auto">
          <div className="flex items-center gap-1.5 flex-1 justify-end">
            <span className="h-[1px] w-full bg-gradient-to-r from-transparent to-[#B49350]" />
            <span className="w-1.5 h-1.5 rotate-45 bg-[#B49350] shrink-0" />
          </div>
          <h3 className="mc-heading-serif text-sm sm:text-lg md:text-xl font-bold tracking-wider mc-text-navy uppercase text-center px-1 sm:px-2 shrink-0">
            HONORARY MEMBERS
          </h3>
          <div className="flex items-center gap-1.5 flex-1 justify-start">
            <span className="w-1.5 h-1.5 rotate-45 bg-[#B49350] shrink-0" />
            <span className="h-[1px] w-full bg-gradient-to-l from-transparent to-[#B49350]" />
          </div>
        </div>

        {/* Honorary Members 3-card Grid: 3 cards in one line */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6 max-w-4xl mx-auto">
          {HONORARY_MEMBERS.map((name, index) => (
            <article
              key={index}
              className="mc-card p-4 sm:p-5 flex flex-col items-center justify-center text-center min-h-[96px] sm:min-h-[104px]"
            >
              <CardCorners />
              <CardDivider className="my-1.5 w-14" />
              <h4 className="text-sm sm:text-base font-bold mc-name-serif mc-text-navy leading-snug">
                {name}
              </h4>
            </article>
          ))}
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 4. COMMITTEE MEMBERS HEADING & GRID                  */}
      {/* ---------------------------------------------------- */}
      <div className="space-y-6 pt-2">
        {/* Committee Members Heading with decorative lines */}
        <div className="flex items-center justify-center gap-3 sm:gap-4 max-w-md mx-auto">
          <div className="flex items-center gap-1.5 flex-1 justify-end">
            <span className="h-[1px] w-full bg-gradient-to-r from-transparent to-[#B49350]" />
            <span className="w-1.5 h-1.5 rotate-45 bg-[#B49350] shrink-0" />
          </div>
          <h3 className="mc-heading-serif text-sm sm:text-lg md:text-xl font-bold tracking-wider mc-text-navy uppercase text-center px-1 sm:px-2 shrink-0">
            COMMITTEE MEMBERS
          </h3>
          <div className="flex items-center gap-1.5 flex-1 justify-start">
            <span className="w-1.5 h-1.5 rotate-45 bg-[#B49350] shrink-0" />
            <span className="h-[1px] w-full bg-gradient-to-l from-transparent to-[#B49350]" />
          </div>
        </div>

        {/* Committee Members 7-card Grid: 3 per row on Desktop, Centered 7th Card */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-6 max-w-4xl mx-auto">
          {COMMITTEE_MEMBERS.map((name, index) => {
            const isLast = index === COMMITTEE_MEMBERS.length - 1;

            return (
              <article
                key={index}
                className={`mc-card p-4 sm:p-5 flex flex-col items-center justify-center text-center min-h-[96px] sm:min-h-[104px] ${
                  isLast
                    ? 'md:col-start-2 sm:max-md:col-span-2 sm:max-md:max-w-xs sm:max-md:mx-auto sm:max-md:w-full'
                    : ''
                }`}
              >
                <CardCorners />
                <CardDivider className="my-1.5 w-14" />
                <h4 className="text-sm sm:text-base font-bold mc-name-serif mc-text-navy leading-snug">
                  {name}
                </h4>
              </article>
            );
          })}
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 4. BOTTOM DECORATIVE FOOTER DIVIDER                  */}
      {/* ---------------------------------------------------- */}
      <footer className="pt-6 sm:pt-8 border-t border-[#B49350]/30 flex flex-col items-center justify-center gap-2.5">
        <LotusIcon className="w-5 h-5 sm:w-6 sm:h-6 text-[#B49350]" color="#B49350" />
        <p className="mc-heading-serif text-[11px] sm:text-xs font-semibold tracking-[0.25em] text-[#9A7632] uppercase text-center">
          TRADITION • SERVICE • TOGETHERNESS
        </p>
      </footer>
    </section>
  );
};

export default ManagingCommittee;
