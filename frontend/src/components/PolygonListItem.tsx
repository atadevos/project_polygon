import React from 'react';
import { AppState, AppStateEnum } from '../type/types';
import { HashLoader } from 'react-spinners';

interface PolygonListItemProps {
  id: number;
  name: string;
  appState: AppState;
  selectedPolygon: number | null;
  onDelete: (id: number) => void;
  toggleSelect: (id: number) => void;
}

const PolygonListItem: React.FC<PolygonListItemProps> = ({ id, name, appState, selectedPolygon, onDelete, toggleSelect }) => {

  const actionsDisabled = appState.state === AppStateEnum.DELETING || appState.state === AppStateEnum.SAVEING_DRAWING;
  return (
    <div className={`${selectedPolygon === id ? 'border-blue-500 border' : ''} flex justify-between items-center p-4
      ${actionsDisabled ? '' : ''}  rounded-lg mb-4 ${actionsDisabled ? 'bg-gray-300' : 'bg-white shadow-md hover:bg-gray-50 transition duration-300 ease-in-out'}`}>
      <div
        onClick={() => { return actionsDisabled ? '' : toggleSelect(id)}}
        className={`text-lg font-semibold text-gray-800 cursor-pointer ${actionsDisabled ?'' : 'hover:text-blue-500 transition duration-300 ease-in-out'}`}
      >
        {name}
      </div>

      <div>
        <button
          disabled={actionsDisabled}
          onClick={() => onDelete(id)}
          className="text-sm text-red-500 hover:text-red-700 focus:outline-none transition duration-300 ease-in-out"
        >
          Delete
        </button>
      </div>
    </div>
  );

}

export default PolygonListItem;