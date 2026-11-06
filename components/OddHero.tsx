import React from 'react';

export default function OddHero() {
  return (
    <section className="text-center py-20 bg-white">
      <h1 className="text-4xl font-bold text-emerald-600">
        raise a price
      </h1>
      <p className="mt-4 text-lg text-gray-600">
        Digital QR menus for restaurants, cafés and hotels.
      </p>
      <div className="mt-8 flex justify-center gap-4">
        <a
          href="/demo"
          className="px-6 py-2 bg-emerald-600 text-white rounded"
        >
          Menu example
        </a>
        <a
          href="/signup"
          className="px-6 py-2 border border-emerald-600 text-emerald-600 rounded"
        >
          Create QR menu
        </a>
      </div>
    </section>
  );
}
