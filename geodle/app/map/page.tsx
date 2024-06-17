'use client'

import dynamic from 'next/dynamic';
import React from 'react';
import { useCityData } from '../context/CityDataContext';
import Loader from '../components/Layout/Loader';
import { DEBUG } from '../lib/definitions';

const MapPanel = dynamic(() => import('../components/MapPanel/Index'), { ssr: false });

const Map = () => {
  const { randomCity } = useCityData();

  return randomCity ? (
    <div className="flex flex-col justify-center items-center">
      <MapPanel />
      {DEBUG ? (
        <h4 className="my-4 text-xl text-center font-bold dark:text-slate">
          {randomCity.nom_commune}
        </h4>
      ) : (
        ''
      )}
    </div>
  ) : (
    <Loader />
  );
};

export default Map;
