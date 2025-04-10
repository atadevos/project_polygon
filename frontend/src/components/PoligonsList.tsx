import React, { useRef, useState } from 'react';
import PolygonListItem from './PolygonListItem';
import PolygonCreateForm from './PolygonCreateForm';
import { AppState, AppStateEnum, Polygon } from '../type/types';
import { HashLoader } from 'react-spinners';


interface PoligonsListProps {
    polygons: Polygon[];
    appState: AppState;
    selectedPolygon: number | null;
    onDelete: (id: number) => void;
    toggleSelect: (id: number) => void;
}

const PoligonsList: React.FC<PoligonsListProps> = ({ polygons, appState, selectedPolygon, onDelete, toggleSelect }) => {
    if (appState.state === AppStateEnum.FETCHING) {
        return (
            <div className="flex justify-center items-center h-64">
                <HashLoader color="#4B8BF9" size={30} />
                <div className="ml-4 text-lg text-gray-500">Loading...</div>
            </div>
        );
    }

    const showLoading = appState.state === AppStateEnum.DELETING || appState.state === AppStateEnum.SAVEING_DRAWING ?
        (      <div className="justify-center items-center h-64">
            <HashLoader color="#4B8BF9" size={50} />
            <div className="ml-4 text-lg text-gray-500">Loading...</div>
          </div>) : (<></>);

    return (
        <div className='flex flex-col h-full w-full'>
            <div className='max-h-[90%] overflow-y-auto mb-4'>
                {polygons.map((polygon) => (
                    <PolygonListItem
                        key={polygon.id}
                        appState={appState}
                        selectedPolygon={selectedPolygon}
                        id={polygon.id}
                        name={polygon.name}
                        onDelete={onDelete}
                        toggleSelect={toggleSelect}
                    />
                ))}

            </div>
            <div className="max-h-[10%]">
                {showLoading}
            </div>
        </div>
    );
};

export default PoligonsList;