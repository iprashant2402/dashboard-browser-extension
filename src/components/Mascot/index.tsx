import { Canvas } from "@react-three/fiber";
import { useFrame } from "@react-three/fiber";
import "./index.css";
import { Mesh } from "three";
import { useRef, useState } from "react";
import { CommandCenter } from "../CommandCenter";

export const MascotContainer = () => {

    return <div className="mascot">
        <CommandCenter />
        <Canvas className="mascot-canvas">
            <Mascot />
        </Canvas>
    </div>;
}

const Mascot = () => {
    const myMesh = useRef<Mesh>(null);
    const [radius, _] = useState(2);

    useFrame(() => {
        if (myMesh.current) {
            myMesh.current.rotation.y += 0.01;
        }
    });

    return (
        <mesh ref={myMesh}>
            <directionalLight color="#47A8BD" position={[0, 8, -5]} />
            <directionalLight color="#9C3848" position={[4, 4, 5]} />
            <directionalLight color="#7D53DE" position={[-4, -4, 5]} />
            <sphereGeometry  args={[radius, 64, 64]} />
            <meshPhongMaterial color="#FFFFFF" />
        </mesh>
    );
};
//     const canvasRef = useRef<HTMLCanvasElement>(null);
//     const [isBlinking, setIsBlinking] = useState(false);

//     useEffect(() => {
//         const canvas = canvasRef.current;
//         if (!canvas) return;

//         const ctx = canvas.getContext('2d');
//         if (!ctx) return;

//         const drawCat = () => {
//             ctx.clearRect(0, 0, canvas.width, canvas.height);

//             // Face
//             ctx.beginPath();
//             ctx.arc(150, 150, 100, 0, Math.PI * 2);
//             ctx.strokeStyle = '#FFFFFF';
//             ctx.lineWidth = 3;
//             ctx.stroke();

//             // // Ears
//             // ctx.beginPath();
//             // ctx.moveTo(80, 80);
//             // ctx.lineTo(50, 50);
//             // ctx.lineTo(110, 70);
//             // ctx.closePath();
//             // ctx.stroke();

//             // ctx.beginPath();
//             // ctx.moveTo(220, 80);
//             // ctx.lineTo(250, 30);
//             // ctx.lineTo(190, 70);
//             // ctx.closePath();
//             // ctx.stroke();

//             // Eyes
//             if (!isBlinking) {
//                 ctx.beginPath();
//                 ctx.arc(110, 130, 15, 0, Math.PI * 2);
//                 ctx.stroke();

//                 ctx.beginPath();
//                 ctx.arc(190, 130, 15, 0, Math.PI * 2);
//                 ctx.stroke();
//             } else {
//                 ctx.beginPath();
//                 ctx.moveTo(95, 130);
//                 ctx.lineTo(125, 130);
//                 ctx.stroke();

//                 ctx.beginPath();
//                 ctx.moveTo(175, 130);
//                 ctx.lineTo(205, 130);
//                 ctx.stroke();
//             }

//             // Nose
//             ctx.beginPath();
//             ctx.moveTo(150, 150);
//             ctx.lineTo(150, 180);
//             ctx.lineTo(160, 170);
//             ctx.stroke();

//             // Mouth
//             ctx.beginPath();
//             ctx.arc(150, 190, 20, 0, Math.PI);
//             ctx.stroke();
//         };

//         drawCat();

//         // Blink every 3 seconds
//         const blinkInterval = setInterval(() => {
//             setIsBlinking(true);
//             setTimeout(() => setIsBlinking(false), 200);
//         }, 3000);

//         return () => clearInterval(blinkInterval);
//     }, [isBlinking]);

//     return (
//         <div className="mascot">
//             <canvas
//                 ref={canvasRef}
//                 width={300}
//                 height={300}
//                 style={{ background: 'transparent' }}
//             />
//         </div>
//     );
// };