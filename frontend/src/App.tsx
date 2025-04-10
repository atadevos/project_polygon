import React, { useState, useEffect } from 'react';
import useImage from 'use-image';
import { fetchPolygonsApi, createPolygonApi, deletePolygonApi } from './api';
import SideBar from './components/Sidebar';
import { AppState, AppStateEnum } from './type/types';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/16/solid';
import PoligonsPlate from './components/PolygonsPlate';
import { toast, ToastPosition, ToastOptions, Bounce, Theme, ToastContainer } from 'react-toastify';
import { PolygonNameErrorEvent } from './components/PolygonCreateForm';


interface Polygon {
  id: number;
  name: string;
  points: number[][];
}

const defaultAppstate = {
  state: AppStateEnum.IDLE,
  payload: {}
}


const showToast = (message: string, isError: boolean = true) => {
  const m = {
    position:  'top-right' as ToastPosition,
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
    transition: Bounce,
  };
  if (isError) {
    toast.error(message, m);
  } else {
    toast(message, m);
  }
};

const App: React.FC = () => {

  const [polygons, setPolygons] = useState<Polygon[]>([]);
  const [appState, setAppState] = useState<AppState>(defaultAppstate);
  const [isLeftBlockMinimized, setLeftBlockMinimized] = useState<boolean>(false);
  const [newPoints, setNewPoints] = useState<number[][]>([]);
  const [selectedPolygon, setSelectedPolygon] = useState<number | null>(null);

  useEffect(() => {
    const loadPolygons = async () => {
      try {
        setAppState(
          {
            ...appState,
            state: AppStateEnum.FETCHING
          }
        )
        const response = await fetchPolygonsApi();
        setPolygons(response.data);
      } catch (error) {
        showToast("Something went wrong, please retry");
        console.error('Error fetching polygons:', error);
      } finally {
        setAppState(
          {
            ...appState,
            state: AppStateEnum.IDLE
          }
        )
      }
    };
    loadPolygons();
  }, []);


  const toggleLeftBlock = () => {
    setLeftBlockMinimized(!isLeftBlockMinimized);
  };

  const reset = () => {
    setNewPoints([]);
    setAppState({
      state: AppStateEnum.IDLE,
      payload: {}
    });
  };

  const createPolygon = async (name: string): Promise<AppStateEnum> => {
    let returnSate = AppStateEnum.DRAWING;
    if (!name) {
      setAppState({
        state: AppStateEnum.ERROR_SAVING_DRAWING,
        payload: { [PolygonNameErrorEvent]: "Invalid name" }
      });
    } else {
      if (appState.state === AppStateEnum.DRAWING) {
        if (newPoints.length < 3) {
          showToast('A polygon must have at least 3 points');
        } else {
          //submit the polygon
          try {
            setAppState({
              state: AppStateEnum.SAVEING_DRAWING,
              payload: {}
            });
            const response = await createPolygonApi(name, newPoints);
            setPolygons([...polygons, { id: response.data.id, name, points: newPoints }]);
            setNewPoints([]);
            setAppState({
              state: AppStateEnum.IDLE,
              payload: {}
            });
            returnSate = AppStateEnum.IDLE;

          } catch (error) {
            showToast("Something went wrong, please retry");
            console.error('Error creating polygon:', error);
          }
        }
      } else {
        setAppState({
          state: AppStateEnum.DRAWING,
          payload: {}
        });
        showToast('Click on the canvas to create a polygon', false);
      }
    }

    return new Promise((resolve) => {
      resolve(returnSate);
    });

  }

  const deletePolygon = async (id: number) => {
    try {
      setAppState({
        state: AppStateEnum.DELETING,
        payload: {}
      });
      await deletePolygonApi(id);
      setPolygons(polygons.filter((p) => p.id !== id));
      console.log('deleted');
    } catch (error) {
      showToast("Something went wrong, please retry");
      console.error('Error deleting polygon:', error);
    } finally {
      setAppState({
        state: AppStateEnum.IDLE,
        payload: {}
      });
    }
  };

  const toggleSelectPolygon = (polygon: number) => {
    if (polygon === selectedPolygon) {
      setSelectedPolygon(null);
      return;
    }
    setSelectedPolygon(polygon);
  }

  const handleCanvasClick = (e: any) => {
    let toastText = '';
    switch (appState.state) {
      case AppStateEnum.FETCHING:
        toastText = 'Wait please, the app is loading yet';
        break
      default:
        toastText = 'Pick a name of your Poligon first';
        break;
    }

    if (appState.state === AppStateEnum.DRAWING) {
      const stage = e.target.getStage();
      const point = stage.getPointerPosition();
      setNewPoints([...newPoints, [point.x, point.y]]);
    } else {
      showToast(toastText);
    }
  };



  return (
    <div className="flex w-full">
      <div className={`transition-all z-10 duration-300 bg-gray-200 p-4 pt-10 fixed top-0 left-0 h-full ${isLeftBlockMinimized ? 'w-0' : 'w-1/5'}`}>
        <button
          onClick={toggleLeftBlock}
          className="absolute mt-1 mr-1 top-0 right-0 p-1 bg-blue-500 text-white rounded-full focus:outline-none"
        >
          {isLeftBlockMinimized ? (
            <ChevronRightIcon className="h-4 w-4" />
          ) : (
            <ChevronLeftIcon className="h-4 w-4" />
          )}
        </button>
        {!isLeftBlockMinimized && (
          <SideBar reset={reset} polygons={polygons} appState={appState} createPolygon={createPolygon} selectedPolygon={selectedPolygon} onDelete={deletePolygon} toggleSelect={toggleSelectPolygon} />
        )}
      </div>
      <div className="flex-1 p-0 ml-1/5 overflow-x-auto">
        <PoligonsPlate polygons={polygons} appState={appState} selectedPolygon={selectedPolygon} newPoints={newPoints} handleCanvasClick={handleCanvasClick} />
      </div>
      <ToastContainer />
    </div>
  );
};

export default App;