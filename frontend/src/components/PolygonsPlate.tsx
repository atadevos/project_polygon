import React, { useRef, useState } from 'react';
import { Stage, Layer, Image, Line } from 'react-konva';
import { AppState, AppStateEnum, Polygon } from '../type/types';
import { useImage } from 'react-konva-utils';


interface PoligonsPlateProps {
    polygons: Polygon[];
    selectedPolygon: number | null;
    handleCanvasClick: (e: any) => void;
    appState: AppState;
    newPoints: number[][];
}

const PoligonsPlate: React.FC<PoligonsPlateProps> = ({ polygons, appState, selectedPolygon, newPoints, handleCanvasClick }) => {

    const [backgroundImage] = useImage('https://picsum.photos/1920/1080');

    let pColor = "red";
    let pWidth = 2;

    return (
        <Stage width={1920} height={1080} onClick={handleCanvasClick} >
            <Layer>
                <Image image={backgroundImage} width={1920} height={1080} />
                {polygons.map((polygon) => (
                    <Line
                        key={polygon.id}
                        points={polygon.points.flat()}
                        stroke= {selectedPolygon === polygon.id ? 'green': 'red'}
                        strokeWidth= {selectedPolygon === polygon.id ? 2 : 1}
                        closed
                    />
                ))}
                {appState.state === AppStateEnum.DRAWING && newPoints.length > 0 && (
                    <Line points={newPoints.flat()} stroke="green" strokeWidth={2} />
                )}
            </Layer>
        </Stage>
    )

}


export default PoligonsPlate;