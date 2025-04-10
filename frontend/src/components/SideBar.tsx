import React, { useRef, useState } from 'react';
import PolygonListItem from './PolygonListItem';
import PolygonCreateForm from './PolygonCreateForm';
import { AppState, AppStateEnum, Polygon } from '../type/types';
import PoligonsList from './PoligonsList';

interface SidebarProps {
    polygons: Polygon[];
    appState: AppState;
    selectedPolygon: number | null;
    reset: () => void;
    onDelete: (id: number) => void;
    toggleSelect: (id: number) => void;
    createPolygon: (name: string)  => Promise<AppStateEnum>;
}

const SideBar: React.FC<SidebarProps> = ({ polygons, appState, createPolygon, reset, selectedPolygon, onDelete, toggleSelect }) => {

    return (
        <div className="h-full flex flex-col">
            <div className="h-[15%]">
                <PolygonCreateForm appState={appState} reset={reset} createPolygon={createPolygon} />
            </div>
            <div className="h-[85%]">
                <PoligonsList appState={appState} onDelete={onDelete} selectedPolygon={selectedPolygon}
                    toggleSelect={toggleSelect} polygons={polygons} />
            </div>
        </div>
    );
}

export default SideBar;