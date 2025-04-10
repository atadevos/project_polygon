import React, { useRef, useState } from 'react';
import { AppState, AppStateEnum } from '../type/types';

export const PolygonNameErrorEvent = 'polygonNameError';

interface PolygonCreateFormProps {
    appState: AppState;
    reset: () => void;
    createPolygon: (name: string) => Promise<AppStateEnum>;
}

const PolygonCreateForm: React.FC<PolygonCreateFormProps> = ({ appState, reset, createPolygon: createPolygon }) => {
    const [newPolygonName, setNewPolygonName] = useState<string>('');
    const createInputRef = useRef<HTMLInputElement>(null);

    const isPolygonNameInvalid = (
        appState.state === AppStateEnum.ERROR_SAVING_DRAWING &&
        !!appState.payload?.[PolygonNameErrorEvent]
    );


    const createPolygonButtonEnabled =
        [AppStateEnum.DRAWING, AppStateEnum.ERROR_SAVING_DRAWING, AppStateEnum.IDLE].includes(appState.state) && newPolygonName!== '';


    return (
        <div className="flex flex-col items-center space-x-4">
            <div className='w-full mb-3'>
                <input
                    disabled={appState.state === AppStateEnum.DRAWING ? true : false}
                    ref={createInputRef} type="text" value={newPolygonName}
                    name="polygonName" className={`w-full px-4 py-2 border rounded-lg shadow-sm
                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300
                        ease-in-out ${isPolygonNameInvalid ? 'border-red-500' : 'border-gray-300'
                        }`}
                    onChange={(e) => setNewPolygonName(e.target.value)} placeholder="Polygon Name" />
            </div>
            <div className='flex flex-row space-x-4' >
                <button
                    className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300
                        disabled:cursor-not-allowed transition duration-300 ease-in-out"
                    disabled={!createPolygonButtonEnabled}
                    onClick={async () => {
                        if (isPolygonNameInvalid) {
                            createInputRef.current?.focus();
                            return;
                        }
                        const state = await createPolygon(newPolygonName);

                        //delete the name of the polygon after submitting
                        if (state === AppStateEnum.IDLE) {
                            setNewPolygonName('');
                        }
                    }}>
                    {appState.state !== AppStateEnum.DRAWING ? 'Start' : 'Save'}
                </button>
                <button onClick={() => { reset(); setNewPolygonName(''); }}
                    className={`${appState.state !== AppStateEnum.DRAWING ? 'hidden ' : ' '} px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:bg-gray-300
                        disabled:cursor-not-allowed transition duration-300 ease-in-out`}>
                        Reset
                </button>
            </div>
        </div>
    );
}

export default PolygonCreateForm;